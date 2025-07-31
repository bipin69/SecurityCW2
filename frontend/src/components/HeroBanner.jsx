const HeroBanner = () => (
  <section className="bg-[#fff5f5] py-12">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
      <div className="max-w-xl mb-8 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-900">Fresh & Premium Meat Cuts</h1>
        <p className="text-lg text-green-700 mb-6">Sale up to <span className="text-orange-500 font-bold">30% OFF</span></p>
        <button className="bg-[#8B0000] hover:bg-[#B22222] text-white px-6 py-3 rounded-lg font-semibold transition">Shop now</button>
      </div>
      <div className="flex-shrink-0">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop" alt="Fresh Meat" className="rounded-xl shadow-lg w-full max-w-md" />
      </div>
    </div>
  </section>
);

export default HeroBanner; 