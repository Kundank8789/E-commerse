export default function ShippingAddress({ address, setAddress }) {
  const input = "w-full px-4 py-3 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-300";

  return (
    <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-6">
      <h2 className="text-xl font-semibold mb-5">Shipping Address</h2>
      <div className="space-y-4">

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
            <input type="text" placeholder="City" value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })} className={input} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">State</label>
            <input type="text" placeholder="State" value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })} className={input} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Pincode</label>
          <input type="text" placeholder="Pincode" value={address.pincode} maxLength={6}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "") })} className={input} />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Full Address</label>
          <textarea rows={4} placeholder="House no, Street, Landmark..." value={address.addressLine}
            onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
            className={`${input} resize-none`} />
        </div>

      </div>
    </div>
  );
}