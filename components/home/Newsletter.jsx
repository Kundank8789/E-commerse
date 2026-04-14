export default function Newsletter() {

return (

<section className="bg-black text-white py-20 px-6">

  <div className="max-w-3xl mx-auto text-center">

    <h2 className="text-4xl font-bold">
      Subscribe to our Newsletter
    </h2>

    <p className="text-gray-400 mt-4">
      Get updates about new collections and exclusive offers
    </p>

    <div className="flex flex-col md:flex-row justify-center mt-8 gap-3">

      <input
        type="email"
        placeholder="Enter your email"
        className="w-full md:w-96 px-4 py-3 rounded-lg bg-neutral-900 border border-gray-700 focus:outline-none focus:border-white"
      />

      <button className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition">
        Subscribe
      </button>

    </div>

  </div>

</section>

);
}
