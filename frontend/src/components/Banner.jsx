import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Banner = () => {
    const navigate=useNavigate();
  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className='flex bg-[#5f6fff] rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 md:mx-10 overflow-hidden'>

        {/* ------- Left Side ------- */}
        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
       <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white  '>
         <p>Book Appointment</p>
        <p className='mt-4'>With 100+ Trusted Doctors</p>
       </div>
       <button onClick={()=>{
        navigate('/login');
        scrollTo(0,0);
       }} className='bg-white  text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all '>Create account</button>
        </motion.div>

   {/* -------Right Side -------- */}
     <motion.div 
         initial={{ opacity: 0, x: 50 }}
         whileInView={{ opacity: 1, x: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.8, delay: 0.4 }}
         className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
      <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
     </motion.div>
         
    </motion.div>
  )
}

export default Banner