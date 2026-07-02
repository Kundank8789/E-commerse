export default function CustomerInfo({ 
  customerName, 
  setCustomerName, 
  customerPhone, 
  setCustomerPhone, 
  email 
}) {
  return (
    <div className="bg-white border border-gray-200 shadow-xl rounded-2xl md:rounded-3xl p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-5">
        Customer Information
      </h2>
      
      <div className="space-y-3 md:space-y-4">
        {/* Full Name */}
        <div>
          <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 block">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your full name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-300 text-sm md:text-base placeholder:text-xs md:placeholder:text-sm"
            autoComplete="name"
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 block">
            Email Address
          </label>
          <input
            type="email"
            value={email || ""}
            readOnly
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-gray-200 bg-gray-100 outline-none text-gray-500 cursor-not-allowed text-sm md:text-base"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 block">
            Mobile Number
          </label>
          <input
            type="tel"
            placeholder="10-digit mobile number"
            value={customerPhone}
            maxLength={10}
            onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ""))}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-300 text-sm md:text-base placeholder:text-xs md:placeholder:text-sm"
            autoComplete="tel"
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
}