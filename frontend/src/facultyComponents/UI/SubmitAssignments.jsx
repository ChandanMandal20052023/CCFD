import React from 'react'
import {Link} from 'react-router-dom'
import s1 from '../../assets/s-1.png'
import s2 from '../../assets/s-2.png'
import s3 from '../../assets/s-3.png'
import s4 from '../../assets/s-4.png'
import s5 from '../../assets/s-5.png'
import sih from '../../assets/SIH2.webp'
import python from '../../assets/python.png'
import azure from '../../assets/azure.png'
import aicerts from '../../assets/aicerts.webp'

function SubmitAssignments() {
    return (
        //   SUBMIT ASSIGNMENTS 
            <div className='font-manrope w-full h-fit'>
                <h2 className='font-manrope font-semibold text-[18px] text-left'>Create New Assignment</h2>
                <div className="assignments h-[300px] w-[100%] md:w-[20vw] mt-5 rounded-[10px] bg-gray-100 flex flex-col py-5 gap-5 justify-start items-center">
                    <input className='text-[16px] font-montserrat py-3 outline-none bg-white px-4 w-[80%] rounded-[5px]' type="text" placeholder='Assignment Name' />
                <div className='text-accent bg-secondary-accent rounded-[10px] w-[80%] px-4 py-2 flex justify-center items-center flex-col'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-upload-icon lucide-cloud-upload"><path d="M12 13v8"/><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 17 4-4 4 4"/></svg>
                    <p className='font-semibold'>Drag and drop or <a className='underline underline-offset-2' href="">choose file</a></p>
                    <p className='flex flex-row flex-wrap justify-center items-center py-2 font-medium font-montserrat text-[12px]'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                     &nbsp;   Max file size: 5MB <span className='italic'> &nbsp;, PDF formats only</span>
                    </p>
                    <input type="file"className='hidden' />
                </div>
                <Link  className='font-montserrat font-medium tet-[18px] bg-accent text-white w-[80%] text-center py-4 rounded-[10px]' to="#">Send Assignments</Link>
                </div>
            </div>
            
    )
}

export default SubmitAssignments
