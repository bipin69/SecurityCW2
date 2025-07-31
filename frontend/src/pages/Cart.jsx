import { useEffect } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { toast } from 'react-toastify';

const Cart = () => {
  const {products, currency, cartItems, updateQuantity, navigate, token} = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  const proceedToPayment = () => {
    if(token){
      navigate('/place-order');
    }else{
      toast.error('Please login to proceed to payment');
      navigate('/login');
    }
  }

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      // Update to use new cart structure
      Object.entries(cartItems).forEach(([itemId, quantity]) => {
        if (quantity > 0) {
          tempData.push({
            _id: itemId,
            quantity: typeof quantity === 'number' ? quantity : 
                     (typeof quantity === 'object' ? Object.values(quantity)[0] || 0 : 0)
          });
        }
      });
      setCartData(tempData);
    }
  }, [cartItems, products]);

  // Empty cart component
  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-2xl font-medium text-gray-600 mb-4">Your Cart is Empty</h2>
      <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet</p>
      <button 
        onClick={() => navigate('/collection')} 
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-sm rounded-full transition-colors"
      >
        Shop Now
      </button>
    </div>
  );

  return (
    <div className="border-t pt-14 max-w-7xl mx-auto px-4">
      <div className="text-2xl mb-8">
        <Title text1={'Your'} text2={'Cart'} />
      </div>
      
      {cartData.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Cart Items ({cartData.length})</h3>
              <div className="space-y-4">
                {cartData.map((item, index) => {
                  const productData = products.find((product) => product._id === item._id);
              if (!productData) return null;

              return (
                    <div key={index} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                      <img className="w-16 h-16 object-cover rounded-lg" src={productData.image[0]} alt={productData.name} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{productData.name}</h4>
                        <p className="text-green-600 font-bold">{currency}{productData.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item._id, Math.max(0, item.quantity - 1))}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => updateQuantity(item._id, 0)} 
                        className="text-red-500 hover:text-red-700 p-2"
                        title="Remove item"
                      >
                        <img className="w-5 h-5" src={assets.bin_icon} alt="Remove" />
                      </button>
                    </div>
                  );
                })}
                  </div>
                </div>
          </div>
          {/* Cart Summary */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow p-6 sticky top-24">
              <CartTotal />
                <button 
                  onClick={proceedToPayment} 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full font-semibold text-lg transition-colors mt-6"
                >
                Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  )
}

export default Cart
