import { useContext, useState, useRef, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const NavBar = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { getCartCount, token, setToken, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

    const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    setProfileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfileDropdown = () => {
    if (token) {
      setProfileDropdownOpen(!profileDropdownOpen);
    } else {
      navigate('/login');
    }
  };

  const handleOrdersClick = () => {
    navigate('/orders');
    setProfileDropdownOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setProfileDropdownOpen(false);
  };

    return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <nav className="w-full flex items-center justify-between px-4 md:px-10 py-3 gap-2">
        {/* Logo */}
        <Link to="/" className="font-extrabold text-2xl text-[#8B0000] tracking-tight font-display mr-6 min-w-max">
          Fresh Meat
          </Link>
        {/* Navigation Links */}
        <ul className="flex gap-7 text-base font-medium text-gray-700">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-[#8B0000]' : ''}>Home</NavLink>
          <NavLink to="/collection" className={({ isActive }) => isActive ? 'text-[#8B0000]' : ''}>Shop</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-[#8B0000]' : ''}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-[#8B0000]' : ''}>Contact</NavLink>
      </ul>
        {/* Centered Search Bar */}
        <div className="flex-1 flex justify-center mx-8 max-w-xl">
          <div className="flex w-full">
            <input
              type="text"
              placeholder="Search for products..."
              className="flex-1 px-4 py-2 rounded-l-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#eac0c0] text-sm bg-white"
            />
            <button className="bg-[#8B0000] hover:bg-[#B22222] text-white px-5 py-2 rounded-r-full text-sm font-semibold transition-colors">Search</button>
                </div>
        </div>
        {/* Right Side Icons */}
        <div className="flex items-center gap-5 min-w-max">
          {/* Cart */}
          <Link to="/cart" className="relative flex items-center" title="Cart">
            <img src={assets.cart_icon} className="w-6" alt="Cart" />
            <span className="absolute -top-2 -right-2 bg-[#8B0000] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartCount()}
            </span>
        </Link>
          {/* Profile/Account */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition"
              title="Account"
            >
              <img src={assets.profile_icon} className="w-6" alt="Profile" />
            </button>
            {/* Dropdown for logged-in user */}
            {token && profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button 
                  onClick={handleProfileClick} 
                  className="block w-full text-left px-4 py-3 hover:bg-green-50 transition-colors rounded-t-lg"
                >
                  Profile
                </button>
                <button 
                  onClick={handleOrdersClick} 
                  className="block w-full text-left px-4 py-3 hover:bg-green-50 transition-colors"
                >
                  Orders
                </button>
                <button 
                  onClick={logout} 
                  className="block w-full text-left px-4 py-3 hover:bg-green-50 transition-colors rounded-b-lg"
                >
                  Log Out
                </button>
      </div>
            )}
            </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
