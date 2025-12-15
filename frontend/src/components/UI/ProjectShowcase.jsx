import React from 'react'
import { CirclePlus } from "lucide-react";
import project1 from '../../assets/project-1.png'
import project2 from '../../assets/project-2.png'
import projectBackground from '../../assets/project-bg.png'


function ProjectShowcase() {
    return (
        <div className='font-manrope px-8 pt-4 pb-4 bg-[#f3f3f3] w-[100vw] md:max-w-[37vw] rounded-[10px] shadow-sm bg-cover bg-center'  style={{ backgroundImage: `url(${projectBackground})` }}>
            <div className='flex justify-between items-center flex-row gap-12'>
                <h2 className='font-semibold text-[20px]'>Project Showcase</h2>
                <a className='flex flex-nowrap flex-row justify-center items-center gap-2 font-semibold bg-accent w-[12rem] md:w-auto text-[14px] text-white px-2 py-2 rounded-[5px]' href="#">
                    <CirclePlus size={18} />
                    Add Project</a>
            </div>
            <div className='mt-5 flex justify-center flex-col md:flex-row gap-5 md:gap-10'>
                {/* project 1 */}
                <div className='w-[100vw]'>
                    <img className='max-h-[8rem]' src={project1} alt="" />
                    <h2 className='font-manrope font-medium pt-1 w-fit backdrop-blur-sm'>Swiggy: Online Food Delivery App</h2>
                    <p className='py-2 w-fit backdrop-blur-sm'>(Flutter, Figma)</p>
                    <a className='bg-[#fff] backdrop-blur-sm rounded-[5px] px-2 py-1 mt-2 text-red-800 font-semibold ' href="#">View Project</a>
                </div>
                {/* project 2 */}
                <div className='w-[100vw]'>
                    <img className='max-h-[8rem] rounded-xl' src={project2} alt="" />
                    <h2 className='font-manrope font-medium pt-1 w-fit backdrop-blur-sm'>To-Do List WebAPP</h2>
                    <p className='py-2 w-fit backdrop-blur-sm'>(React JS, Figma)</p>
                    <a className='bg-[#fff] backdrop-blur-sm rounded-[5px] px-2 py-1 mt-2 text-red-800 font-semibold ' href="#">View Project</a>
                </div>
            </div>
        </div>
    )
}

export default ProjectShowcase
