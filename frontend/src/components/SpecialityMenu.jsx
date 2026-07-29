import React from 'react'
import { specialityData } from '../assets/assets_frontend/assets'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const SpecialityMenu = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='flex flex-col items-center gap-4 py-16 text-gray-800 ' id="speciality" >
            <h1 className='text-3xl font-medium'>Find by Speciality</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free </p>
            <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll  '>
               {specialityData.map((item, idx) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            key={idx}
        >
        <Link
        onClick={()=>{scrollTo(0,0)}}
            className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500'
            to={`/doctors/${item.speciality}`}
        >
            <img className='w-16 sm:w-24 mb-2' src={item.image} alt={item.speciality} />
            <p>{item.speciality}</p>
        </Link>
        </motion.div>
    )
})}

            </div>
        </motion.div>
    )
}

export default SpecialityMenu