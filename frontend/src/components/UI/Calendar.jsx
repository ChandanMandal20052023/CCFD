import React, { useState, useEffect } from "react";
// --- CHANGE 1: Icon import hata diya ---
// import { ChevronLeft, ChevronRight } from 'lucide-react'; 

// --- YEH AAPKA MOCK DATA HAI ---
const mockApiEvents = [
  // Event ko November se October mein daal diya hai test karne ke liye
  {
    date: '2025-10-30', // Format: YYYY-MM-DD
    type: 'assignment',
    label: '1 Assignment'
  },
  {
    date: '2025-10-18',
    type: 'quiz',
    label: '1 Quiz'
  }
];

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate(); 
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay(); 
};


const Calendar = () => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // --- CHANGE 3: State 'currentDate' se chalega ---
  // Yeh 'new Date()' se current mahina le lega
  const [currentDate, setCurrentDate] = useState(new Date()); 

  useEffect(() => {
   
    const transformedData = {};
    
    mockApiEvents.forEach(event => {
      transformedData[event.date] = { 
        type: event.type,
        label: event.label
      };
    });

    setCalendarData(transformedData);
    setLoading(false);

  }, []); 


  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const daysInMonth = getDaysInMonth(year, month); 
  const firstDayIndex = getFirstDayOfMonth(year, month); 

  const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const blanks = Array.from({ length: firstDayIndex }, (_, i) => <div key={`blank-${i}`} />);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getDayColor = (event) => {
    if (!event) return "text-gray-800"; 
    if (event.type === "assignment") return "bg-[#FE7474] text-black";
    if (event.type === "quiz") return "bg-[#FAD35C] text-black";
    return "text-gray-800";
  };


  if (loading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="font-manrope w-full max-w-lg mx-auto md:px-4 px-6 pt-4 rounded-lg ">
      {/* --- CHANGE 8: Header ko dynamic aur centered banayein --- */}
      <div className="flex justify-center items-center mb-4">
        {/*
        <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100">
          <ChevronLeft size={20} />
        </button>
        */}
        <h2 className="text-center text-lg font-medium">{monthName} {year}</h2>
        {/*
        <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100">
          <ChevronRight size={20} />
        </button>
        */}
      </div>
      
      <div className="grid grid-cols-7 text-center md:gap-x-7 gap-x-4 gap-y-2">
        {daysInWeek.map((day) => (
          <div key={day} className="text-gray-400 font-medium">
            {day}
          </div>
        ))}

        {/* Dynamic khaali slots */}
        {blanks}

        {/* Dynamic din */}
        {daysArray.map((day) => {
          // --- CHANGE 9: Har din ke liye poori date string banayein ---
          const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const event = calendarData[dateString]; // Event check karein
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <div
              key={day}
              className={`relative p-2 rounded-full cursor-pointer hover:bg-gray-200 
                ${getDayColor(event)}
                ${isToday ? 'border-2 border-accent' : ''} 
              `}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {day}

              {/* Tooltip (Ab 'event' variable se chalega) */}
              {hoveredDay === day && event && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 bg-purple-100 text-black p-2 rounded-lg shadow-md text-sm z-50">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        event.type === "assignment"
                          ? "bg-[#FE7474]"
                          : "bg-[#FAD35C]"
                      }`}
                    ></span>
                    {event.label}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

