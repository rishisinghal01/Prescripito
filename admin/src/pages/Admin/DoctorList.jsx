import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify';

const DoctorList = () => {
    const {aToken,getAllDoctors,doctors,changeAvailability}=useContext(AdminContext);
    useEffect(()=>{
        if(aToken){
            getAllDoctors();
            // Poll every 5 seconds for real-time updates
            const intervalId = setInterval(() => {
                getAllDoctors();
            }, 5000);
            return () => clearInterval(intervalId);
        }
    },[aToken])  
  
  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll transition-colors duration-300'>
        <h1 className='text-lg font-medium dark:text-gray-200'>All Doctors</h1>
        <div className='flex flex-wrap gap-4 pt-5 gap-y-6'>
            {
                doctors.map((item,idx)=>{
                return <div className='border border-indigo-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl max-w-56 overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg dark:shadow-md transition-all duration-300 '  key={idx}>

                    <img className='bg-indigo-50 dark:bg-gray-900/50 group-hover:bg-[#5f6fff] dark:group-hover:bg-blue-600 transition-all duration-500 object-cover' src={item.image} alt="" />
                    <div className='p-4'>
                        <p className='text-neutral-800 dark:text-gray-100 text-lg font-medium '>{item.name}</p>
                        <p className='text-zinc-600 dark:text-gray-400 text-sm'>{item.speciality}</p>
                        <div className='flex mt-2 items-center gap-1 text-sm dark:text-gray-300'>
                            <input className="dark:accent-blue-500" onChange={()=>{changeAvailability(item._id)}} type="checkbox"  checked={item.available}/>
                            <p>Available</p>
                        </div>
                    </div>
                </div>
                })
            }
        </div>
    </div>
  )
}

export default DoctorList