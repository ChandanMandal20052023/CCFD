import React, { useState, useEffect } from 'react';
import Navigations from "../components/Navigations/Navigations";
import { ArrowUp } from 'lucide-react';
import Header from '../components/Header/Header';

function AskZestra() {
  // State to store user data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  // Get current hour
  const currentHour = new Date().getHours();

  // Determine greeting based on time (Corrected logic)
  let greeting = 'Good Evening'; // Default (5 PM onwards)
  if (currentHour < 12) { // 0 - 11:59 AM
    greeting = 'Good Morning';
  } else if (currentHour < 17) { // 12 PM - 4:59 PM
    greeting = 'Good Afternoon';
  }

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // --- FIX 1: Get the token from localStorage ---
        // (Make sure you save the token as 'token' during login)
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        // --- FIX 2: Fetch from the correct /api/me endpoint ---
        const response = await fetch('http://localhost:5000/api/me', {
          headers: {
            // --- FIX 3: Send the Authorization header ---
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // If token is invalid or expired, server will send 401
          if (response.status === 401) {
             console.error('Unauthorized. Token might be invalid.');
             // You might want to redirect to login here
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        
        // --- FIX 4: Set user from data.user, as sent by your server ---
        setUser(data.user); // Your server sends { user: { ... } }

      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null); // Clear user on error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserData();
  }, []); // Empty array [] means this runs once on mount

  return (
    <div className="w-screen min-h-screen bg-white overflow-hidden relative">
      {/* SIDEBAR NAVIGATION */}
      <div className="fixed top-0 left-0 z-20">
        <Navigations />
      </div>

      {/* PROFILE HEADER */}
      <div className="fixed flex justify-between left-0 md:left-[20%] top-0 w-full md:w-[80vw] z-30">
        <Header />
      </div>

      {/* Zestra AI container */}
      <div className="relative md:left-[20%] left-0 mt-[25%] md:mt-[7%] m-4 md:m-8 px-6 md:px-10 py-8 md:py-10 
                       w-[calc(100%-2rem)] md:w-[calc(80vw-4rem)] min-h-[85vh] 
                       bg-[linear-gradient(45deg,#FFE4D5,#FFFFFF,#E9DFFF)] 
                       rounded-[10px] shadow-md flex flex-col justify-between">

        {/* Top Section */}
        <div className="flex flex-col md:flex-col justify-between items-start w-full">
          {/* Greeting - Left */}
          <div>
            <h2 className="font-manrope text-[1.8rem] md:text-[2.5rem] font-medium mb-4">
              <span className="bg-[conic-gradient(from_0deg,_#FFFFFF_1%,_#000000_64%,_#FFFFFF_120%,_#000000_50%)] bg-clip-text text-transparent">
                {greeting},
              </span>
              <br />
              {/* DYNAMIC NAME HERE */}
              {loading ? (
                <span>Loading...</span> // Show a loading message
              ) : (
                // This will now work because `user` state is the user object
                <span>{user ? user.full_name : ''}</span>
              )}
            </h2>
          </div>

          {/* Try asking - Right */}
          <div className="font-montserrat font-medium text-gray-700 mt-32 md:mt-[7%] ml-[12%] md:ml-[70%] md:text-right">
            {/* ... (rest of your "Try asking" code is fine) ... */}
            <h2 className="text-[16px] mb-3 ml-40 text-gray-87">Try asking...</h2>
            <div className="flex flex-col gap-2 md:gap-3 items-end">
              <p className="md:w-[320px] w-full border bg-gray-50 p-3 md:p-4 rounded-[10px] shadow-sm text-[0.9rem] md:text-[1rem]">
                What are the market trends of programming languages in India?
              </p>
              <p className="md:w-[320px] w-full border bg-gray-50 p-3 md:p-4 rounded-[10px] shadow-sm text-[0.9rem] md:text-[1rem]">
                How is AI affecting the software development industry?
              </p>
            </div>
          </div>
        </div>

        {/* Input Section - Bottom Center */}
        <div className="w-full flex justify-center mt-0">
          {/* ... (rest of your input section is fine) ... */}
          <div className="font-montserrat font-medium flex flex-row justify-between items-center gap-3 md:gap-4 w-full md:w-[95%]">
            <input
              type="text"
              placeholder="Ask anything..."
              className="flex-1 border outline-none p-4 md:p-6 rounded-full shadow-md text-font-color text-[0.9rem] md:text-[1rem]"
            />
            <div
              className="relative rounded-full w-12 h-12 md:w-16 md:h-16 transform translate-y-0 hover:-translate-y-2 transition-all duration-200 cursor-pointer flex-shrink-0"
              style={{
                background: 'conic-gradient(from 0deg, #0A57FF, #FFFFFF, #0A57FF)',
              }}
            >
              <div className="absolute inset-[8px] md:inset-[12px] bg-white rounded-full flex justify-center items-center text-font-color font-bold text-[16px] md:text-[20px]">
                <ArrowUp />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AskZestra