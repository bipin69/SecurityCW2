import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20 pb-12 mt-24 w-full">
      <div className="max-w-7xl mx-auto w-full px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
        {/* Brand & Description */}
        <div>
          <Link to="/" className="font-display text-2xl text-green-400 font-bold mb-2 inline-block">
            Fresh Meat
          </Link>
          <p className="text-gray-300 mt-2 max-w-xs">
            Premium quality meat delivered to your doorstep
          </p>
          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <a href="#" className="hover:text-green-400 transition-colors duration-200" aria-label="Facebook">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            </a>
            <a href="#" className="hover:text-green-400 transition-colors duration-200" aria-label="Twitter">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
            </a>
            <a href="#" className="hover:text-green-400 transition-colors duration-200" aria-label="Instagram">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.809 2.256 6.089 2.243 6.498 2.243 12c0 5.502.013 5.911.072 7.191.059 1.277.353 2.45 1.32 3.417.967.967 2.14 1.261 3.417 1.32 1.28.059 1.689.072 7.191.072s5.911-.013 7.191-.072c1.277-.059 2.45-.353 3.417-1.32.967-.967 1.261-2.14 1.32-3.417.059-1.28.072-1.689.072-7.191s-.013-5.911-.072-7.191c-.059-1.277-.353-2.45-1.32-3.417C21.05.425 19.877.131 18.6.072 17.32.013 16.911 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
          </div>
        </div>
        {/* Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
          <ul className="flex flex-col gap-2 text-gray-300">
            <li><Link to="/" className="hover:text-green-400 transition-colors duration-200">Home</Link></li>
            <li><Link to="/about" className="hover:text-green-400 transition-colors duration-200">About Us</Link></li>
            <li><Link to="/collection" className="hover:text-green-400 transition-colors duration-200">Shop</Link></li>
            <li><Link to="/contact" className="hover:text-green-400 transition-colors duration-200">Contact</Link></li>
            </ul>
        </div>
        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Get In Touch</h4>
          <ul className="flex flex-col gap-2 text-gray-300">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              +977 9919919911
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              tarkaripasal@gmail.com
            </li>
            </ul>
        </div>
        {/* Newsletter Signup */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Newsletter</h4>
          <p className="text-gray-300 mb-4">Subscribe to get the latest offers and updates.</p>
          <form className="flex flex-col sm:flex-row gap-2 w-full">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-2 rounded bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 border border-gray-700 flex-1 min-w-0" 
            />
            <button 
              type="submit" 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition-colors duration-200 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between w-full px-4">
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Fresh Meat. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <select className="bg-gray-800 text-gray-300 px-3 py-1 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400">
            <option>English</option>
            <option>Nepali</option>
          </select>
          <select className="bg-gray-800 text-gray-300 px-3 py-1 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400">
            <option>Nepal</option>
            <option>India</option>
          </select>
        </div>
    </div>
    </footer>
  )
}

export default Footer
