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

function UpcomingClasses() {
    return (
        // UPCOMING CLASSES DIV
            <div className=" py-5 w-full h-fit">
                <h2 className='font-manrope font-semibold ml-2 text-[18px]'>Upcoming Classes</h2>
                <div className="class-container flex flex-row pl-2 gap-12 w-[100%] md:w-[50vw] overflow-scroll scrollable-hide-scrollbar">
                    {/* starting the class */}
                    <div className="class my-5 flex flex-col gap-5">
                        <h4 className='font-manrope font-semibold text-[22px] border border-font-color w-fit px-5 py-1 rounded-full flex gap-5 items-center'>01 <span className='text-gray-87 text-[14px] font-medium'>9:00 - <br /> 9:55</span></h4>
                        <div className='h-[182px] w-[200px] pl-5 text-font-color flex flex-col justify-center text-left font-montserrat rounded-[10px] bg-[#FFF0E6] gap-2'>
                            <h4 className='text-[18px] font-semibold'>1CSE33</h4>
                            <p className='text-[16px] font-medium'>Mathematics</p>
                            <span className='flex flex-row'>
                                <img className='w-[28px] h-auto' src={s2} alt="pfp invalid" />
                                <img className='w-[28px] h-auto ml-[-5%]' src={s1} alt="pfp invalid" />
                                <img className='w-[28px] h-auto ml-[-5%]' src={s3} alt="pfp invalid" />
                                <p className='text-[14px] font-medium'>+65 students</p>
                            </span>
                            <a className='text-[#750000]  font-medium text-[16px] bg-white w-fit px-8 py-1 rounded-[5px] my-1' href="#">Cancel Class</a>
                        </div>
                    </div>
                    {/* class ended */}
                    {/* starting the class */}
                    <div className="class my-5 flex flex-col gap-5">
                        <h4 className='font-manrope font-semibold text-[22px] border border-font-color w-fit px-5 py-1 rounded-full flex gap-5 items-center'>02 <span className='text-gray-87 text-[14px] font-medium'>10:50 - <br /> 11:45</span></h4>
                        <div className='h-[182px] w-[200px] pl-5 text-font-color flex flex-col justify-center text-left font-montserrat rounded-[10px] bg-[#ECEAFE] gap-2'>
                            <h4 className='text-[18px] font-semibold'>1CSE27</h4>
                            <p className='text-[16px] font-medium'>DECO</p>
                            <span className='flex flex-row'>
                                <img className='w-[28px] h-auto' src={s3} alt="pfp invalid" />
                                <img className='w-[28px] h-auto ml-[-5%]' src={s5} alt="pfp invalid" />
                                <img className='w-[28px] h-auto ml-[-5%]' src={s2} alt="pfp invalid" />
                                <p className='text-[14px] font-medium'>+59 students</p>
                            </span>
                            <a className='text-[#750000]  font-medium text-[16px] bg-white w-fit px-8 py-1 rounded-[5px] my-1' href="#">Cancel Class</a>
                        </div>
                    </div>
                    {/* class ended */}
                    {/* starting the class */}
                    <div className="class my-5 flex flex-col gap-5">
                        <h4 className='font-manrope font-semibold text-[22px] border border-font-color w-fit px-5 py-1 rounded-full flex gap-5 items-center'>03 <span className='text-gray-87 text-[14px] font-medium'>11:45 - <br /> 12:40</span></h4>
                        <div className='h-[182px] w-[200px] pl-5 text-font-color flex flex-col justify-center text-left font-montserrat rounded-[10px] bg-[#E5F7FF] gap-2'>
                            <h4 className='text-[18px] font-semibold'>1CSE31</h4>
                            <p className='text-[16px] font-medium'>DECO</p>
                            <span className='flex flex-row'>
                                <img className='w-[28px] h-auto' src={s2} alt="pfp invalid" />
                                <img className='w-[28px] h-auto ml-[-5%]' src={s4} alt="pfp invalid" />
                                <img className='w-[28px] h-auto ml-[-5%]' src={s3} alt="pfp invalid" />
                                <p className='text-[14px] font-medium'>+48 students</p>
                            </span>
                            <a className='text-[#750000]  font-medium text-[16px] bg-white w-fit px-8 py-1 rounded-[5px] my-1' href="#">Cancel Class</a>
                        </div>
                    </div>
                    {/* class ended */}
                    {/* starting the class */}
                    <div className="class my-5 flex flex-col gap-5">
                        <h4 className='font-manrope font-semibold text-[22px] border border-font-color w-fit px-5 py-1 rounded-full flex gap-5 items-center'>04 <span className='text-gray-87 text-[14px] font-medium'>01:35 - <br /> 02:30</span></h4>
                        <div className='h-[182px] w-[200px] pl-5 text-font-color flex flex-col justify-center text-left font-montserrat rounded-[10px] bg-[#FFF0E6] gap-2'>
                            <h4 className='text-[18px] font-semibold'>1CSE33</h4>
                            <p className='text-[16px] font-medium'>Mathematics</p>
                            <span className='flex flex-row'>
                                <img className='w-[28px] h-auto' src={s2} alt="pfp invalid" />
                                <img className='w-[28px] h-auto ml-[-5%]' src={s1} alt="pfp invalid" />
                                <img className='w-[28px] h-auto ml-[-5%]' src={s3} alt="pfp invalid" />
                                <p className='text-[14px] font-medium'>+63 students</p>
                            </span>
                            <a className='text-[#750000] font-medium text-[16px] bg-white w-fit px-5 py-1 rounded-[5px] my-1' href="#">Cancel Class</a>
                        </div>
                    </div>
                    {/* class ended */}
                </div>
            </div>
    )
}

export default UpcomingClasses
