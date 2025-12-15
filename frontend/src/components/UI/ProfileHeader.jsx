import React, { useState, useRef, useEffect } from 'react'; // Import hooks
import Hamburger from 'hamburger-react';
import { NavLink, Link } from 'react-router-dom';
import userProfile from '../../User/profile.png'; // Fallback image

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

export default function Header() {
  // --- FIX 1: Add state for user data ---
  const [user, setUser] = useState(null);
  // You can add a loading state if you want, but for a header, it's often cleaner to just show a fallback.

  const [hamburger, setHamburger] = useState(false);
  const [notification, setNotification] = useState(false);
  const [pofile, setPofile] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const hamburgerRef = useRef(null);

  // --- FIX 2: Fetch user data ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // No token, so no user

        const response = await fetch('http://localhost:5000/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // Store user data
        }
      } catch (error) {
        console.error("Error fetching user for header:", error);
      }
    };

    fetchUserData();
  }, []); // Runs once on mount

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotification(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setPofile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Helper variables for dynamic data ---
  const userName = user?.full_name || 'Student'; // Fallback name
  const userEmail = user?.email || '...'; // Fallback email/username
  const profilePic = user?.profile_photo_url || userProfile; // Fallback pic

  return (
    <>
      {/* MOBILE NAVBAR */}
      <div className='fixed w-[100%] md:hidden bg-white flex flex-row justify-between items-center z-50'>
        {/* ... (rest of mobile nav) ... */}
      </div>

      {/* DESKTOP ONLY WELCOME BOARD */}
      <div className="welcome hidden h-20 w-[100%] md:w-[79%] bg-white fixed top-0 left-0 md:left-[19%] font-manrope px-5 mx-[1%] py-2 text-font-color md:flex flex-row justify-between items-center z-50">
        <div>
          <img className='w-[15rem]' src="/university-logo.png" alt="" />
        </div>
        <div className='flex flex-row gap-10 justify-center items-center'>
          {/* ... (sun/bell icons) ... */}
          <a className='flex-row gap-2 justify-center items-center cursor-pointer hidden md:flex'>
            {/* --- FIX 3: Use dynamic profile picture --- */}
            <img
              className='h-[40px] md:h-[50px] rounded-full object-cover' // Added object-cover
              onClick={() => setPofile(!pofile)}
              src={profilePic}
              alt="userProfile"
            />
            <svg onClick={() => setPofile(!pofile)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
          </a>
        </div>
      </div>

      {/* MOBILE ONLY WELCOME BOARD */}
      <div className=' md:hidden block absolute top-[10%] m-5'>
        {/* --- FIX 4: Use dynamic name --- */}
        <h1 className='font-manrope font-semibold text-[24px]'>
          Welcome {user ? user.full_name.split(' ')[0] : '...'},
        </h1>
        <p className='text-[14px] text-gray-87 font-montserrat font-medium'>{currentDate}</p>
      </div>

      {/* HAMBURGER EXPANDED */}
      {/* ... (no changes needed here) ... */}

      {/* NOTIFICATIONS CARD */}
      {/* ... (no changes needed here) ... */}

      {/* USER PROFILE CARD */}
      {pofile ? (
        <div ref={profileRef} className=" font-manrope flex flex-col gap-3 gap px-5 py-5 bg-gray-100 shadow-md w-[350px] absolute mt-[6%] right-[2%] rounded-[10px] z-50">
          <span className='flex flex-row gap-5 items-center px-2 py-2 bg-secondary-accent rounded-[10px]'>
            {/* --- FIX 5: Use dynamic pic --- */}
            <img
              className='h-[50px] w-[50px] rounded-full object-cover' // Added fixed w/h
              src={profilePic}
              alt="userProfile"
            />
            <span>
              {/* --- FIX 6: Use dynamic name & email --- */}
              <h4 className='text-[20px] font-semibold font-manrope'>{userName}</h4>
              <p className='font-montserrat font-regular'>{userEmail}</p>
            </span>
          </span>
          <Link className='font-montserrat text-[16px] font-medium hover:font-semibold'>Change Password</Link>
          <Link className='font-montserrat text-[16px] font-medium hover:font-semibold '>Share Profile Via Link</Link>
          <Link className='font-montserrat text-[16px] font-medium hover:font-semibold '>Settings</Link>
          <Link className='font-montserrat text-[16px] font-medium hover:font-semibold text-red-600' to="/">Logout</Link>
        </div>
      ) : null}
    </>
  );
}