import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import crypto from "crypto";

// global constants
const currency = 'inr';
const deliveryCharge = 10;

const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    if (!items?.length) {
      return res.json({ success: false, message: "No items in cart" });
    }

    const orderData = {
      userId,
      items: items.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      })),
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      status: "Pending",
      date: new Date()
    };

    const newOrder = await orderModel.create(orderData);
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;
    if (!items?.length) {
      return res.json({ success: false, message: "No items in cart" });
    }

    // save order first
    const orderData = {
      userId,
      items: items.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      })),
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      status: "Pending",
      date: new Date()
    };
    const newOrder = await orderModel.create(orderData);

    // build Stripe line items
    const line_items = items.map(item => ({
      price_data: {
        currency,
        product_data: { name: item.name, images: [item.image] },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));
    line_items.push({
      price_data: {
        currency,
        product_data: { name: 'Delivery Charges' },
        unit_amount: deliveryCharge * 100
      },
      quantity: 1
    });

    // grab the configured instance
    const stripe = req.app.locals.stripe;
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      return res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    if (!items?.length) {
      return res.json({ success: false, message: "No items in cart" });
    }

    const orderData = {
      userId,
      items: items.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      })),
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      status: "Pending",
      date: new Date()
    };
    const newOrder = await orderModel.create(orderData);

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString()
    };

    // grab the configured instance
    const razorpay = req.app.locals.razorpay;
    razorpay.orders.create(options, (error, order) => {
      if (error) {
        console.error(error);
        return res.json({ success: false, message: error });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { userId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const razorpay = req.app.locals.razorpay;

    // fetch order details
    const orderInfo = await razorpay.orders.fetch(razorpay_order_id);

    // verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature && orderInfo.status === 'paid') {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      return res.json({ success: true, message: "Payment Successful" });
    }
    return res.json({ success: false, message: "Payment verification failed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getOrderByStripeSessionId = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const order = await orderModel.findOne({ stripeSessionId: sessionId });
    if (!order) {
      return res.json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  verifyStripe,
  placeOrderRazorpay,
  verifyRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  deleteOrder
};
