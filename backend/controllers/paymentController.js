import stripe from "../config/stripe.js";
import orderModel from "../models/orderModel.js";

// IMPORTANT: Paste your Stripe webhook signing secret here.
// Get it from your Stripe Dashboard > Developers > Webhooks, or from the Stripe CLI output after running `stripe listen`.
const endpointSecret = "whsec_51653f7254b147c5efbd476bec60879083183032cc3949c7469982e297f02932";

const paymentController = {
  createCheckoutSession: async (req, res) => {
    try {
      const { items, email, address, userId, amount } = req.body;
      // For demo: map items to Stripe line items (replace with real product data in production)
      const line_items = items.map(item => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // price in cents
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        customer_email: email,
        success_url: "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:5173/payment-failed",
      });

      // Create order in DB with paymentStatus 'pending'
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
        paymentMethod: "stripe",
        payment: false,
        paymentStatus: "pending",
        stripeSessionId: session.id,
        date: Date.now()
      };
      await orderModel.create(orderData);

      res.json({ url: session.url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create Stripe session" });
    }
  },

  stripeWebhook: async (req, res) => {
    console.log('Stripe webhook received. req.body type:', typeof req.body, 'isBuffer:', Buffer.isBuffer(req.body), 'length:', req.body?.length);
    let event;
    try {
      const sig = req.headers['stripe-signature'];
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      try {
        // Find order by Stripe session ID or customer email
        let order = await orderModel.findOne({ stripeSessionId: session.id });
        if (!order && session.customer_email) {
          order = await orderModel.findOne({ 'address.email': session.customer_email, paymentStatus: 'pending' });
        }
        if (order) {
          order.payment = true;
          order.paymentStatus = 'paid';
          order.stripeSessionId = session.id;
          order.stripePaymentIntentId = session.payment_intent;
          await order.save();
          console.log('Order marked as paid:', order._id);
        } else {
          console.warn('Order not found for session:', session.id);
        }
      } catch (err) {
        console.error('Error updating order after payment:', err);
      }
    }
    res.json({ received: true });
  }
};

export default paymentController; 