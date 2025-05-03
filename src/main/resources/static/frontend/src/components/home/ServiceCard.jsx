import {Link} from "react-router-dom";


function ServiceCard({ icon, title, description }) {
    return (
      <div className="relative group flex bg-[#1F2937] text-center flex-col align-middle justify-center wrap-break-word rounded-lg p-6 border-zinc-700 hover:shadow-xl hover:ring-1 hover:ring-zinc-600 duration 300 overflow-hidden">
        <div className="h-[400px] w-10 bg-gradient-to-r from-white/10 via-white/50 to-white-10 absolute -left-46 -rotate-20 blur-sm group-hover:left-[150%] duration-700 group-hover:delay-200" />
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