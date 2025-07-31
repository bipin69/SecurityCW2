

const Feature = () => {
  return (
    <section className="py-12 ">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Fresh from Farm",
            description: "Direct from local butchers to ensure maximum freshness",
          },
          {
            title: "Free Delivery",
            description: "Free delivery on orders above Rs.500 in your area",
          },
          {
            title: "Quality Guarantee",
            description: "100% satisfaction guaranteed ",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-[#fff5f5] rounded-xl shadow-sm animate-fade-up"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <h3 className="text-xl font-bold mb-2 text-[#222]">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
  )
}

export default Feature