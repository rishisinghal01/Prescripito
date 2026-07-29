import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets_admin/assets";
import ChatModal from "../../components/ChatModal";

const DoctorsAppointments = () => {
  const { dToken, appointment, docappointments,calculateAge,completeAppointment,cancelAppointment } = useContext(DoctorContext);
  const {slotdateFormat} =useContext(AppContext)
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentChatInfo, setCurrentChatInfo] = useState({ appointmentId: null, patientName: "" });

  const openChat = (appointmentId, patientName) => {
    setCurrentChatInfo({ appointmentId, patientName });
    setIsChatOpen(true);
  };

  useEffect(() => {
    if (dToken) {
      docappointments();
      // Poll every 5 seconds for real-time updates
      const intervalId = setInterval(() => {
        docappointments();
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [dToken]);

  return (
   <div className="w-full max-w-6xl m-5 transition-colors duration-300 relative">
    <p className="mb-5 text-lg font-medium dark:text-gray-200">All Appointments</p>
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll shadow-sm transition-colors">
         <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1.5fr] gap-1 py-3 px-6 border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50">
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
                return <div className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1.5fr] gap-1 items-center text-gray-500 dark:text-gray-400 py-3 px-6 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" key={idx}>
                    <p className="max-sm:hidden dark:text-gray-400">{idx+1}</p>
                    <div className="flex items-center gap-2 ">
                        <img className="w-8 rounded-full border dark:border-gray-600" src={item.userData.image} alt="" />
                        <p className="dark:text-gray-200">{item.userData.name}</p>
                        
                        {/* Chat Button */}
                        {!item.cancelled && (
                          <button 
                            onClick={() => openChat(item._id, item.userData.name)}
                            className="ml-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:scale-110 transition-all p-1"
                            title="Chat with Patient"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                          </button>
                        )}
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

    {/* Chat Modal */}
    <ChatModal 
      isOpen={isChatOpen} 
      onClose={() => setIsChatOpen(false)} 
      appointmentId={currentChatInfo.appointmentId} 
      patientName={currentChatInfo.patientName} 
    />
   </div>
  );
};

export default DoctorsAppointments;
