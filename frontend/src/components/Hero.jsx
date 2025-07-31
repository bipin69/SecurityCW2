import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import heroBanner from '../assets/hero_banner.png';
import summerSaleImg from '../assets/summer_sale.png';
import bestDealBg from '../assets/best_deal_bg.png';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 py-8 md:py-14">
      {/* Left: Main Hero Banner */}
      <div className="md:col-span-2 bg-[#fff5f5] rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-center">
        <img
          src={heroBanner}
          alt="Fresh meat"
          className="w-full h-auto object-cover rounded-2xl"
          style={{maxHeight:'100%',height:'auto'}}
        />
        <button
          onClick={() => navigate('/collection')}
          className="absolute left-8 bottom-8 bg-[#8B0000] hover:bg-[#B22222] text-white px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2 shadow-md transition-colors z-10"
        >
          Shop now <ArrowRight size={20} />
        </button>
      </div>
      {/* Right: Stacked Offer Cards */}
      <div className="flex flex-col gap-6 h-full flex-1">
        {/* Top Card: Summer Sale */}
        <div className="bg-[#fff5f5] rounded-2xl shadow-lg flex flex-col items-center justify-center p-0 flex-1 min-h-0 relative overflow-hidden">
          <img src={summerSaleImg} alt="Summer Sale" className="w-full h-full object-cover rounded-2xl" />
          <button
            onClick={() => navigate('/collection')}
            className="absolute left-6 bottom-6 bg-[#8B0000] hover:bg-[#B22222] text-white px-6 py-2 rounded-full font-semibold inline-flex items-center gap-2 shadow-md transition-colors z-10"
          >
            Shop Now <ArrowRight size={16} />
          </button>
        </div>
        {/* Bottom Card: Best Deal */}
        <div className="rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 gap-2 flex-1 min-h-0 relative overflow-hidden" style={{backgroundImage:`url(${bestDealBg})`, backgroundSize:'cover', backgroundPosition:'center'}}>
          <div className="absolute inset-0 bg-black/40 rounded-2xl z-0" />
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
            <button
              onClick={() => navigate('/collection')}
              className="mt-28 bg-[#8B0000] hover:bg-[#B22222] text-white px-6 py-2 rounded-full font-semibold inline-flex items-center gap-2 shadow-md transition-colors z-10"
            >
              Shop now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
