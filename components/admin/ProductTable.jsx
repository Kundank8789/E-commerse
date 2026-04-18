import Link from "next/link";

export default function ProductTable({ products }) {
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-800">
          <th>Name</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {products.map((p) => (
          <tr key={p._id} className="border-t">
            <td>{p.name}</td>
            <td>₹{p.price}</td>
            <td>
              <Link href={`/admin/products/${p._id}`}>
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}