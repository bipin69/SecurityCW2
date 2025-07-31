import { useState } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const mockProducts = {
  'Hot Deals': [
    { id: 1, name: 'Chicken Breast', price: 350, image: ['https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'] },
    { id: 2, name: 'Mutton Curry Cut', price: 700, image: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'] },
    { id: 3, name: 'Pork Ribs', price: 600, image: ['https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80'] },
    { id: 4, name: 'Buff Mince', price: 400, image: ['https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80'] },
  ],
  'Best Seller': [
    { id: 5, name: 'Chicken Drumsticks', price: 320, image: ['https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80'] },
    { id: 6, name: 'Mutton Chops', price: 750, image: ['https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'] },
    { id: 7, name: 'Pork Belly', price: 650, image: ['https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80'] },
    { id: 8, name: 'Buff Steak', price: 500, image: ['https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80'] },
  ],
  'Top Rated': [
    { id: 9, name: 'Chicken Wings', price: 300, image: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'] },
    { id: 10, name: 'Mutton Keema', price: 720, image: ['https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'] },
    { id: 11, name: 'Pork Sausage', price: 350, image: ['https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80'] },
    { id: 12, name: 'Buff Slices', price: 420, image: ['https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80'] },
  ],
};

const tabs = ['Hot Deals', 'Best Seller', 'Top Rated'];

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState('Hot Deals');
  const products = mockProducts[activeTab];

    return (
    <section className="w-full py-12">
      <div className="text-center text-3xl pb-8">
        <Title text1={'Featured'} text2={'Products'} />
      </div>
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-colors border ${activeTab === tab ? 'bg-[#8B0000] text-white border-[#8B0000]' : 'bg-[#fff5f5] text-[#222] border-[#fff5f5] hover:bg-[#f3d6d6]'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {products.map(product => (
          <div key={product.id} className="bg-[#fff5f5] rounded-xl shadow p-4 flex flex-col items-center">
            <img src={product.image[0]} alt={product.name} className="w-28 h-28 object-cover rounded-lg mb-3" />
            <h4 className="font-semibold text-base text-gray-900 mb-1">{product.name}</h4>
            <p className="text-[#222] font-bold text-lg mb-3">Rs. {product.price}</p>
            <button className="bg-[#8B0000] hover:bg-[#B22222] text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors mt-auto">Add to Cart</button>
        </div>
        ))}
    </div>
    </section>
  );
};

export default FeaturedProducts;
