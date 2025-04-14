function FAQcard({ heading, description }) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-300">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-white">{heading}</h3>
        </div>
        <div>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
    );
  }
  
  export default FAQcard;