export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed">
            Welcome to <strong className="text-yellow-600">NIWLE</strong> — your destination for modern fashion, stylish clothing, and elegant jewellery.
          </p>

          <p className="text-gray-700 leading-relaxed mt-4">
            At NIWLE, we believe style should feel premium, comfortable, and affordable for everyone. Our goal is to bring trendy fashion and carefully selected products that match today's lifestyle and confidence.
          </p>

          <p className="text-gray-700 leading-relaxed mt-4">
            We focus on quality, modern design, and customer satisfaction. From fashion essentials to stylish accessories, every product is chosen to give you a better shopping experience.
          </p>

          <p className="text-gray-700 leading-relaxed mt-4">
            NIWLE is more than just a store — it's a brand built for people who love fashion, simplicity, and elegance.
          </p>

          <p className="text-gray-700 leading-relaxed mt-4">
            Thank you for being a part of NIWLE.
          </p>
        </div>
      </div>
    </div>
  );
}