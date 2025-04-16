import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CalendarComp from './CalendarComp'

function DateTimeSelection({ onNext, onBack, updateData, data }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 7; // 7am to 10pm
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      updateData({ date: selectedDate, time: selectedTime });
      onNext();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl text-white mb-6">Select Date & Time</h2>
      
      {/* Calendar */}
      <div className="mb-6">
        <CalendarComp/>
        {/* <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()}
          className="bg-gray-700 border-gray-600 text-white"
        /> */}
      </div>

      {/* Time Selection */}
      <div className="mb-6">
        <h3 className="text-white mb-3">Select Time</h3>
        <div className="grid grid-cols-4 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-2 rounded ${
                selectedTime === time
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-white border-[#4B5563] border-2 hover:bg-gray-700 rounded "
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedDate || !selectedTime}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default DateTimeSelection;