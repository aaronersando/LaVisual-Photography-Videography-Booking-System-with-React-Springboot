function PackageCard({ category, title, price, description, features }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-700 bg-[#111827] text-white w-full">
      {/* Top section */}
      <div className="bg-[#1f2937] p-6">
        <p className="text-sm text-[#C084FC] font-light mb-1">{category}</p>

        <h3 className="text-xl font-semibold mb-1">{title}</h3>

        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold">₱{price}</span>
          <span className="text-gray-400 text-sm">starting price</span>
        </div>

        <p className="text-sm text-gray-300 mb-5">{description}</p>

        <button className="w-full bg-[#374151] hover:bg-[#4b5563] transition text-white py-2 rounded-md font-medium hover:cursor-pointer">
          Book Now
        </button>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-gray-700 w-full" />

      {/* Bottom section */}
      <div className="p-6 pb-12 bg-transparent">
        <h4 className="text-sm font-semibold mb-3 text-white">What's included:</h4>
        <ul className="space-y-3 text-sm text-gray-200">
          {features?.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">✔️</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PackageCard;
