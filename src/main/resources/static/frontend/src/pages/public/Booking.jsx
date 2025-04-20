import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import FooterComp from '../../components/common/FooterComp';
import BookingSteps from '../../components/booking/BookingSteps';
import PackageSelection from '../../components/booking/PackageSelection';
import DateTimeSelection from '../../components/booking/DateTimeSelection';
import CustomerDetails from '../../components/booking/CustomerDetails';
import BookingSummary from '../../components/booking/BookingSummary';
import BookingConfirmation from '../../components/booking/BookingConfirmation';

function Booking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    package: '',
    category: '',
    date: '',
    timeRange: null,
    customerDetails: {
      name: '',
      email: '',
      phone: '',
      location: '', // Add location field
      notes: ''
    },
    price: 0,
    packageDetails: {
      hours: 4
    },
    reference: `BK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  });

  const steps = [
    { id: 1, title: 'Package' },
    { id: 2, title: 'Date & Time' },
    { id: 3, title: 'Details' },
    { id: 4, title: 'Review' },
    { id: 5, title: 'Confirmation' }
  ];

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const updateBookingData = (data) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const handleBookingComplete = (paymentData) => {
    updateBookingData(paymentData);
    handleNext();
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#111827] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Book Your Session
          </h1>
          
          {/* Progress Steps */}
          {currentStep < 5 && <BookingSteps steps={steps.slice(0, 4)} currentStep={currentStep} />}

          {/* Step Content */}
          <div className="mt-8 max-w-3xl mx-auto">
            {currentStep === 1 && (
              <PackageSelection 
                onNext={handleNext} 
                updateData={updateBookingData}
                data={bookingData}
              />
            )}
            {currentStep === 2 && (
              <DateTimeSelection 
                onNext={handleNext} 
                onBack={handleBack}
                updateData={updateBookingData}
                data={bookingData}
              />
            )}
            {currentStep === 3 && (
              <CustomerDetails 
                onNext={handleNext} 
                onBack={handleBack}
                updateData={updateBookingData}
                data={bookingData}
              />
            )}
            {currentStep === 4 && (
              <BookingSummary 
                onBack={handleBack}
                onComplete={handleBookingComplete}
                data={bookingData}
              />
            )}
            {currentStep === 5 && (
              <BookingConfirmation bookingData={bookingData} />
            )}
          </div>
        </div>
      </main>
      <FooterComp />
    </>
  );
}

export default Booking;