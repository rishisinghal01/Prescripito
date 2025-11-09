import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
             {/* ----Left Section ------ */ }
             <div >
              <img className='mb-5 w-40' src={assets.logo} alt="" />
              <p className='w-full md:w-2/3 text-gray-600 leading-6 '>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum exercitationem hic tenetur. Inventore, tempore sit fugit veritatis alias aliquid est odio, maxime veniam harum obcaecati voluptas repudiandae, laborum eum voluptatum.</p>
             </div>
              {/* ----Center Section ------ */ }
             <div >
                <p className='text-xl uppercase font-medium mb-5 '>Company</p>

                <ul className='flex flex-col gap-2 text-gray-600 '>
                    <li>Home </li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>
             </div>
              {/* ----Right Section ------ */ }
             <div>
                <p className='text-xl uppercase font-medium mb-5 '>Get In Touch</p>

                <ul className='flex flex-col gap-2 text-gray-600 '>
                    <li>+1-212-456-7896</li>
                    <li>rishi@gmail.com</li>
                </ul>
             </div>
        </div>

        {/*. -------Copyright Text --------   */}
        <div >
           <hr />
           <p className='py-5 text-sm text-center'>Copyright 2025@ Prescripto - All Right Reserved</p>
        </div>
    </div>
  )
}

export default Footer