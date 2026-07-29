import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/Appcontext';

const Navbar = () => {
    const navigate=useNavigate();
    const [showMenu, setshowMenu] = useState(false);
    const {token, settoken, userData, theme, setTheme}=useContext(AppContext)
    
    const logout=()=>{
        settoken(false)
        localStorage.removeItem("token")
    }

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 dark:border-b-gray-600 transition-colors'>
        <img onClick={()=>{navigate('/')}} className='w-44 cursor-pointer ' src={assets.logo} alt="" style={{ filter: theme === 'dark' ? 'invert(1) hue-rotate(180deg)' : 'none' }} />
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to="/">
                <li className='py-1 dark:text-gray-200'>HOME</li>
            <hr  className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to="/doctors">
                <li className='py-1 dark:text-gray-200'>ALL DOCTOR</li>
            <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to="/about">
                <li className='py-1 dark:text-gray-200'>ABOUT</li>
            <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to="/contact">
                <li className='py-1 dark:text-gray-200'>CONTACT</li>
            <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden' />
            </NavLink>
        </ul>
        <div className='flex items-center gap-4'>
            <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
                aria-label="Toggle Dark Mode"
            >
                {theme === 'light' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                )}
            </button>

            {
                token?
                <div className='flex items-center gap-2 cursor-pointer group relative'>
                    <img className='w-8 rounded-full' src={userData?.image || assets.upload_area} alt="" />
                    <img className='w-2.5 dark:invert' src={assets.dropdown_icon} alt="" />
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 dark:text-gray-200 z-20 hidden group-hover:block '>
                       <div className='min-w-48 bg-stone-100 dark:bg-gray-800 border dark:border-gray-700 rounded flex flex-col gap-4 p-4 shadow-lg'>
                         <p onClick={()=>{
                            navigate('/my-profile')
                         }} className='hover:text-black dark:hover:text-white cursor-pointer transition-colors'>My Profile</p>
                        <p onClick={()=>navigate('/my-appointments')} className='hover:text-black dark:hover:text-white cursor-pointer transition-colors'>My Appointments</p>
                        <p onClick={(
                            logout
                         )} className='hover:text-black dark:hover:text-white cursor-pointer transition-colors'>Logout</p>
                       </div>
                    </div>
                </div>
                :
            <button onClick={()=>{navigate('/login')}}  className='bg-[#5f6FFF] text-white px-8 py-3 rounded-full font-light hidden md:block hover:bg-blue-600 transition-colors shadow-md'>Create Account</button>}

            <img onClick={()=>setshowMenu(true)} className='w-6 md:hidden dark:invert' src={assets.menu_icon} alt="" />
            <div className={`${showMenu?"fixed w-full":"h-0 w-0"} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white dark:bg-gray-900 transition-all`}>
                <div className='flex items-center justify-between px-5 py-6 border-b dark:border-gray-700'>
                    <img className='w-36' src={assets.logo} alt="" style={{ filter: theme === 'dark' ? 'invert(1) hue-rotate(180deg)' : 'none' }} />
                    <img className='w-7 dark:invert cursor-pointer' src={assets.cross_icon} onClick={()=>{setshowMenu(false)}} alt="" />
                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium text-gray-800 dark:text-gray-200'>
                    <NavLink onClick={()=>setshowMenu(false)} to="/"><p className='px-4 py-2 rounded inline-block w-full text-center hover:bg-gray-100 dark:hover:bg-gray-800'>Home</p></NavLink>
                    <NavLink onClick={()=>setshowMenu(false)} to="/doctors"><p className='px-4 py-2 rounded inline-block w-full text-center hover:bg-gray-100 dark:hover:bg-gray-800'>ALL DOCTORS</p></NavLink>
                    <NavLink onClick={()=>setshowMenu(false)} to="/about"><p className='px-4 py-2 rounded inline-block w-full text-center hover:bg-gray-100 dark:hover:bg-gray-800'>ABOUT</p></NavLink>
                    <NavLink onClick={()=>setshowMenu(false)} to="/contact"><p className='px-4 py-2 rounded inline-block w-full text-center hover:bg-gray-100 dark:hover:bg-gray-800'>CONTACT</p></NavLink>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Navbar