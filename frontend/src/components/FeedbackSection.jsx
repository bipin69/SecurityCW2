const feedbacks = [
  {
    name: 'Sagar Gautam',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    review: 'Fresh Meat always delivers premium cuts on time. The quality is top-notch and the service is excellent!',
    rating: 5,
  },
  {
    name: 'Anu Karki',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    review: 'I love the variety and the easy ordering process. Highly recommended for anyone who wants fresh meat!',
    rating: 5,
  },
  {
    name: 'Ramesh Shrestha',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    review: 'Great customer support and fast delivery. My go-to place for meat now!',
    rating: 5,
  },
];

const FeedbackSection = () => (
  <section className="w-full bg-[#fff5f5] py-12">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Feedback</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {feedbacks.map((fb, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
            <img src={fb.avatar} alt={fb.name} className="w-16 h-16 rounded-full mb-4 object-cover" />
            <h4 className="font-semibold text-lg text-[#222] mb-1">{fb.name}</h4>
            <p className="text-gray-600 text-sm mb-3">{fb.review}</p>
            <div className="flex gap-1 justify-center">
              {[...Array(fb.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeedbackSection; 