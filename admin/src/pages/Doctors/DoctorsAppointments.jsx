import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets_admin/assets";

const DoctorsAppointments = () => {
  const { dToken, appointment, docappointments,calculateAge,completeAppointment,cancelAppointment } = useContext(DoctorContext);
    const {slotdateFormat} =useContext(AppContext)
  useEffect(() => {
    if (dToken) docappointments();
  }, [dToken]);

  return (
   <div className="w-full max-w-6xl m-5 transition-colors duration-300">
    <p className="mb-5 text-lg font-medium dark:text-gray-200">All Appointments</p>
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll shadow-sm transition-colors">
         <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50">
            <p>#</p>
            <p>Patient</p>
            <p>Payment</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Fees</p>
            <p>Action</p>
         </div>

         {
            appointment.map((item,idx)=>{
                return <div className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 dark:text-gray-400 py-3 px-6 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" key={idx}>
                    <p className="max-sm:hidden dark:text-gray-400">{idx+1}</p>
                    <div className="flex items-center gap-2 ">
                        <img className="w-8 rounded-full border dark:border-gray-600" src={item.userData.image} alt="" /><p className="dark:text-gray-200">{item.userData.name}</p>
                    </div>
                    <div>
                        <p className="text-xs inline border border-[#5f6fff] dark:border-blue-500 text-[#5f6fff] dark:text-blue-400 px-2 rounded-full ">{item.payment?"Online":"Cash"}</p>
                    </div>
                    <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
                    <p>{slotdateFormat(item.slotDate)},  {item.slotTime}</p>
                    <p className="dark:text-gray-200 font-medium">${item.amount}</p>

                    {item.cancelled ?
                    <p className="text-red-500 text-xs font-medium">Cancelled</p>:
                    item.isCompleted?
                <p className="text-green-500 text-xs px-2 py-2 font-medium">Completed</p>:<div className="flex">
                        <img onClick={()=>cancelAppointment(item._id)} className="w-10 cursor-pointer dark:invert dark:opacity-80 hover:scale-110 transition-transform" src={assets.cancel_icon} alt="" />
                        <img onClick={()=>completeAppointment(item._id)} className="w-10 cursor-pointer dark:invert dark:opacity-80 hover:scale-110 transition-transform" src={assets.tick_icon} alt="" />
                    </div>}
                   
                    
                </div>
            })
         }
    </div>
   </div>
  );
};

export default DoctorsAppointments;
