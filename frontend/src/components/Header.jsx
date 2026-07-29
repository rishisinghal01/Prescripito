import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { motion } from 'framer-motion'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-gradient-to-r from-[#5f6FFF] to-[#4052d6] dark:from-[#2e3a8c] dark:to-[#1e265c] rounded-lg px-6 md:px-10 lg:px-20 overflow-hidden shadow-xl dark:shadow-2xl transition-colors duration-300'>
    {/* Left Side*/}
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px] '>

        <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight drop-shadow-md'>
            Book Appointment <br /> With Trusted Doctors
        </p>
        <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light opacity-90' >
            <img className='w-20 rounded-full shadow-lg border-2 border-white/20' src={assets.group_profiles} alt="" />
             <p>Simply browse through our extensive list of trusted doctors, <br className='hidden sm:block' /> schedule your appointment hassle-free</p>
        </div>
        <a className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-700 font-medium text-sm m-auto md:m-0 hover:scale-105 hover:bg-gray-50 hover:shadow-lg transition-all duration-300 group' href="#speciality">
            Book appointment <img className='w-3 group-hover:translate-x-1 transition-transform' src={assets.arrow_icon}/>
        </a>
    </motion.div>
   {/* Right Side */}

    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className='md:w-1/2 relative flex justify-center items-end'>
        <img className='w-full md:absolute bottom-0 h-auto rounded-lg drop-shadow-2xl object-cover' src={assets.header_img} alt="" />
    </motion.div>
    </div>
  )
}

export default Header