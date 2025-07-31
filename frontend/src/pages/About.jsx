import Title from '../components/Title'
import NewsLetterBox from '../components/NewsLetterBox'
import { Leaf, Truck, Shield, Users, Star, Award } from 'lucide-react'

const About = () => {
  // Cloudinary optimization parameters
  const cloudinaryBaseUrl = "https://res.cloudinary.com/dyj3rywju/image/upload/";
  const optimizationParams = [
    "f_auto",
    "q_auto",
    "w_450",
    "dpr_auto",
    "c_fill",
    "g_center"
  ].join(",");

  const aboutImageUrl = `${cloudinaryBaseUrl}${optimizationParams}/v1740632706/about_aom5tc.avif`;

  return (
    <div className="min-h-screen bg-[#fff5f5]">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Welcome to Fresh Meat, your trusted source for premium chicken, mutton, pork, and buff! 
              We're more than just an online meat shop – we're your direct connection to local butchers 
              and fresh, hygienic meat products.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              At Fresh Meat, our mission is to make quality protein accessible 
              by delivering the best cuts directly to your doorstep. We believe everyone 
              deserves access to fresh, hygienic meat without compromising 
              on quality or convenience.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              We carefully select each cut, partnering with local butchers 
              who share our commitment to hygiene and quality. 
              Every item in your basket is handpicked and handled with care, ensuring you 
              receive the freshest, safest meat possible.
            </p>

            <div className="bg-[#fff5f5] rounded-xl p-6 border border-[#fff5f5]">
              <h3 className="font-semibold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-700">
                We're committed to revolutionizing how you access fresh meat. 
                By connecting consumers directly with local butchers, we're creating 
                a sustainable food system that benefits both our customers and our 
                supplier community.
              </p>
            </div>
          </div>

          <div className="relative">
        <img 
          src={aboutImageUrl}
              className="w-full rounded-2xl shadow-lg" 
          alt="Organic farming" 
              loading="lazy"
          width="450"
          height="338"
          sizes="(max-width: 768px) 100vw, 450px"
        />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to bringing you the freshest, highest quality meat 
            while supporting local butchers and hygienic practices.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Fresh Quality from Butchers */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#fff5f5] p-8 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Fresh Quality from Butchers</h3>
            <p className="text-gray-600 leading-relaxed">
              We partner with local butchers to bring you the freshest meat available. 
              Our chicken, mutton, pork, and buff are prepared and delivered directly 
              to your doorstep, ensuring maximum freshness and safety.
            </p>
          </div>

          {/* Same Day Delivery */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#fff5f5] p-8 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Same Day Delivery</h3>
            <p className="text-gray-600 leading-relaxed">
              Order before noon for same-day delivery! Our efficient delivery system 
              ensures your fresh produce reaches your doorstep within hours of being harvested, 
              maintaining its farm-fresh quality.
            </p>
          </div>

          {/* 100% Hygienic & Safe */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#fff5f5] p-8 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">100% Hygienic & Safe</h3>
            <p className="text-gray-600 leading-relaxed">
              We guarantee that all our meat is 100% hygienic and handled with care.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white mb-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-green-100">Local Butchers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-green-100">Fresh Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-green-100">Customer Support</div>
            </div>
        </div>
      </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
      </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the passionate team behind Tarkari Pasal, dedicated to bringing 
            you the best fresh produce experience.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl shadow-sm border border-[#fff5f5] p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Farmers Network</h3>
            <p className="text-gray-600">
              Our trusted network of local farmers who grow the freshest produce 
              using sustainable and organic methods.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#fff5f5] p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delivery Team</h3>
            <p className="text-gray-600">
              Our dedicated delivery team ensures your fresh produce reaches you 
              quickly and in perfect condition.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#fff5f5] p-8 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Control</h3>
            <p className="text-gray-600">
              Our quality control team ensures every product meets our high standards 
              for freshness and organic certification.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-[#fff5f5] rounded-2xl shadow-sm border border-[#fff5f5] p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do at Fresh Meat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-600 text-sm">
                Supporting eco-friendly farming practices
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600 text-sm">
                Never compromising on freshness
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600 text-sm">
                Supporting local butchers and families
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600 text-sm">
                Delivering exceptional service every day
              </p>
            </div>
          </div>
        </div>        
      </div>
    </div>
  )
}

export default About
