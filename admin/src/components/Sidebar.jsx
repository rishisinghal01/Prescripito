import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets_admin/assets'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {
    const { aToken, setaToken } = useContext(AdminContext)
    const {dToken}= useContext(DoctorContext);
    return (
        <div className='min-h-screen bg-white border-r  border-gray-100'>
            {aToken  && (
                <ul className='text-[#515151] mt-5'>
                    <li>
                        <NavLink
                            className={({ isActive }) =>
                                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#f2f3ff] border-r-4 border-[#5f6fff]" : ""}`
                            }
                            to="/admin-dashboard"
                        >
                            <img src={assets.home_icon} alt="" />
                            <p>Dashboard</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/all-appointments"  className={({ isActive }) =>
                                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#f2f3ff] border-r-4 border-[#5f6fff]" : ""}`
                            }>
                            <img src={assets.appointment_icon} alt="" />
                            <p>Appointments</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/add-doctor"  className={({ isActive }) =>
                                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#f2f3ff] border-r-4 border-[#5f6fff]" : ""}`
                            }>
                            <img src={assets.add_icon} alt="" />
                            <p>Add Doctor</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/doctor-list"  className={({ isActive }) =>
                                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#f2f3ff] border-r-4 border-[#5f6fff]" : ""}`
                            }>
                            <img src={assets.people_icon} alt="" />
                            <p>Doctor List</p>
                        </NavLink>
                    </li>
                </ul>
            )}
             {dToken  && (
                <ul className='text-[#515151] mt-5'>
                    <li>
                        <NavLink
                            className={({ isActive }) =>
                                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#f2f3ff] border-r-4 border-[#5f6fff]" : ""}`
                            }
                            to="/doctor-dashboard"
                        >
                            <img src={assets.home_icon} alt="" />
                            <p className='hidden md:block'>Dashboard</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/doctor-appointments"  className={({ isActive }) =>
                                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#f2f3ff] border-r-4 border-[#5f6fff]" : ""}`
                            }>
                            <img src={assets.appointment_icon} alt="" />
                            <p className='hidden md:block'>Appointments</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/doctor-profile"  className={({ isActive }) =>
                                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#f2f3ff] border-r-4 border-[#5f6fff]" : ""}`
                            }>
                            <img src={assets.people_icon} alt="" />
                            <p className='hidden md:block'>Profile</p>
                        </NavLink>
                    </li>
                    
                </ul>
            )}
        </div>
    )
}

export default Sidebar
