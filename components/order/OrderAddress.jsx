// components/order/OrderAddress.jsx
export default function OrderAddress({ address }) {
  return (
    <div className="mt-6 text-sm text-gray-400">
      <p className="font-semibold text-white mb-1">
        Shipping Address:
      </p>
      <p>{address?.addressLine}</p>
      <p>
        {address?.city}, {address?.state} - {address?.pincode}
      </p>
      <p>📞 {address?.phone}</p>
    </div>
  );
}