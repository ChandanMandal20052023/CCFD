import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Picker from 'react-month-picker';
import vector1 from '../../assets/vector-1.png';
import collegeMap from '../../assets/college-map.png';
import vector4 from '../../assets/vector-4.png';
import Header from '../Header/Header';
import Calendar from '../UI/Calendar';
import Notifications from '../UI/Notifications';
import YourActivities from '../UI/YourActivites';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Aap logged in nahi hain.');
                setLoading(false);
                navigate('/login');
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/api/me', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    localStorage.removeItem('token');
                    throw new Error('Token invalid hai. Dobara login karein.');
                }

                const data = await res.json();
                setUser(data.user);
            
            } catch (err) {
                setError(err.message);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return <div className='p-8'>Loading your dashboard...</div>;
    }

    if (error) {
        return <div className='p-8 text-red-500'>Error: {error}</div>;
    }

    if (!user) {
        return <div className='p-8'>Could not load user profile.</div>;
    }

    //
    // =================== YAHAN FIX KIYA GAYA HAI ===================
    //
    // --- CHANGE 1: Data seedha user object se lein (aur null check karein) ---
    const total_present = user.total_present || 0;
    const total_classes = user.total_classes || 0;
    
    // --- CHANGE 2: `total_absent` aur `percentage` ko calculate karein ---
    const total_absent = total_classes - total_present;

    const attendancePercentage = total_classes > 0 
        ? ((total_present / total_classes) * 100).toFixed(0) 
        : 0;
    //
    // =================== FIX KHATAM ===================
    //

    return (
        // MAIN DIV
        <div className='absolute w-[100%] md:w-auto order-1 left-0 md:left-[22%] top-[22%] md:top-[15%] flex flex-wrap flex-row gap-[2rem] z-10 h-fit text-font-color'>
        {/* ACADEMIC INFORMATION DIV */}
            <div className="acadInfo font-bold text-[20px] md:text-[22px] px-5 py-5 h-fit md:w-[378px] w-[100%] border border-gray-87 rounded-[10px]  m-5 mb-0 md:m-0">
                <h2 className='font-manrope pb-3'>Academic Information</h2>
                {/* Yeh data pehle se sahi tha */}
                <h4 className='font-medium text-[14px] md:text-[16px] py-3 font-montserrat'><span className='font-semibold'>Name:</span> {user.full_name}</h4>
                <h4 className='font-medium text-[14px] md:text-[16px] py-3 font-montserrat'><span className='font-semibold'>Roll no:</span> {user.roll_number}</h4>
                <h4 className='font-medium text-[14px] md:text-[16px] py-3 font-montserrat'><span className='font-semibold'>Current Semester:</span> {user.current_semester}</h4>
                <h4 className='font-medium text-[14px] md:text-[16px] py-3 font-montserrat'><span className='font-semibold'>Batch:</span>{user.batch}</h4>
                <h4 className='font-medium text-[14px] md:text-[16px] py-3 font-montserrat'><span className='font-semibold'>Current Grade/CGPA:</span> {user.current_cgpa}</h4>
            </div>
        {/* ATTENDANCE DIV */}
            <div className="attendance font-bold text-[22px] md:order-2 order-3 px-5 py-5 h-fit md:w-[378px] w-[100%] border border-gray-87 rounded-[10px]  m-5 mt-0 mb-5 md:m-0 overflow-hidden">
                <div className='flex flex-row justify-between items-center '>
                <h2 className='font-manrope pb-3'>Attendance</h2>
                <p className='font-montserrat font-medium text-[14px] flex flex-row text-gray-87'>Sep 2025 &nbsp; 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                </p>
            </div>
            {/* ATTENDANCE DIV CHILD */}
            <div className='flex flex-row gap-5'>
            <div className='mt-5'>
                    <p className='text-gray-87 font-medium font-montserrat text-[14px] flex flex-row items-center gap-[10px]'>
                    <span className='w-[10px] h-[10px] rounded-full bg-accent block '></span>
                    Present
                    </p>
                    {/* --- CHANGE 3 (JSX): Sahi variable use karein --- */}
                    <p className='present font-manrope text-font-color py-2 text-[20px]'>{total_present}</p>
                    <p className='text-gray-87 pt-2 font-medium font-montserrat text-[14px] flex flex-row items-center gap-[10px]'>
                    <span className='w-[10px] h-[10px] rounded-full bg-[#FB896B] block '></span>
                    Absent
                    </p>
                    {/* --- CHANGE 3 (JSX): Sahi variable use karein --- */}
                    <p className='absent font-manrope text-font-color py-2 text-[20px]'>{total_absent}</p>
                    <p className='text-gray-87 pt-2 font-medium font-montserrat text-[14px] flex flex-row items-center gap-[10px]'>
                    <span className='w-[10px] h-[10px] rounded-full bg-[#F8C07F] block '></span>
                    Total
                    </p>
                    {/* --- CHANGE 3 (JSX): Sahi variable use karein --- */}
                    <p className='total font-manrope text-font-color py-2 text-[20px]'>{total_classes}</p>
                </div>
                <img className='h-[200px] mt-5 ml-5' src={vector1} alt="" />
            </div>
            </div>
        {/* MISC DIV - THE THREE IMPORTANT COLUMNS */}
            <div className="misc font-manrope font-bold w-[348px] md:order-3 order-2 flex flex-col gap-5 m-5 mt-0 mb-0 md:m-0">
                <div className='bg-[#FFF0E6] md:w-auto w-[100%] flex flex-col py-3 rounded-[10px] justify-center items-center'>
                    {/* --- CHANGE 4 (JSX): Sahi variable use karein --- */}
                    <h2 className='text-[22px]'>{attendancePercentage}%</h2>
                    <p className='font-montserrat font-medium'>Current Attendance Per.</p>
                    <p className='font-montserrat font-medium text-gray-87 text-[12px]'>20% Increase from Last Week</p>
                </div>
                <div className='bg-[#ECEAFE] md:w-auto w-[100%] flex flex-col py-3 rounded-[10px] justify-center items-center h-fit'>
                    <h2 className='text-[22px]'>06</h2>
                    <p className='text-[16px] font-montserrat font-semibold'>Assignments Pending</p>
                </div>
                <div className='bg-[#E5F7FF] md:w-auto w-[100%] flex flex-col py-3 rounded-[10px] justify-center items-center h-fit cursor-pointer'>
                    <img className='h-[60px]' src={collegeMap} alt="" />
                    <h2 className='text-[16px] font-montserrat font-semibold'>College Map</h2>
                </div>
            </div>
        {/* ACADEMIC CALENDAR DIV */}
        <div className='order-4'>
                <h2 className='text-font-color font-manrope font-bold text-[22px] pb-3 md:m-0 mx-6'>Academic Calendar</h2>
            <Calendar />
        </div>
        {/* ACADEMIC CALENDAR GRAPHIC */}
        <div className='hidden md:block max-w-[25%] order-5'>
            <img src={vector4} alt="" />
        </div>
        {/* NOTIFICATIONS HERE */}
        <div className='order-6'>
            <Notifications />
        </div>
        {/* YOUR ACTIVITIES HERE  */}
        <div className='order-7'>
            <YourActivities />
        </div>
        </div>
    )
}
export default Dashboard;