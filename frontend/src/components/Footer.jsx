import React, { useContext } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { AppContext } from '../context/Appcontext';

const Footer = () => {
  const { theme } = useContext(AppContext);
  return (
    <div className='md:mx-10 transition-colors duration-300'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
             {/* ----Left Section ------ */ }
             <div >
              <img className='mb-5 w-40' src={assets.logo} alt="" style={{ filter: theme === 'dark' ? 'invert(1) hue-rotate(180deg)' : 'none' }} />
              <p className='w-full md:w-2/3 text-gray-600 dark:text-gray-400 leading-6 '>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum exercitationem hic tenetur. Inventore, tempore sit fugit veritatis alias aliquid est odio, maxime veniam harum obcaecati voluptas repudiandae, laborum eum voluptatum.</p>
             </div>
              {/* ----Center Section ------ */ }
             <div >
                <p className='text-xl uppercase font-medium mb-5 dark:text-gray-200'>Company</p>

                <ul className='flex flex-col gap-2 text-gray-600 dark:text-gray-400'>
                    <li className="hover:text-blue-500 cursor-pointer">Home </li>
                    <li className="hover:text-blue-500 cursor-pointer">About Us</li>
                    <li className="hover:text-blue-500 cursor-pointer">Contact Us</li>
                    <li className="hover:text-blue-500 cursor-pointer">Privacy Policy</li>
                </ul>
             </div>
              {/* ----Right Section ------ */ }
             <div>
                <p className='text-xl uppercase font-medium mb-5 dark:text-gray-200'>Get In Touch</p>

                <ul className='flex flex-col gap-2 text-gray-600 dark:text-gray-400'>
                    <li>+1-212-456-7896</li>
                    <li>rishi@gmail.com</li>
                </ul>
             </div>
        </div>

        {/*. -------Copyright Text --------   */}
        <div >
           <hr className="dark:border-gray-700" />
           <p className='py-5 text-sm text-center dark:text-gray-400'>Copyright 2025@ Prescripto - All Right Reserved</p>
        </div>
    </div>
  )
}

export default Footer