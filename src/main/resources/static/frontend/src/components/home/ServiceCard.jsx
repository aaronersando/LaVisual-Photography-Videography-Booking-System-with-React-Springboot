import {Link} from "react-router-dom";


function ServiceCard({ icon, title, description }) {
    return (
      <div className="bg-[#1F2937] text-center flex-col align-middle justify-center wrap-break-word rounded-lg p-6 hover:bg-gray-700 transition-colors duration-300">
        <div className="mb-4 flex justify-center items-center">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-[#F3F4F6] mb-2">{title}</h3>
        <p className="text-[#9CA3AF] text-sm mb-4">{description}</p>
        <Link to="/booking" className="text-sm text-[#C084FC] font-thin">Book Now &gt;</Link>
      </div>
    );
  }
  
  export default ServiceCard;