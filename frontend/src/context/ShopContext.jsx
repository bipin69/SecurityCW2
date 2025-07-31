import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios"

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    
    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = 'http://localhost:4000';
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch]= useState(false);
    const [cartItems, setCartItem] = useState({});
    const defaultProducts = [
  { _id: '1', name: 'Chicken Breast', price: 350, image: ['https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'], category: 'Chicken', subCategory: 'Fresh' },
  { _id: '2', name: 'Mutton Curry Cut', price: 700, image: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'], category: 'Mutton', subCategory: 'Fresh' },
  { _id: '3', name: 'Pork Ribs', price: 600, image: ['https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80'], category: 'Pork', subCategory: 'Fresh' },
  { _id: '4', name: 'Buff Mince', price: 400, image: ['https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80'], category: 'Buff', subCategory: 'Fresh' },
  { _id: '5', name: 'Chicken Drumsticks', price: 320, image: ['https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80'], category: 'Chicken', subCategory: 'Fresh' },
  { _id: '6', name: 'Mutton Chops', price: 750, image: ['https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'], category: 'Mutton', subCategory: 'Premium Cuts' },
  { _id: '7', name: 'Pork Belly', price: 650, image: ['https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80'], category: 'Pork', subCategory: 'Premium Cuts' },
  { _id: '8', name: 'Buff Steak', price: 500, image: ['https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80'], category: 'Buff', subCategory: 'Premium Cuts' },
];
    const [products, setProducts] = useState(defaultProducts);
    const [token, setToken] = useState('');
    const [tokenTimestamp, setTokenTimestamp] = useState(null);
    const navigate = useNavigate();

    const addToCart = async (itemId, quantity = 1) => {
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            cartData[itemId] += quantity;
        }
        else{
            cartData[itemId] = quantity;
        }
        
        setCartItem(cartData);
        toast.success('Item Added to Cart')

        if(token){
            try {
                await axios.post(backendUrl + '/api/cart/add', {
                    itemId, 
                    quantity
                }, {
                    headers: {token}
                });
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        Object.values(cartItems).forEach(quantity => {
            if (quantity > 0) {
                totalCount += quantity;
            }
        });
        return totalCount;
    }

    const updateQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItem(cartData)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', {
                    itemId, 
                    quantity
                }, {
                    headers: {token}
                });
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const itemId in cartItems){
            let itemInfo = products.find((product)=>product._id === itemId);
            if (itemInfo && cartItems[itemId] > 0) {
                totalAmount += itemInfo.price * cartItems[itemId];
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if(response.data.success){
                setProducts(response.data.products)
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers:{token}})

            if (response.data.success) {
                const normalizedCart = {};
                Object.entries(response.data.cartData).forEach(([key, value]) => {
                    normalizedCart[key] = typeof value === 'number' ? value : 
                                        (typeof value === 'object' ? Object.values(value)[0] || 0 : 0);
                });
                setCartItem(normalizedCart);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getCartItems = () => {
        const items = [];
        for(const itemId in cartItems) {
            const product = products.find(p => p._id === itemId);
            if (product && cartItems[itemId] > 0) {
                items.push({
                    _id: itemId,
                    name: product.name,
                    price: product.price,
                    image: product.image[0],
                    quantity: cartItems[itemId]
                });
            }
        }
        return items;
    }

    // Helper: set token and timestamp in localStorage
    const loginWithToken = (newToken) => {
      setToken(newToken);
      const now = Date.now();
      setTokenTimestamp(now);
      localStorage.setItem('token', newToken);
      localStorage.setItem('tokenTimestamp', now.toString());
    };

    // Helper: logout and clear token
    const logout = () => {
      setToken('');
      setTokenTimestamp(null);
      localStorage.removeItem('token');
      localStorage.removeItem('tokenTimestamp');
      toast.info('You have been logged out.');
      navigate('/login');
    };

    useEffect(()=>{
        getProductsData()
    }, [])

    // On mount, check for token and timestamp
    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      const storedTimestamp = localStorage.getItem('tokenTimestamp');
      if (storedToken && storedTimestamp) {
        const age = Date.now() - parseInt(storedTimestamp, 10);
        if (age < 60 * 60 * 1000) { // 1 hour
          setToken(storedToken);
          setTokenTimestamp(parseInt(storedTimestamp, 10));
          getUserCart(storedToken);
          // Set auto-logout timer
          setTimeout(() => {
            logout();
          }, 60 * 60 * 1000 - age);
        } else {
          logout();
        }
      }
    }, []);

    // When token is set via login, start 1-hour timer
    useEffect(() => {
      if (token && tokenTimestamp) {
        const age = Date.now() - tokenTimestamp;
        if (age < 60 * 60 * 1000) {
          const timer = setTimeout(() => {
            logout();
          }, 60 * 60 * 1000 - age);
          return () => clearTimeout(timer);
        } else {
          logout();
        }
      }
    }, [token, tokenTimestamp]);

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItem,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken: loginWithToken, token, getCartItems, logout
    }

    return(
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;

