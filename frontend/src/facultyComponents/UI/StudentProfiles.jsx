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

function StudentProfiles() {
    return (
        // STUDENT PROFILES CERTIFICATES APPROVAL DIV 
            <div className='studentProfiles py-0 w-full '>
                <h2 className='font-manrope font-semibold ml-2 mb-4 text-[18px]'>Student Profiles</h2>
                <table className='font-manrope w-full md:mx-[1%] mx-[-1%]'>
                    <tr className='font-montserrat flex w-full md:w-[50vw] py-4 md:px-4 px-2 pr-4 my-4 mx-[-1%] bg-gray-100 rounded-[5px] justify-between'>
                    <td className='font-medium'>Name</td>
                    <td className='font-medium ml-[-8%]'>Certifications by</td>
                    <td className=' hidden md:block font-medium'>Roll no</td>
                    <td className='font-medium'>Status</td>
                    </tr>
                </table>
                <div className='flex flex-col font-montserrat ml-0 mr-0 w-[100%] md:w-[51vw]'>
                    {/* student profile row 1 */}
                    <p className='flex flex-row md:mx-4 mx-0 justify-between items-center'>
                        <span>Aditya</span>
                        <span className='bg-[#e5e5e5] py-1 md:px-6 rounded-[5px] w-[7rem] md:w-[8rem] text-left px-2'>Azure</span>
                        <span className='hidden md:block mr-[-5%]'>25SCS100300ABCS</span>
                        <span className='flex flex-row flex-nowrap items-center cursor-pointer bg-[#E6FFE6] w-[8rem] px-4 py-1 rounded-[5px] font-medium text-[#004700]'>Approved 
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                        </span>
                    </p>
                    {/* student profile row 2 */}
                    <p className='flex flex-row md:mx-4 mx-0 my-6 justify-between items-center'>
                        <span>Sakshi</span>
                        <span className='bg-[#e5e5e5] py-1 md:px-6  rounded-[5px] w-[7rem] md:w-[8rem] text-left px-2'>Hackverse</span>
                        <span className=' hidden md:block mr-[-5%]'>25SCS100300ZYCS</span>
                        <span className='flex flex-row flex-nowrap items-center cursor-pointer bg-[#FFE6E6] w-[8rem] px-4 py-1 rounded-[5px] font-medium text-[#750000]'>Rejected 
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                        </span>
                    </p>
                    {/* student profile row 3 */}
                    <p className='flex flex-row md:mx-4 mx-0 justify-between items-center'>
                        <span>Amaan</span>
                        <span className='bg-[#e5e5e5] py-1 md:px-6  rounded-[5px] w-[7rem] md:w-[8rem] text-left px-2'>Python</span>
                        <span className='hidden md:block mr-[-5%]'>25SCS100300QRCS</span>
                        <span className='flex flex-row flex-nowrap items-center cursor-pointer bg-[#FEE8D6] w-[8rem] px-4 py-1 rounded-[5px] font-medium text-[#C77F44]'>Pending 
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                        </span>
                    </p>
                    {/* student profile row 4 */}
                    <p className='flex flex-row md:mx-4 mx-0 my-6 justify-between items-center'>
                        <span>Faisal K</span>
                        <span className='bg-[#e5e5e5] py-1 md:px-6  rounded-[5px] w-[7rem] md:w-[8rem] text-left px-2'>Hackverse</span>
                        <span className='hidden md:block mr-[-5%]'>25SCS100300RQCS</span>
                        <span className='flex flex-row flex-nowrap items-center cursor-pointer bg-[#E6FFE6] w-[8rem] px-4 py-1 rounded-[5px] font-medium text-[#004700]'>Approved 
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                        </span>
                    </p>
                <p className='font-manrope font-bold text-accent cursor-pointer ml-[80%] md:ml-[90%]'>View All</p>
                </div>
            </div>
    )
}

export default StudentProfiles
