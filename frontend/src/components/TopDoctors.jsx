import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/Appcontext';
import { motion } from 'framer-motion'

const TopDoctors = () => {
    const navi=useNavigate();
    const {doctors}=useContext(AppContext);
  return (
    <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
        <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
        <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors</p>
        <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 pt-5 gap-y-8 px-3 sm:px-0'>
        {doctors.slice(0,10).map((item,idx)=>{
            return <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                key={idx} onClick={()=>{navi(`/appointment/${item._id}`)
            scrollTo(0,0)}} className='border border-[#C9D8FF] bg-white rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] hover:shadow-xl transition-all duration-500 shadow-sm flex flex-col'>

                <div className='w-full h-56 bg-[#EAEFFF] flex items-center justify-center overflow-hidden'>
                   <img className='w-full h-full object-cover object-top' src={item.image} alt="" />
                </div>
                <div className='p-4 flex-1 flex flex-col'>
                    <div className={`flex items-center gap-2 text-sm text-center ${item.available ? "text-green-500" : "text-gray-500"}`}>
                        <p className={`w-2 h-2 ${item.available ? "bg-green-500" : "bg-gray-500"} rounded-full`}></p> <p>{item.available ? "Available" : "Not Available"}</p>
                    </div>
                    <p className='text-gray-900 text-lg font-medium mt-1'>{item.name}</p>
                    <p className='text-gray-600 text-sm'>{item.speciality}</p>
                </div>
            </motion.div>

        })}
        </div>
        <button onClick={()=>{navi('/doctors');scrollTo(0,0)}} className='bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10 hover:bg-[#d6e2ff] transition-all duration-300 font-medium'>View more</button>
    </motion.div>
  )
}

export default TopDoctors