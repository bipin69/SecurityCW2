import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import NavBar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify';
import Verify from './pages/Verify'
import FeedbackSection from './components/FeedbackSection'
import ScrollToTop from './ScrollToTop';
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile';
import PaymentSuccess from './pages/PaymentSuccess';


const App = () => {
  return(
    <>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <ToastContainer position='bottom-right' autoClose={2000} />
        <NavBar />
        <SearchBar />
        <ScrollToTop />
        <Routes>
          <Route path = '/' element = {<Home/>}/>
          <Route path = '/collection' element = {<Collection/>}/>
          <Route path = '/about' element = {<About/>}/>
          <Route path = '/contact' element = {<Contact/>}/>
          <Route path = '/product/:productId' element = {<Product/>}/>
          <Route path = '/cart' element = {<Cart/>}/>
          <Route path = '/login' element = {<Login/>}/>
          <Route path = '/place-order' element = {<PlaceOrder/>}/>
          <Route path = '/orders' element = {<Orders/>}/>
          <Route path = '/verify' element = {<Verify/>}/>
          <Route path = '/forgot-password' element = {<ForgotPassword/>}/>
          <Route path = '/reset-password/:token' element = {<ResetPassword/>}/>
          <Route path = '/profile' element = {<Profile/>}/>
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </div>
      <FeedbackSection />
      <Footer />
    </>
  )
}

export default App
