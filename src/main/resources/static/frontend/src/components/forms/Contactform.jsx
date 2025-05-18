/**
 * Contact Form Component
 * 
 * This component renders a contact form that allows website visitors to send messages
 * directly to the site owner. It uses EmailJS to handle the email delivery without
 * requiring a backend server.
 * 
 * The form includes fields for name, email, subject, and message. When submitted,
 * the form data is sent to a predefined email template using EmailJS service.
 * 
 * The styling is consistent with the site's dark theme, using dark backgrounds,
 * purple accents, and white text for readability.
 */

import emailjs from '@emailjs/browser'; // Import EmailJS for handling form submission without a backend

function Contactform() {

    // Handle form submission event
    const handleSubmit = (e) => {
      e.preventDefault(); // Prevent default form submission behavior that would refresh the page

      // Send form data to EmailJS service using predefined service ID, template ID, and public key
      // e.target refers to the form element with all its input fields
      emailjs.sendForm('service_cs4kvtp', 'template_7wcsaqq', e.target, 'XEOTxlS2BnBaqReO4')
      alert("Message Sent!") // Display confirmation message to the user after form submission
    }

    return (
      
        <div className="space-y-6"> {/* Container with vertical spacing between children */}
          <div>
            {/* Form title */}
            <h3 className="text-2xl font-semibold text-white mb-8">Send Us a Message</h3>
          </div>

          {/* Form element with submission handler */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4"> {/* Container for form fields with vertical spacing */}
              {/* Name field */}
              <div>
                <label className="block text-sm font-medium text-white-400 mb-2">
                  Your Name
                </label>
                <input 
                  name='name' /* Field name that EmailJS will use to identify this data */
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
      
              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-white-400 mb-2">
                  Email Address
                </label>
                <input
                  name='email' /* Field name that EmailJS will use to identify this data */
                  type="email" /* Using email input type for built-in validation */
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
      
              {/* Subject field */}
              <div>
                <label className="block text-sm font-medium text-white-400 mb-2">
                  Subject
                </label>
                <input
                name='subject' /* Field name that EmailJS will use to identify this data */
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
      
              {/* Message field using textarea for multi-line input */}
              <div>
                <label className="block text-sm font-medium text-white-400 mb-2">
                  Your Message
                </label>
                <textarea
                name='message' /* Field name that EmailJS will use to identify this data */
                  rows="4" /* Sets the height of the textarea to 4 rows */
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                ></textarea>
              </div>
      
              {/* Submit button with purple styling that darkens on hover */}
              <button className="w-full bg-[#9333EA] text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition-colors duration-300">
                Send Message
              </button>
            </div>
          </form>
        </div>
    );
  }
  
  export default Contactform; // Export the component for use in other parts of the application