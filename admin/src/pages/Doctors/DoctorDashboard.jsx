import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets_admin/assets';
import { AppContext } from '../../context/AppContext';

const DoctorDashboard = () => {
  const { dToken, doctordash, doctordashdata ,cancelAppointment,completeAppointment,} = useContext(DoctorContext);
const {slotdateFormat}= useContext(AppContext)
  useEffect(() => {
    if (dToken) doctordashdata();
  }, [dToken]);

  if (!doctordash) return <p>Loading dashboard...</p>;

   return doctordash && (
      <div className="m-5 transition-colors duration-300">
        {/* --- Top Stats Cards --- */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-4 min-w-52 rounded border border-gray-200 dark:border-gray-700 cursor-pointer hover:scale-105 transition-all duration-500 shadow-sm dark:shadow-md">
            <img className="w-14 dark:invert opacity-80" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-100">
                ${doctordash.earning}
              </p>
              <p className="text-gray-400 dark:text-gray-400">Total Earning</p>
            </div>
          </div>
  
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-4 min-w-52 rounded border border-gray-200 dark:border-gray-700 cursor-pointer hover:scale-105 transition-all duration-500 shadow-sm dark:shadow-md">
            <img className="w-14 dark:invert opacity-80" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-100">
                {doctordash.appointments}
              </p>
              <p className="text-gray-400 dark:text-gray-400">Appointments</p>
            </div>
          </div>
  
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-4 min-w-52 rounded border border-gray-200 dark:border-gray-700 cursor-pointer hover:scale-105 transition-all duration-500 shadow-sm dark:shadow-md">
            <img className="w-14 dark:invert opacity-80" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-100">
                {doctordash.patients}
              </p>
              <p className="text-gray-400 dark:text-gray-400">Patients</p>
            </div>
          </div>
        </div>
  
        {/* --- Latest Bookings --- */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mt-10 transition-colors">
          <div className="flex items-center gap-2.5 px-5 py-4 rounded-t border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <img className="w-5 dark:invert opacity-80" src={assets.list_icon} alt="" />
            <p className="font-medium text-gray-700 dark:text-gray-200">Latest Bookings</p>
          </div>
  
          <div>
            {doctordash?.latestAppointments?.length > 0 ? (
              doctordash.latestAppointments.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all border-b border-gray-50 dark:border-gray-700/30 last:border-0"
                >
                  {/* Doctor Info */}
                  <div className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full object-cover border dark:border-gray-600 shadow-sm"
                      src={item.userData.image}
                      alt=""
                    />
                    <div>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {item.userData.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{slotdateFormat(item.slotDate)}</p>
                    </div>
                  </div>
  
                  {/* Status / Cancel Button */}
                  <div className="flex items-center gap-3">
                 {item.cancelled ?
                                     <p className="text-red-500 text-xs font-medium">Cancelled</p>:
                                     item.isCompleted?
                                 <p className="text-green-500 text-xs px-2 py-2 font-medium">Completed</p>:<div className="flex">
                                         <img onClick={()=>cancelAppointment(item._id)} className="w-10 cursor-pointer dark:invert dark:opacity-80 hover:scale-110 transition-transform" src={assets.cancel_icon} alt="" />
                                         <img onClick={()=>completeAppointment(item._id)} className="w-10 cursor-pointer dark:invert dark:opacity-80 hover:scale-110 transition-transform" src={assets.tick_icon} alt="" />
                                     </div>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 dark:text-gray-500 py-5">
                No recent appointments found.
              </p>
            )}
          </div>
        </div>
      </div>
    );
};

export default DoctorDashboard;
