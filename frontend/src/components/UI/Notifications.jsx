import React from 'react'
import s1 from '../../assets/s-1.png'
import s2 from '../../assets/s-2.png'
import s3 from '../../assets/s-3.png'
import s4 from '../../assets/s-4.png'
import s5 from '../../assets/s-5.png'
import sih from '../../assets/SIH2.webp'
import python from '../../assets/python.png'
import azure from '../../assets/azure.png'
import aicerts from '../../assets/aicerts.webp'

function Notifications() {
    return (
            // NOTIFICATIONS COLUMN DIV 
            <div className='notice font-manrope w-screen px-6 md:w-fit'>
                <div className='flex flex-row justify-between items-center'>
                <h2 className='font-manrope font-bold text-[22px]'>Notifications</h2>
                <p className='font-manrope font-bold text-accent cursor-pointer'>View All</p>
                </div>
            {/* All Notifications here */}
            <div className='flex flex-col'>
                {/* notice 1 */}
                <div className='flex flex-row justify-start items-center bg-gray-100 w-full rounded-[10px] gap-4 px-8 py-2 mt-5'>
                    <img className='w-[2.5rem] bg-white rounded-[5px]' src={sih} alt="image error" />
                    <div className='font-manrope text-[16px] flex justify-start flex-col text-left'>
                    <p className='font-medium'>Smart India Hackathon</p>
                    <p className='text-gray-87'>14 Sep 2025 | 10:21AM</p>
                    </div>
                </div>
                {/* notice 2 */}
                <div className='flex flex-row justify-start items-center bg-gray-100  w-full rounded-[10px] gap-4 px-8 py-2 mt-5'>
                    <img className='w-[2.5rem] bg-white rounded-[5px]' src={python} alt="image error" />
                    <div className='font-manrope text-[16px] flex justify-start flex-col text-left'>
                    <p className='font-medium'>Python Workshop</p>
                    <p className='text-gray-87'>29 Aug 2025 | 5:14PM</p>
                    </div>
                </div>
                {/* notice 3 */}
                <div className='flex flex-row justify-start items-center bg-gray-100  w-full rounded-[10px] gap-4 px-8 py-2 mt-5'>
                    <img className='w-[2.5rem] bg-white rounded-[5px]' src={azure} alt="image error" />
                    <div className='font-manrope text-[16px] flex justify-start flex-col text-left'>
                    <p className='font-medium'>Collect Certification</p>
                    <p className='text-gray-87'>14 Aug 2025 | 11:23PM</p>
                    </div>
                </div>
                {/* notice 4 */}
                <div className='flex flex-row justify-start items-center bg-gray-100 w-full rounded-[10px] gap-4 px-8 py-2 mt-5'>
                    <img className='w-[2.5rem] bg-white rounded-[5px]' src={aicerts} alt="image error" />
                    <div className='font-manrope text-[16px] flex justify-start flex-col text-left'>
                    <p className='font-medium'>AI Certification</p>
                    <p className='text-gray-87'>01 Aug 2025 | 5:29PM</p>
                    </div>
                </div>
            </div>
            </div>
    )
}

export default Notifications
           