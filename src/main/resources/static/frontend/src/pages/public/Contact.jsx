import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/FooterComp";
import Contactform from "../../components/forms/Contactform";
import FAQcard from "../../components/common/FAQcard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faLocationDot, faMailBulk, faMailForward, faEnvelope, faClock } from "@fortawesome/free-solid-svg-icons";

function Contact() {

  

  
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-400 text-lg">
            Have a question or ready to book? Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-white mb-8">Get In Touch</h3>
            
            {/* Location */}
            <div className="flex items-center space-x-4">
              <div className="bg-[#a955f722] p-3 rounded-full">
                <FontAwesomeIcon icon={faLocationDot} className="h-6 w-6 text-[#C084FC] text-xl" />
              </div>
              <div>
                <h5 className="text-white font-medium">Our Location</h5>
                <p className="text-gray-400">San Jose, Paombong, Bulacan, Philippines</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-4">
              <div className="bg-[#a955f722] p-3 rounded-full">
                <FontAwesomeIcon icon={faPhone} className="h-6 w-6 text-[#C084FC] text-lg" />
              </div>
              <div>
                <h5 className="text-white font-medium">Phone</h5>
                <p className="text-gray-400">(+63) 926-0515-815</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-4">
              <div className="bg-[#a955f722] p-3 rounded-full">
                <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-[#C084FC] text-lg"/>
              </div>
              <div>
                <h5 className="text-white font-medium">Email</h5>
                <p className="text-gray-400">lavisualmedia@gmail.com</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-center space-x-4">
              <div className="bg-[#a955f722] p-3 rounded-full">
                <FontAwesomeIcon icon={faClock} className="h-6 w-6 text-[#C084FC] text-lg"/>
              </div>
              <div>
                <h5 className="text-white font-medium">Business Hours</h5>
                <p className="text-gray-400">Weekdays: 9am - 9pm</p>
                <p className="text-gray-400">Weekends: 7am - 10pm</p>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden mt-8 w-full h-[200px] bg-gray-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6823.980363313562!2d120.78751444563821!3d14.808826089789523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x339651fde8c3e3e1%3A0xcb6b1aee43298929!2sSan%20Jose%2C%20Bulacan!5e0!3m2!1sen!2sph!4v1744600704411!5m2!1sen!2sph"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 rounded-lg p-8">
            <Contactform />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-white text-center mb-12">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FAQcard 
              heading="How far in advance should I book?"
              description="For weddings and major events, we recommend booking at least 6-12 months in advance. For portrait sessions and smaller events, 2-4 weeks notice is usually sufficient, depending on our availability."
            />
            <FAQcard 
              heading="What is your cancellation policy?"
              description="Deposits are non-refundable, but we do offer rescheduling options with adequate notice. Full cancellations made within 30 days of the event may be subject to additional fees."
            />
            <FAQcard 
              heading="How long until I receive my photos/videos?"
              description="Typically, portrait sessions are delivered within 1-2 weeks. Weddings and larger events take 4-6 weeks. Rush delivery is available for an additional fee."
            />
            <FAQcard 
              heading="Do you travel for photoshoots?"
              description="Yes, we are available for travel both domestically and internationally. Travel fees may apply depending on the location."
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;