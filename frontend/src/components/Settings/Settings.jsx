import React, { useState, useRef, useEffect } from 'react';
import Hamburger from 'hamburger-react';
// useNavigate ko import kiya hai logout redirect ke liye
import { NavLink, Link, useNavigate } from 'react-router-dom';
import userProfile from '../../User/profile.png'; // Fallback image

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

export default function Header() {
  // State user ka data store karne ke liye
  const [user, setUser] = useState(null);

  const [hamburger, setHamburger] = useState(false);
  const [notification, setNotification] = useState(false);
  const [pofile, setPofile] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const hamburgerRef = useRef(null);

  const navigate = useNavigate();

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.removeItem('token');
     navigate('/login');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token, user not logged in");
            return; // Agar token nahi hai toh fetch na karein
        }

        const response = await fetch('http://localhost:5000/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); 
        } else {
            
            handleLogout();
        }
      } catch (error) {
        console.error("Error fetching user for header:", error);
      }
    };

    fetchUserData();
  }, []); 
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

  // --- DYNAMIC VARIABLES ---
  // Agar user loaded hai toh uska data, warna fallback
  const userName = user?.full_name || 'Student';
  const userEmail = user?.email || '...';
  const profilePic = user?.profile_photo_url || userProfile; // DB se pic, warna default

  return (
    <>
      {/* MOBILE NAVBAR */}
      <div className='fixed w-[100%] md:hidden bg-white flex flex-row justify-between items-center z-50'>
        <img className='h-[78px]' src="/logo.png" alt="" />
        <div className='flex flex-nowrap justify-center items-center gap-2'>
          <a className='' href="#" ><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg></a>
          <div className='hamburger md:hidden block'>
            <Hamburger size={25} toggled={hamburger} toggle={setHamburger} />
          </div>
        </div>
      </div>

      {/* DESKTOP ONLY WELCOME BOARD */}
      <div className="welcome hidden h-20 w-[100%] md:w-[79%] bg-white fixed top-0 left-0 md:left-[19%] font-manrope px-5 mx-[1%] py-2 text-font-color md:flex flex-row justify-between items-center z-50">
        <div>
          <img className='w-[15rem]' src="/university-logo.png" alt="" />
        </div>
        <div className='flex flex-row gap-10 justify-center items-center'>
          <a className='hidden md:block' href="#" ><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg></a>
          <a className='hidden md:block' onClick={() => setNotification(!notification)} href="#"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell-icon lucide-bell"><path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" /></svg></a>
          <a className='flex-row gap-2 justify-center items-center cursor-pointer hidden md:flex'>
            {/* DYNAMIC PROFILE PIC */}
            <img
              className='h-[40px] md:h-[50px] w-[40px] md:w-[50px] rounded-full object-cover' // w- added
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
        {/* DYNAMIC GREETING (Showing first name) */}
        <h1 className='font-manrope font-semibold text-[24px]'>
          Welcome {user ? user.full_name.split(' ')[0] : '...'},
        </h1>
        <p className='text-[14px] text-gray-87 font-montserrat font-medium'>{currentDate}</p>
      </div>

      {/* HAMBURGER EXPANDED */}
      <div className={`fixed w-[100%] py-8 md:hidden flex justify-center items-center flex-col mt-16 z-50 bg-white shadow-lg rounded-[30px] transition-all duration-300 ease-in-out origin-top
    ${hamburger ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}
  `}>
        <ul className='w-[100%] flex justify-center px-4  flex-col gap-5 font-manrope'>
          <NavLink onClick={() => setHamburger(false)} to="/MyProfile" className={({ isActive }) => `flex flex-row gap-3 ml-2 px-3 py-3  hover:font-semibold hover:text-accent  transition-all duration-300 ease-in-out ${isActive ? "text-accent font-manrope font-bold bg-secondary-accent w-[90%] rounded-[5px]" : "text-gray-87"}`}>
            My Profile</NavLink>
          <NavLink onClick={() => setHamburger(false)} to="/Dashboard" className={({ isActive }) => `flex flex-row gap-3 ml-2 px-3 py-3  hover:font-semibold hover:text-accent  transition-all duration-300 ease-in-out ${isActive ? "text-accent font-manrope font-bold bg-secondary-accent w-[90%] rounded-[5px]" : "text-gray-87"}`}>
            Dashboard</NavLink>
          <NavLink onClick={() => setHamburger(false)} to="/Subjects" className={({ isActive }) => `flex flex-row gap-3 ml-2 px-3 py-3  hover:font-semibold hover:text-accent  transition-all duration-300 ease-in-out ${isActive ? "text-accent font-manrope font-bold bg-secondary-accent w-[90%] rounded-[5px]" : "text-gray-87"}`}>
            Subjects</NavLink>
          <NavLink onClick={() => setHamburger(false)} to="/Assignments" className={({ isActive }) => `flex flex-row gap-3 ml-2 px-3 py-3  hover:font-semibold hover:text-accent  transition-all duration-300 ease-in-out ${isActive ? "text-accent font-manrope font-bold bg-secondary-accent w-[90%] rounded-[5px]" : "text-gray-87"}`}>
            Assignments</NavLink>
          <NavLink onClick={() => setHamburger(false)} to="/Settings" className={({ isActive }) => `flex flex-row gap-3 ml-2 px-3 py-3  hover:font-semibold hover:text-accent  transition-all duration-300 ease-in-out ${isActive ? "text-accent font-manrope font-bold bg-secondary-accent w-[90%] rounded-[5px]" : "text-gray-87"}`}>
            Settings</NavLink>
          
          {/* LOGOUT BUTTON FIX */}
          <button
            onClick={handleLogout}
            className='font-montserrat text-[16px] ml-2 px-3 font-semibold hover:font-semibold text-red-600 text-left'
          >
            Logout
          </button>
        </ul>
      </div>

      {/* NOTIFICATIONS CARD */}
      {notification ?
        <div ref={notificationRef} className=" font-manrope flex flex-col gap-3 gap px-5 py-5 bg-gray-100 shadow-md w-[350px] absolute mt-[6%] right-[8%] rounded-[10px] z-50">
          <p className='text-center text-gray-87 font-montserrat font-medium'>No notifications yet</p>
        </div> : null
      }

      {/* USER PROFILE CARD */}
      {pofile ?
        <div ref={profileRef} className=" font-manrope flex flex-col gap-3 gap px-5 py-5 bg-gray-100 shadow-md w-[350px] absolute mt-[6%] right-[2%] rounded-[10px] z-50">
          <span className='flex flex-row gap-5 items-center px-2 py-2 bg-secondary-accent rounded-[10px]'>
            {/* DYNAMIC PIC */}
            <img
              className='h-[50px] w-[50px] rounded-full object-cover'
              src={profilePic}
              alt="userProfile"
            />
            <span>
              {/* DYNAMIC NAME & EMAIL */}
              <h4 className='text-[20px] font-semibold font-manrope'>{userName}</h4>
              <p className='font-montserrat font-regular'>{userEmail}</p>
            </span>
          </span>
          <Link className='font-montserrat text-[16px] font-medium hover:font-semibold'>Change Password</Link>
          <Link className='font-montserrat text-[16px] font-medium hover:font-semibold '>Share Profile Via Link</Link>
          <Link className='font-montserrat text-[16px] font-medium hover:font-semibold '>Settings</Link>
          
          {/* LOGOUT BUTTON FIX */}
          <button
            onClick={handleLogout}
            className='font-montserrat text-[16px] font-medium hover:font-semibold text-red-600 text-left'
          >
            Logout
          </button>
        </div> : null
      }
    </>
  );
}