import React, { useState, useRef, useEffect } from 'react';
import Hamburger from 'hamburger-react';
// --- CHANGE 1: useNavigate ko import karein (Logout ke liye) ---
import { NavLink, Link, useNavigate } from 'react-router-dom';
import facultyProfile from '../../User/facultyProfile.png'; // Fallback image

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

export default function Header() {
  const [hamburger, setHamburger] = useState(false);
  const [notification, setNotification] = useState(false);
  // --- (FIXED TYPO: pofile -> profile) ---
  const [profile, setProfile] = useState(false); 

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate(); // Navigate hook (Logout ke liye)

  // --- CHANGE 2: User data ko store karne ke liye state ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- CHANGE 3: Data fetch karne ke liye useEffect ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/faculty-login'); // Agar token nahi hai toh login par bhejo
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          localStorage.removeItem('token'); // Kharab token ko remove karo
          navigate('/faculty-login');
          return;
        }

        const data = await res.json();
        setUser(data.user); // User ki details ko state mein save karo
      } catch (err) {
        console.error(err);
        navigate('/faculty-login'); // Error par bhi login page par bhejo
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Yeh aapka click outside wala useEffect hai (bilkul sahi hai)
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotification(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        // (FIXED TYPO: setPofile -> setProfile)
        setProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- CHANGE 4: Logout function ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/faculty-login');
  };

  // Jab tak data load ho raha hai, ek simple header dikha sakte hain
  if (loading) {
    return (
      <div className="welcome hidden w-[100%] md:w-[80%] bg-white fixed top-0 left-0 md:left-[19%] font-manrope px-5 mx-[1%] py-2 h-20 z-50">
        Loading...
      </div>
    );
  }

  return (
    <>
    {/* MOBILE NAVBAR */}
    {/* ... (Mobile navbar code same rahega) ... */}
    <div className='fixed w-[100%] md:hidden ml-2 bg-white flex flex-row justify-between items-center z-50'>
      <img className='h-[78px]' src="/logo.png" alt="" />
      <div className='flex flex-nowrap justify-center items-center gap-2 mr-2'>
      <a className='' href="#" ><svg xmlns="http://www.w3.org/2000/svg"  width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg></a>
      <div className='hamburger md:hidden block'>
        <Hamburger size={25} toggled={hamburger} toggle={setHamburger}/>
        </div>
      </div>
    </div>

    {/* DESKTOP ONLY WELCOME BOARD */}
    <div className="welcome hidden w-[100%] md:w-[80%] bg-white fixed top-0 left-0 md:left-[19%] font-manrope px-5 mx-[1%] py-2 text-font-color md:flex flex-row justify-between items-center z-50">    
      <div>
        {/* --- CHANGE 5: Dynamic Welcome Name --- */}
          <h1 className='text-[24px] font-semibold'>Welcome {user?.full_name},</h1>
          <p className='md:block hidden text-gray-87 text-[16px] md:text-[16px] font-medium font-montserrat'>{currentDate}</p>
      </div>
      <div className='flex flex-row gap-10 justify-center items-center'>
        <a className='hidden md:block' href="#" ><svg xmlns="http://www.w3.org/2000/svg"  width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg></a>
        <a className='hidden md:block' onClick={() => setNotification(!notification)} href="#"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell-icon lucide-bell"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg></a>
        <a className='flex-row gap-2 justify-center items-center cursor-pointer hidden md:flex'>
          {/* --- CHANGE 6: Dynamic Profile Picture --- */}
          <img className=' h-[40px] md:h-[50px] rounded-full' onClick={() => setProfile(!profile)} src={user?.profile_photo_url || facultyProfile} alt="facultyProfile" />
          <svg onClick={() => setProfile(!profile)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
        </a>
        </div>
    
    </div>
      {/* MOBILE ONLY WELCOME BOARD  */}
    <div className=' md:hidden block absolute top-[10%] m-5'>
      {/* --- CHANGE 7: Dynamic Welcome Name (Mobile) --- */}
      <h1 className='font-manrope font-semibold text-[24px]'>Welcome {user?.full_name.split(' ')[0]},</h1>
      <p className='text-[14px] text-gray-87 font-montserrat font-medium'>{currentDate}</p>
    </div>
      {/* HAMBURGER EXPANDED */}
       <div className={`fixed w-[100%] py-8 md:hidden flex justify-center items-center flex-col mt-16 z-50 bg-white shadow-lg rounded-[30px] transition-all duration-300 ease-in-out origin-top
      ${hamburger ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}
    `}> <ul className='w-[100%] flex justify-center px-4  flex-col gap-5 font-manrope'>
              <NavLink onClick={() => setHamburger(false)}  to="/faculty-dashboard" className={({isActive}) => `flex flex-row gap-3 ml-2 px-3 py-3  hover:font-semibold hover:text-accent  transition-all duration-300 ease-in-out ${isActive ? "text-accent font-manrope font-bold bg-secondary-accent w-[90%] rounded-[5px]" : "text-gray-87"}`}>
              Dashboard</NavLink>
              <NavLink onClick={() => setHamburger(false)}  to="/faculty-classroom" className={({isActive}) => `flex flex-row gap-3 ml-2 px-3 py-3  hover:font-semibold hover:text-accent  transition-all duration-300 ease-in-out ${isActive ? "text-accent font-manrope font-bold bg-secondary-accent w-[90%] rounded-[5px]" : "text-gray-87"}`}>
              My Classroom</NavLink>
              <NavLink onClick={() => setHamburger(false)}  to="/faculty-assignments" className={({isActive}) => `flex flex-row gap-3 ml-2 px-3 py-3 _hover:font-semibold hover:text-accent  transition-all duration-300 ease-in-out ${isActive ? "text-accent font-manrope font-bold bg-secondary-accent w-[90%] rounded-[5px]" : "text-gray-87"}`}>
              Assignments</NavLink>
              <NavLink onClick={() => setHamburger(false)}  to="/faculty-settings" className={({isActive}) => `flex flex-row gap-3 ml-2 px-3 py-3  hover:font-semibold hover:text-accent  transition-all duration-300 ease-in-out ${isActive ? "text-accent font-manrope font-bold bg-secondary-accent w-[90%] rounded-[5px]" : "text-gray-87"}`}>
              Settings</NavLink>
          {/* --- CHANGE 8: Logout Button (Mobile) --- */}
              <button onClick={handleLogout} className='font-montserrat text-left text-[16px] ml-2 px-3 font-semibold hover:font-semibold text-red-600'>Logout</button>
            </ul>
      </div>
  {/* NOTIFICATIONS CARD */}
      {notification ?
        <div ref={notificationRef} className=" font-manrope flex flex-col gap-3 gap px-5 py-5 bg-gray-100 shadow-md w-[350px] absolute top-[11%] right-[8%] rounded-[10px] z-50">
          <p className='text-center text-gray-87 font-montserrat font-medium'>No notifications yet</p>
        </div> : null
      }
  {/* USER PROFILE CARD */}
    {/* (FIXED TYPO: pofile -> profile) */}
      {profile ? 
        <div ref={profileRef} className=" font-manrope flex flex-col gap-3 gap px-5 py-5 bg-gray-100 shadow-md w-[350px] absolute top-[11%] right-[2%] rounded-[10px] z-50">
          <span className='flex flex-row gap-5 items-center px-2 py-2 bg-secondary-accent rounded-[10px]'>
            {/* --- CHANGE 9: Dynamic Profile Card Details --- */}
            <img className='h-[50px] rounded-full' src={user?.profile_photo_url || facultyProfile} alt="facultyProfile" />
            <span>
              <h4 className='text-[20px] font-semibold font-manrope'>{user?.full_name}</h4>
              <p className='font-montserrat font-regular'>{user?.email}</p> 
            </span>
          </span>
            <Link className='font-montserrat text-[16px] font-medium hover:font-semibold'>Change Password</Link>
            <Link className='font-montserrat text-[16px] font-medium hover:font-semibold '>Share Profile Via Link</Link>
            <Link className='font-montserrat text-[16px] font-medium hover:font-semibold '>Settings</Link>
          {/* --- CHANGE 10: Logout Button (Dropdown) --- */}
            <button onClick={handleLogout} className='font-montserrat text-left text-[16px] font-medium hover:font-semibold text-red-600'>Logout</button>
        </div> : null
      }
    </>
  );
}
