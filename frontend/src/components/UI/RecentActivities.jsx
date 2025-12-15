import React from 'react'
import { CirclePlus } from "lucide-react";
import internship1 from '../../assets/internship-1.png'
import internship2 from '../../assets/internship-2.png'
import internship3 from '../../assets/internship-3.png'


function RecentActivities() {
    return (
        <div>
            <div className='flex justify-between items-center gap-10 w-[100vw] md:max-w-[32vw] '>
            <h2 className='font-semibold text-[20px] font-manrope'>Recent Activities and Internship</h2>
            <a className='flex flex-row flex-nowrap justify-center items-center w-fit gap-2 text-[18px] bg-[#DEEEFF] py-1 px-2 rounded-[5px]'  href="#">
                <CirclePlus size={20} />
                Add</a>
            </div>
            {/* RECENT ACTIVITIES MAIN DIV */}
            <div className='flex flex-col w-[100vw] md:max-w-[32vw]'>
                {/* INTERNSHIP 1 */}
                <div className='bg-[#eee] rounded-[10px] font-manrope py-2 px-4 my-4 text-left flex flex-row justify-center gap-6 items-center'>
                    <img className='w-[3.5rem]' src={internship1} alt="" />
                    <div className='flex flex-col'>
                        <h2 className='font-medium text-[18px] md:text-[16px]'>Frontend Developer</h2>
                        <p className='text-[14px]'>GDG IILM University</p>
                    </div>
                    <h2 className='font-medium pl-12'>Aug 2025 - Sept present</h2>
                </div>
                {/* INTERNSHIP 2 */}
                <div className='bg-[#eee] rounded-[10px] font-manrope py-2 px-4 my-2 text-left flex flex-row justify-center gap-6 items-center'>
                    <img className='w-[3.5rem]' src={internship2} alt="" />
                    <div className='flex flex-col'>
                        <h2 className='font-medium text-[18px] md:text-[16px]'>Website Designer</h2>
                        <p className='text-[14px]'>Innovation Media Agency</p>
                    </div>
                    <h2 className='font-medium pl-12'>July 2025 - Sept present</h2>
                </div>
                {/* INTERNSHIP 3 */}
                <div className='bg-[#eee] rounded-[10px] font-manrope py-2 px-4 my-2 flex flex-row justify-start gap-6 items-center'>
                    <img className='w-[3.5rem]' src={internship3} alt="" />
                    <div className='flex flex-col'>
                        <h2 className='font-medium text-[18px] md:text-[16px]'>Blockchain Seminar</h2>
                        <p className='text-[14px]'>Learnt About Bitcoin</p>
                    </div>
                    <h2 className='font-medium pl-16'>28 July 2025</h2>
                </div>
            </div>
        </div>
    )
}

export default RecentActivities
