// Kadam 1: Imports add karein
import React, { useState, useRef, useEffect } from 'react'; 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import ProfileHeader from '../UI/ProfileHeader';
import ProfileEdit from '../UI/ProfileEdit';
// ... (aapke baaki saare imports)
import Navigations from '../Navigations/Navigations';
import SkillTimeline from '../UI/SkillTimeline';
import ProjectShowcase from '../UI/ProjectShowcase';
import RecentActivities from '../UI/RecentActivities';
import CurrentCredits from '../UI/CurrentCredits';
import Achievements from '../UI/Achievements';

function MyProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kadam 2: Ref create karein
  // Yeh 'ref' uss div ko point karega jise hum PDF mein convert karna chahte hain
  const cvContentRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await fetch('http://localhost:5000/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data.user); 
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null); 
      } finally {
        setLoading(false); 
      }
    };
    fetchUserData();
  }, []); 

  // Kadam 3: PDF export function likhein
  const handleExportCV = () => {
    const input = cvContentRef.current; // Ref se CV content div ko pakdein
    if (!input) {
      console.error("CV content element nahi mila!");
      return;
    }

    // Canvas se 'screenshot' lein
    html2canvas(input, { 
      scale: 2, // Behtar quality ke liye
      useCORS: true // Agar images (jaise profile pic) alag domain se aa rahi hain
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        
        // A4 PDF (portrait) banayein
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Image ko PDF mein add karein
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        // PDF ko download karein
        pdf.save(`${user?.full_name || 'student'}_CV.pdf`);
      })
      .catch((err) => {
        console.error("PDF generate karne mein error:", err);
      });
  };

  if (loading) {
    return (
      <div>
        <div className='fixed top-0'>
          <Navigations />
        </div>
        <div className='ml-[12%] md:ml-[20%] mt-[5%]'>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* SIDEBAR NAVIGATION */}
      <div className='fixed top-0'>
        <Navigations />
      </div>

      {/* PROFILE HEADER */}
      <div className='fixed flex justify-between left-0 md:left-[20%] top-0 w-[100vw] md:w-[79vw] z-50'>
        {/* Kadam 4: Function ko prop ke zariye pass karein */}
        <ProfileHeader user={user} onExportClick={handleExportCV} />
      </div>

      {/* PHOTO EDIT AND EXPORT AS CV */}
      <div className='ml-[12%] md:ml-[20%] mt-[5%]'>
        <ProfileEdit user={user} />
      </div>

      {/* REST OF THE UI*/}
      {/* Kadam 2 (Jaari): Ref ko content wrapper div ko assign karein */}
      <div 
        ref={cvContentRef} 
        className='my-[-2%] md:ml-[20%] px-[3%] flex flex-col md:flex-row flex-wrap justify-between gap-8 items-center w-fit md:w-[79vw]'
      >
        {/* Yeh saara content ab PDF mein export hoga */}
        <SkillTimeline />
        <ProjectShowcase />
        <RecentActivities />
        <div className='flex flex-row gap-8 flex-wrap'>
          <CurrentCredits />
          <Achievements />
      	</div>
      </div>
    </div>
  );
}

export default MyProfile;