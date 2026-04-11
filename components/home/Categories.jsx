export default function Categories() {
  const categories = [
    "Electronics",
    "Fashion",
    "Shoes",
    "Accessories"
  ];

  return (
    <section className="py-16">

      <h2 className="text-3xl text-center font-bold mb-10">
        Shop by Category
      </h2>

      <div className="grid grid-cols-4 gap-6 px-10">

        {categories.map((cat, index) => (
          <div
            key={index}
            className="border p-10 text-center hover:shadow-lg cursor-pointer"
          >
            {cat}
          </div>
        ))}

      </div>

    </section>
  );
}