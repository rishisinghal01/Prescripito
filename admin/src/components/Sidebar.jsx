import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets_admin/assets'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {
    const { aToken, setaToken } = useContext(AdminContext)
    const {dToken}= useContext(DoctorContext);
    return (
        <div className='min-h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-colors duration-300'>
            {aToken  && (
                <ul className='text-[#515151] dark:text-gray-300 mt-5'>
                    <li>
                        <NavLink
                            className={({ isActive }) =>
                                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-colors ${isActive ? "bg-[#f2f3ff] dark:bg-[#5f6fff]/10 dark:text-[#5f6fff] border-r-4 border-[#5f6fff]" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`
                            }
                            to="/admin-dashboard"
                        >
                            <img src={assets.home_icon} alt="" className="dark:invert dark:opacity-80" />
                            <p>Dashboard</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/all-appointments"  className={({ isActive }) =>
                                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-colors ${isActive ? "bg-[#f2f3ff] dark:bg-[#5f6fff]/10 dark:text-[#5f6fff] border-r-4 border-[#5f6fff]" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`
                            }>
                            <img src={assets.appointment_icon} alt="" className="dark:invert dark:opacity-80" />
                            <p>Appointments</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/add-doctor"  className={({ isActive }) =>
                                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-colors ${isActive ? "bg-[#f2f3ff] dark:bg-[#5f6fff]/10 dark:text-[#5f6fff] border-r-4 border-[#5f6fff]" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`
                            }>
                            <img src={assets.add_icon} alt="" className="dark:invert dark:opacity-80" />
                            <p>Add Doctor</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/doctor-list"  className={({ isActive }) =>
                                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-colors ${isActive ? "bg-[#f2f3ff] dark:bg-[#5f6fff]/10 dark:text-[#5f6fff] border-r-4 border-[#5f6fff]" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`
                            }>
                            <img src={assets.people_icon} alt="" className="dark:invert dark:opacity-80" />
                            <p>Doctor List</p>
                        </NavLink>
                    </li>
                </ul>
            )}
             {dToken  && (
                <ul className='text-[#515151] dark:text-gray-300 mt-5'>
                    <li>
                        <NavLink
                            className={({ isActive }) =>
                                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-colors ${isActive ? "bg-[#f2f3ff] dark:bg-[#5f6fff]/10 dark:text-[#5f6fff] border-r-4 border-[#5f6fff]" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`
                            }
                            to="/doctor-dashboard"
                        >
                            <img src={assets.home_icon} alt="" className="dark:invert dark:opacity-80" />
                            <p className='hidden md:block'>Dashboard</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/doctor-appointments"  className={({ isActive }) =>
                                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-colors ${isActive ? "bg-[#f2f3ff] dark:bg-[#5f6fff]/10 dark:text-[#5f6fff] border-r-4 border-[#5f6fff]" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`
                            }>
                            <img src={assets.appointment_icon} alt="" className="dark:invert dark:opacity-80" />
                            <p className='hidden md:block'>Appointments</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/doctor-profile"  className={({ isActive }) =>
                                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-colors ${isActive ? "bg-[#f2f3ff] dark:bg-[#5f6fff]/10 dark:text-[#5f6fff] border-r-4 border-[#5f6fff]" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`
                            }>
                            <img src={assets.people_icon} alt="" className="dark:invert dark:opacity-80" />
                            <p className='hidden md:block'>Profile</p>
                        </NavLink>
                    </li>
                    
                </ul>
            )}
        </div>
    )
}

export default Sidebar
