function Contactform() {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-white mb-8">Send Us a Message</h3>
        </div>
  
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white-400 mb-2">
              Your Name
            </label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-white-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-white-400 mb-2">
              Subject
            </label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-white-400 mb-2">
              Your Message
            </label>
            <textarea
              rows="4"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            ></textarea>
          </div>
  
          <button className="w-full bg-[#9333EA] text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition-colors duration-300">
            Send Message
          </button>
        </div>
      </div>
    );
  }
  
  export default Contactform;