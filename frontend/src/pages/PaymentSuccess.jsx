import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:4000/api/order/by-stripe-session/${sessionId}`);
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError('Order not found.');
        }
      } catch (err) {
        setError('Failed to fetch order.');
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) fetchOrder();
    else setError('No session ID provided.');
  }, [sessionId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow mt-12">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Payment Successful!</h1>
      <p className="mb-6">Thank you for your purchase. Your order has been placed and payment confirmed.</p>
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Order Summary</h2>
        <div className="bg-gray-50 p-4 rounded">
          <div><b>Order ID:</b> {order._id}</div>
          <div><b>Amount:</b> ${order.amount}</div>
          <div><b>Status:</b> {order.paymentStatus}</div>
          <div><b>Payment Method:</b> {order.paymentMethod}</div>
        </div>
      </div>
      <Link to="/orders" className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">View My Orders</Link>
    </div>
  );
};

export default PaymentSuccess; 