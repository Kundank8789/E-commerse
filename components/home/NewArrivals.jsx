import Image from "next/image";

export default function NewArrivals() {

  const products = [
    { id:1, name:"Nike Shoes", price:3999, image:"/shoes.jpg" },
    { id:2, name:"Tshirt", price:999, image:"/shirt.jpg" },
  ]

  return (

    <section>

      <h2 className="text-3xl font-bold text-center mb-10">
        New Arrivals
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

        {products.map((product) => (

          <div key={product.id} className="border p-4 hover:shadow-xl transition">

            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-64 object-cover rounded"
            />

            <h3 className="mt-2">{product.name}</h3>

            <p className="font-bold">₹{product.price}</p>

          </div>

        ))}

      </div>

    </section>

  )

}