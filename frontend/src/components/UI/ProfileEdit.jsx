import React from "react";
import { Camera, Download } from "lucide-react";
import userProfile from "../../User/profile.png"; // Fallback image

// 1. 'onExportClick' prop ko yahaan receive karein
export default function ProfileHeader({ user, onExportClick }) {
  const userName = user?.full_name || "Guest User";
  const userBio =
    user?.description || "No bio available. Update your profile to add more details.";
  
  return (
    <div className="flex items-center flex-wrap md:flex-nowrap justify-between p-0 md:p-12 md:pt-2 font-manrope w-full">
      {/* Left Section - Avatar + Info (Yeh code same rahega) */}
      <div className="flex items-center md:gap-4 gap-8 w-full mt-20 md:mt-2">
        {/* Avatar */}
        <div className="relative">
          <img
            src={user?.profile_photo_url || userProfile}
            alt="profile"
            // Note: h-26 standard Tailwind class nahi hai, shayad h-24?
            className="h-26 w-36 md:w-24 md:h-24 rounded-full border border-gray-200 object-cover z-1"
          />
          <div className="absolute bottom-0 right-0 bg-white rounded-full m-[-1%] cursor-pointer p-2 z-2">
            <Camera size={20} />
          </div>
        </div>

        {/* Name + Bio */}
        <div>
          <h2 className="text-[20px] md:text-[22px] font-semibold text-font-color">
            {userName}
          </h2>
          <p className="text-font-color text-[12px] md:text-[14px] font-montserrat">
            {userBio}
          </p>
        </div>
      </div>

      {/* 2. 'onClick' ko button mein add karein */}
      <a 
        // 'href' seedha public folder mein rakhi file ko point karega
        // (Aap "My_CV.pdf" ko apni file ke naam se badal lein)
        href="/Faisal_khan_CV.pdf" 
        
        // 'download' attribute browser ko batata hai ki file ko open na kare, download kare
        download="Faisal_khan_CV.pdf" 

        // ClassName same rakhein taaki yeh button jaisa hi dikhe
        className="flex items-center justify-center w-[16rem] flex-nowrap gap-2 px-4 py-2 my-4 bg-secondary-accent shadow-sm text-accent text-[16px] md:text-[18px] font-semibold rounded-[10px]"
      >
        <Download size={20} /> Export as CV
      </a>
    </div>
  );
}