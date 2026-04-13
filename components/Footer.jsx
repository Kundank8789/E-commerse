export default function Footer(){
  return(
    <footer className="bg-black text-white py-10 mt-20">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        <div>
          <h2 className="text-xl font-bold">ZIVA</h2>
          <p className="text-gray-400 mt-2">
            Modern fashion ecommerce store
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li>Shop</li>
            <li>Collections</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Subscribe</h3>
          <input
            className="mt-3 p-2 text-black w-full"
            placeholder="Enter email"
          />
        </div>

      </div>

    </footer>
  )
}