import  { useContext, useState, useEffect } from 'react'
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { jwtDecode } from 'jwt-decode';

const PlaceOrder = () => {
  
  const [method, setMethod] = useState('cod');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { navigate, backendUrl, token, cartItems, setCartItem, getCartAmount, delivery_fee, products, getCartItems } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:''
  })
  const [stripeLoading, setStripeLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/address/get`, {
          headers: { token }
        });
        if (data.success) {
          setSavedAddresses(data.addresses);
        } else {
          toast.error(data.message || 'Failed to fetch addresses');
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch saved addresses');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, [backendUrl, token]);

  const saveNewAddress = async () => {
    try {
      // Validate form data before sending
      if (!formData.firstName || !formData.lastName || !formData.street || !formData.city || 
          !formData.state || !formData.zipcode || !formData.country || !formData.phone) {
        toast.error('Please fill all required fields');
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/address/save`, 
        { 
          address: formData,
          userId: token // Add userId to the request body
        },
        { 
          headers: { token } 
        }
      );

      if (data.success) {
        setSavedAddresses(data.addresses);
        setShowAddressForm(false);
        setSelectedAddress(formData); // Select the newly added address
        toast.success('Address saved successfully');
      } else {
        toast.error(data.message || 'Failed to save address');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to save address');
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setFormData(data => ({...data, [name]:value}))
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const verifyData = {
            ...response,
            userId: token
          };
          const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', verifyData, {headers:{token}})
          if (data.success) {
            navigate('/orders')
            setCartItem({})
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const handleMethodChange = (newMethod) => {
    if (newMethod !== 'stripe') {
      setMethod(newMethod);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    if (!selectedAddress && !showAddressForm) {
      toast.error('Please select an address or add a new one');
      return;
    }

    try {
      
      const items = getCartItems(); // Get formatted cart items

      let orderData = {
        address: showAddressForm ? formData : selectedAddress,
        items: items,
        amount: getCartAmount() + delivery_fee
      }

      switch(method){
        //API Calls for COD
        case 'cod': {
          const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers:{token}})
          console.log(response.data.success);
          if (response.data.success){
            setCartItem({})
            toast.success('Order placed successfully!')
            navigate('/orders')
          }else{
            toast.error(response.data.message)
          }
          break;
        }

        case 'stripe': {
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers:{token}})
          if (responseStripe.data.success) {
            const {session_url} = responseStripe.data
            window.location.replace(session_url)
          }else{
            toast.error(responseStripe.data.message)
          }
          break;
        }

        case 'razorpay': {
          const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers:{token}})
          if (response.data.success){
            setCartItem({})
            toast.success('Order placed successfully!')
            navigate('/orders')
          }else{
            toast.error(response.data.message)
          }
          break;
        }

        default:
          break;
      }

      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // Stripe Checkout handler
  const handleStripeCheckout = async () => {
    setStripeLoading(true);
    try {
      const items = getCartItems();
      const email = formData.email || (selectedAddress && selectedAddress.email) || '';
      const addressToSend = showAddressForm ? formData : selectedAddress;
      let userId = '';
      try {
        const decoded = jwtDecode(token);
        userId = decoded._id || decoded.id || '';
      } catch (e) {
        userId = '';
      }
      const amount = getCartAmount() + delivery_fee;

      if (!email) {
        toast.error('Please enter your email before proceeding to payment.');
        setStripeLoading(false);
        return;
      }
      if (!items.length) {
        toast.error('Your cart is empty.');
        setStripeLoading(false);
        return;
      }
      if (!addressToSend) {
        toast.error('Please select or enter an address.');
        setStripeLoading(false);
        return;
      }
      if (!userId) {
        toast.error('User not authenticated.');
        setStripeLoading(false);
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/payment/create-checkout-session`,
        { items, email, address: addressToSend, userId, amount },
        { headers: { token } }
      );
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to initiate Stripe Checkout');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Stripe Checkout failed');
    } finally {
      setStripeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order and get fresh groceries delivered</p>
        </div>

        <form onSubmit={onSubmitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Delivery Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
                  <p className="text-gray-600 text-sm">Where should we deliver your groceries?</p>
                </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-3 text-gray-600">Loading saved addresses...</span>
                </div>
        ) : (
          <>
            {/* Saved Addresses Section */}
            {savedAddresses.length > 0 && !showAddressForm && (
                    <div className="space-y-4 mb-6">
                      <h3 className="font-medium text-gray-900">Saved Addresses</h3>
                      <div className="grid gap-3">
                {savedAddresses.map((address, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedAddress(address)}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                              selectedAddress === address 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{address.firstName} {address.lastName}</p>
                                <p className="text-gray-600 text-sm mt-1">{address.street}</p>
                                <p className="text-gray-600 text-sm">{address.city}, {address.state} {address.zipcode}</p>
                                <p className="text-gray-600 text-sm">{address.country}</p>
                                {address.phone && <p className="text-gray-600 text-sm mt-1">📞 {address.phone}</p>}
                              </div>
                              {selectedAddress === address && (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                  </div>
                ))}
                      </div>
              </div>
            )}

            {/* Add New Address Button */}
            <button 
              type="button"
              onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
            >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {showAddressForm ? 'Cancel' : 'Add New Address'}
            </button>

            {/* Address Form */}
            {showAddressForm && (
                    <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-4">New Address</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                          <input 
                            required 
                            onChange={onChangeHandler} 
                            name='firstName' 
                            value={formData.firstName} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                            type="text" 
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                          <input 
                            required 
                            onChange={onChangeHandler} 
                            name='lastName' 
                            value={formData.lastName} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                            type="text" 
                            placeholder="Enter last name"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input 
                            onChange={onChangeHandler} 
                            name='email' 
                            value={formData.email} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                            type="email" 
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                          <input 
                            required 
                            onChange={onChangeHandler} 
                            name='street' 
                            value={formData.street} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                            type="text" 
                            placeholder="Enter street address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                          <input 
                            required 
                            onChange={onChangeHandler} 
                            name='city' 
                            value={formData.city} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                            type="text" 
                            placeholder="Enter city"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                          <input 
                            required 
                            onChange={onChangeHandler} 
                            name='state' 
                            value={formData.state} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                            type="text" 
                            placeholder="Enter state"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                          <input 
                            required 
                            onChange={onChangeHandler} 
                            name='zipcode' 
                            value={formData.zipcode} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                            type="number" 
                            placeholder="Enter ZIP code"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                          <input 
                            required 
                            onChange={onChangeHandler} 
                            name='country' 
                            value={formData.country} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                            type="text" 
                            placeholder="Enter country"
                          />
                </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                          <input 
                            required 
                            onChange={onChangeHandler} 
                            name='phone' 
                            value={formData.phone} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                            type="tel" 
                            placeholder="Enter phone number"
                          />
                </div>
                </div>
                      <div className="mt-6 flex gap-3">
                <button 
                  type="button"
                  onClick={saveNewAddress}
                          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  Save Address
                </button>
                        <button 
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
            )}
          </>
        )}
      </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                  <p className="text-gray-600 text-sm">Choose how you'd like to pay</p>
                </div>
        </div>
          
              <div className="space-y-3">
            {/* Khalti payment (was Razorpay) */}
            <div 
              onClick={() => handleMethodChange('razorpay')} 
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    method === 'razorpay' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
            >
                  <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-4 ${
                    method === 'razorpay' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                  }`}>
                    {method === 'razorpay' && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <img className="h-8" src={assets.khalti_logo} alt="Khalti" />
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Khalti</p>
                    <p className="text-sm text-gray-600">Secure payment with Khalti</p>
                  </div>
            </div>

            {/* COD payment */}
            <div 
              onClick={() => handleMethodChange('cod')} 
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    method === 'cod' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
            >
                  <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-4 ${
                    method === 'cod' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                  }`}>
                    {method === 'cod' && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
            </div>

              {/* Esewa payment (was Stripe, disabled) */}
                <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg opacity-50 bg-gray-50 cursor-not-allowed">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-4"></div>
                  <img className="h-8 grayscale" src={assets.esewa_logo} alt="Esewa" />
                  <div className="ml-4">
                    <p className="font-medium text-gray-500">Esewa</p>
                    <p className="text-sm text-gray-500">Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Cart Total Component */}
              <div className="mb-6">
                <CartTotal />
              </div>

              {/* Order Button */}
              <button 
                type='submit' 
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Place Order
              </button>

              {/* Security Notice */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Secure Checkout</p>
                    <p className="text-xs text-blue-700 mt-1">Your payment information is encrypted and secure</p>
                  </div>
                </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-end">
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded shadow mt-4 w-full sm:w-auto"
            onClick={handleStripeCheckout}
            disabled={stripeLoading}
          >
            {stripeLoading ? 'Redirecting...' : 'Pay with Card (Stripe)'}
          </button>
        </div>
      </div>
    </form>
      </div>
    </div>
  )
}

export default PlaceOrder
