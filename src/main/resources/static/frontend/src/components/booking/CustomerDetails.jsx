import { useState } from 'react';

function CustomerDetails({ onNext, onBack, updateData, data }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '', // Add location field
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.location.trim()) newErrors.location = 'Event location is required'; // Add location validation
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number (11 digits)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      updateData({ customerDetails: formData });
      onNext();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl text-white mb-6">Enter Your Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className={`w-full p-2 bg-gray-700 text-white rounded ${
              errors.name ? 'border border-red-500' : 'border border-gray-600'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={`w-full p-2 bg-gray-700 text-white rounded ${
              errors.email ? 'border border-red-500' : 'border border-gray-600'
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number (11 digits)"
            className={`w-full p-2 bg-gray-700 text-white rounded ${
              errors.phone ? 'border border-red-500' : 'border border-gray-600'
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Event Location"
            className={`w-full p-2 bg-gray-700 text-white rounded ${
              errors.location ? 'border border-red-500' : 'border border-gray-600'
            }`}
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Special Requests (Optional)"
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
            rows={4}
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-white border-[#4B5563] border-2 hover:bg-gray-700 rounded"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerDetails;