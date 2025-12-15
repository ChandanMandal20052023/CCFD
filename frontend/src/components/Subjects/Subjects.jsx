import { ChevronRight, Download, EllipsisVertical } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react' // Import useEffect
import { useNavigate } from 'react-router-dom'; // Import useNavigate for error handling

function Subjects() {
  const [openMenu, setOpenMenu] = useState(null); // which subject index is open
  const menuRef = useRef();

  // --- Naya State ---
  const [subjects, setSubjects] = useState([]); // Static array ko state se replace kiya
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- Data Fetching Logic ---
  useEffect(() => {
    const fetchSubjects = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Token nahi hai toh login par bhej do
        return;
      }

      try {
        setLoading(true);
        // Naya API endpoint jo hum server.js mein banayenge
        const res = await fetch('http://localhost:5000/api/students/me/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401) navigate('/login'); // Invalid token
          throw new Error('Failed to fetch subjects');
        }

        const data = await res.json();
        setSubjects(data.courses); // API se mila data state mein set karo
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [navigate]); // navigate ko dependency array mein add karein

  // --- Click outside logic (Aapka code) ---
  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []); // Isse alag useEffect mein rakha

  // --- Render Logic ---
  if (loading) {
    return <div className='p-8'>Loading subjects...</div>;
  }

  if (error) {
    return <div className='p-8 text-red-500'>Error: {error}</div>;
  }

  return (
    <div className='absolute m-5 mb-0 md:m-0 w-[calc(100%-2.5rem)] md:w-[78%] left-0 md:left-[22%] top-[22%] md:top-[15%] flex flex-col gap-[1rem] z-10 h-fit text-font-color'>
      <h2 className='font-manrope flex font-bold text-[20px] md:text-[22px] items-center mb-4'>My Subjects <ChevronRight /></h2>
      
      {subjects.length === 0 ? (
        <p>Aap abhi tak kisi subject mein enroll nahi hue hain.</p>
      ) : (
        subjects.map((s, i) => (
          <div key={s.subject_id} // Key ko unique ID se badla
            className="relative w-full flex justify-between items-center bg-gray-100 p-4 rounded-[10px] border shadow-sm">
            <div>
              {/* Dynamic data ka istemal */}
              <h3 className="font-semibold font-montserrat text-[18px] text-font-color">{s.subject_name}</h3>
              <p className="text-[16px] font-montserrat text-gray-87 font-medium">{s.teacher_name || 'Not assigned'}</p>
            </div>

            <div className="flex gap-4 items-center relative font-manrope" ref={menuRef}>
              {/*TODO: 's.syllabus_url' ko database mein add karein */}
              <a href={s.syllabus_url || '#'} target="_blank" rel="noopener noreferrer" className="flex gap-2 font-semibold px-4 py-2 bg-secondary-accent text-accent rounded-[5px]">
                <Download /> <span className="hidden md:block">Syllabus</span>
              </a>

              <EllipsisVertical
                className="cursor-pointer"
                onClick={() => setOpenMenu(openMenu === i ? null : i)}
              />

              {openMenu === i && (
                <div className="absolute right-0 top-8 bg-white border shadow-lg rounded-md p-2 w-40 text-sm">
                  <button className="w-full text-left hover:bg-gray-100 px-2 py-1 rounded">
                    Report an Issue
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Subjects;
