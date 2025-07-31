import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  // Mock pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.ceil(filterProducts.length / pageSize);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setSubCategory(prev => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }    
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }
    setFilterProducts(productsCopy);
    setPage(1); // Reset to first page on filter
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
    // eslint-disable-next-line
  }, [sortType]);
  
  // Pagination logic
  const paginatedProducts = filterProducts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col md:flex-row gap-8 pt-10 border-t max-w-7xl mx-auto px-4">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 md:sticky top-24 bg-white rounded-xl shadow p-6 h-fit mb-6 md:mb-0">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 cursor-pointer" onClick={() => setShowFilter(!showFilter)}>
          <span>Filters</span>
          <img className={`h-4 md:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </h3>
        <div className={`${showFilter ? '' : 'hidden'} md:block`}>
          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold text-gray-700">Categories</p>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <label><input className="mr-2" type="checkbox" value={'Chicken'} onChange={toggleCategory} />Chicken</label>
              <label><input className="mr-2" type="checkbox" value={'Mutton'} onChange={toggleCategory} />Mutton</label>
              <label><input className="mr-2" type="checkbox" value={'Pork'} onChange={toggleCategory} />Pork</label>
              <label><input className="mr-2" type="checkbox" value={'Buff'} onChange={toggleCategory} />Buff</label>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Type</p>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <label><input className="mr-2" type="checkbox" value={'Fresh'} onChange={toggleSubCategory} />Fresh</label>
              <label><input className="mr-2" type="checkbox" value={'Frozen'} onChange={toggleSubCategory} />Frozen</label>
              <label><input className="mr-2" type="checkbox" value={'Premium Cuts'} onChange={toggleSubCategory} />Premium Cuts</label>
              <label><input className="mr-2" type="checkbox" value={'Boneless'} onChange={toggleSubCategory} />Boneless</label>
        </div>
          </div>
        </div>
      </aside>
      {/* Products Section */}
      <main className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <Title text1={'All'} text2={'Products'} />
          <select onChange={(e) => setSortType(e.target.value)} className="border border-gray-300 text-sm px-3 py-2 rounded">
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Price low to high</option>
            <option value="high-low">Sort by: Price high to low</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((item, index) => (
            <div key={index} className="bg-[#fff5f5] rounded-xl shadow p-4 flex flex-col items-center">
              <ProductItem name={item.name} id={item._id} price={item.price} image={item.image} />
            </div>
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-full border text-sm font-semibold transition-colors ${page === i + 1 ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'}`}
              >
                {i + 1}
              </button>
            ))}
      </div>
        )}
      </main>
    </div>
  );
};

export default Collection;
