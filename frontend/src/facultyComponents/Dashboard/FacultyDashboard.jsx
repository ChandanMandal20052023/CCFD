import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import s1 from '../../assets/s-1.png'
import s2 from '../../assets/s-2.png'
import s3 from '../../assets/s-3.png'
import s4 from '../../assets/s-4.png'
import s5 from '../../assets/s-5.png'
import sih from '../../assets/SIH2.webp'
import python from '../../assets/python.png'
import azure from '../../assets/azure.png'
import aicerts from '../../assets/aicerts.webp'
import UpcomingClasses from '../UI/UpcomingClasses'
import SubmitAssignments from '../UI/SubmitAssignments'
import StudentProfiles from '../UI/StudentProfiles'
import Notices from '../UI/Notices'



function FacultyDashboard() {

    return (
        <div className='absolute top-[12.5%] mx-5 md:mt-0 mt-[20%] mb-0  left-0 md:left-[20%] text-font-color'>
            <div className="alert font-manrope text-[16px] bg-[#F8E6AC] bg-opacity-30 px-3 py-3 rounded-[10px] md:w-[50%] w-[100%] h-fit">
                <p className='md:text-wrap md:pr-10 '>
                    Your students completed <span className='font-bold text-[#FE7474]'>80%</span> of their Assignments. <br /> Progress is  <span className='font-bold text-[#FE7474]'>Very Good.</span>
                </p>
            </div>
           <div className='min-h-screen flex justify-start'>
           <div className='grid grid-cols-1 md:grid-cols-3 gap-20 w-12/12 max-w-[100%]'>
           {/* Left Col */}
                <div className='md:col-span-2 flex flex-col aspect-square'>
                    <UpcomingClasses />
                    <StudentProfiles />
                </div>
                <div className='flex flex-col mt-[-10%] gap-4'>
                    <SubmitAssignments />
                    <Notices /> 
                </div>
           </div>
           </div>
        </div>
    )
}

export default FacultyDashboard
