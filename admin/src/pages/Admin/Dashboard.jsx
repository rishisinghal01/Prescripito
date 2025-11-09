import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets_admin/assets";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { cancelAppointment, dashdata, getDashboardData, aToken } =
    useContext(AdminContext);
    const {slotdateFormat} = useContext(AppContext)

  useEffect(() => {
    if (aToken) getDashboardData();
  }, [aToken]);

  if (!dashdata)
    return (
      <div className="text-center text-gray-500 py-10 text-lg">
        Loading dashboard...
      </div>
    );

  return dashdata && (
    <div className="m-5">
      {/* --- Top Stats Cards --- */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-gray-200 cursor-pointer hover:scale-105 transition-all duration-500">
          <img className="w-14" src={assets.doctor_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-700">
              {dashdata.doctors}
            </p>
            <p className="text-gray-400">Doctors</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-gray-200 cursor-pointer hover:scale-105 transition-all duration-500">
          <img className="w-14" src={assets.appointments_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-700">
              {dashdata.appointments}
            </p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-gray-200 cursor-pointer hover:scale-105 transition-all duration-500">
          <img className="w-14" src={assets.patients_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-700">
              {dashdata.patients}
            </p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      {/* --- Latest Bookings --- */}
      <div className="bg-white rounded-lg shadow mt-10">
        <div className="flex items-center gap-2.5 px-5 py-4 rounded-t border-b border-gray-200 bg-gray-50">
          <img className="w-5" src={assets.list_icon} alt="" />
          <p className="font-medium text-gray-700">Latest Bookings</p>
        </div>

        <div>
          {dashdata?.latestAppointments?.length > 0 ? (
            dashdata.latestAppointments.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center px-5 py-4 hover:bg-gray-50 transition-all"
              >
                {/* Doctor Info */}
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover border"
                    src={item.docData.image}
                    alt=""
                  />
                  <div>
                    <p className="text-gray-800 font-medium">
                      {item.docData.name}
                    </p>
                    <p className="text-xs text-gray-500">{slotdateFormat(item.slotDate)}</p>
                  </div>
                </div>

                {/* Status / Cancel Button */}
                <div className="flex items-center gap-3">
                  
                          {item.cancelled ? (
                            <p className='text-red-500 text-xs font-semibold'>Cancelled</p>
                          ) : item.iscompleted ?<p className='text-green-500 font-semibold '>Completed</p>:(
                            <img
                              onClick={() => cancelAppointment(item._id)}
                              className='w-6 h-6 cursor-pointer hover:scale-110 transition-all'
                              src={assets.cancel_icon}
                              alt='cancel'
                            />
                          )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-5">
              No recent appointments found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
