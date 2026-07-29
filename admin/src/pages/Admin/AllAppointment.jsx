import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets_admin/assets';

const AllAppointment = () => {
  const { appointmentdata,
    aToken,
    appointment,cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotdateFormat } = useContext(AppContext)
  useEffect(() => {
    appointment();
  }, [aToken])
  return (
<div className='w-full max-w-6xl m-5 transition-colors duration-300'>
  <p className='mb-3 text-lg font-medium dark:text-gray-200'>All Appointments</p>

  <div className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll shadow-sm transition-colors'>
    
    {/* Header Row */}
    <div className='hidden sm:grid grid-cols-[0.5fr_2fr_0.8fr_2fr_2fr_1fr_1fr] py-3 px-6 border-b dark:border-gray-700 font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50'>
      <p>#</p>
      <p>Patient</p>
      <p>Age</p>
      <p>Date & Time</p>
      <p>Doctor</p>
      <p>Fees</p>
      <p>Actions</p>
    </div>

    {/* Data Rows */}
    {appointmentdata.map((item, idx) => (
      <div
        key={idx}
        className='grid sm:grid-cols-[0.5fr_2fr_0.8fr_2fr_2fr_1fr_1fr] items-center py-3 px-6 border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-sm transition-colors'
      >
        <p className="dark:text-gray-400">{idx + 1}</p>

        <div className='flex items-center gap-2'>
          <img className='w-8 h-8 rounded-full object-cover dark:border-gray-600 border shadow-sm' src={item.userData.image} alt='' />
          <p className="dark:text-gray-200">{item.userData.name}</p>
        </div>

        <p>{calculateAge(item.userData.dob)}</p>

        <p className="dark:text-gray-400">{slotdateFormat(item.slotDate)}, {item.slotTime}</p>

        <div className='flex items-center gap-2'>
          <img className='w-8 h-8 rounded-full object-cover bg-gray-100 dark:bg-gray-700 dark:border-gray-600 border shadow-sm' src={item.docData.image} alt='' />
          <p className="dark:text-gray-200">{item.docData.name}</p>
        </div>

        <p className='font-medium text-gray-800 dark:text-gray-100'>${item.amount}</p>

        {item.cancelled ? (
          <p className='text-red-500 text-xs font-semibold'>Cancelled</p>
        ) : item.iscompleted ?<p className='text-green-500 font-semibold '>Completed</p>:(
          <img
            onClick={() => cancelAppointment(item._id)}
            className='w-6 h-6 cursor-pointer hover:scale-110 transition-all dark:invert dark:opacity-80'
            src={assets.cancel_icon}
            alt='cancel'
          />
        )}
      </div>
    ))}
  </div>
</div>

  )
}

export default AllAppointment