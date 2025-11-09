import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify';

const DoctorList = () => {
    const {aToken,getAllDoctors,doctors,changeAvailability}=useContext(AdminContext);
    useEffect(()=>{

        if(aToken){
            getAllDoctors();
        }
    },[]) 
  
  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll '>
        <h1 className='text-lg font-medium'>All Doctors</h1>
        <div className='flex flex-wrap gap-4 pt-5 gap-y-6'>
            {
                doctors.map((item,idx)=>{
                return <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group '  key={idx}>

                    <img className='bg-indigo-50 group-hover:bg-[#5f6fff] transition-all duration-500' src={item.image} alt="" />
                    <div className='p-4'>
                        <p className='text-neutral-800 text-lg font-medium '>{item.name}</p>
                        <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                        <div className='flex mt-2 items-center gap-1 text-sm '>
                            <input onChange={()=>{changeAvailability(item._id)}} type="checkbox"  checked={item.available}/>
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