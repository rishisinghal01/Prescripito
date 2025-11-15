import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Chatbox from './Chatbox'
import Credit from '../pages/Credit'
import Community from '../pages/Community'
import { chatassets } from '../assets/gpt-assets/chatasset'
import '../assets/gpt-assets/prism.css'
import Loading from '../pages/Loading'
const Ai = () => {
  const [isMenuopen, setisMenuopen] = useState(false)
  const {pathname}= useLocation()
  if(pathname ==='/ai/loading') return <Loading/>
  return (
    <>
      {!isMenuopen && (
        <img
          src={chatassets.menu_icon}
          className="absolute top-3 invert left-3 w-8 h-8 cursor-pointer sm:hidden"
          onClick={() => setisMenuopen(true)}
          alt="menu"
        />
      )}

      {/* ✅ Fixed Layout (no X-scroll) */}
      <div className="flex w-full h-[calc(100vh-80px)] bg-white overflow-hidden">
        <Sidebar isMenuopen={isMenuopen} setisMenuopen={setisMenuopen} />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route index element={<Navigate to="chatbot" replace />} />
            <Route path="chatbot" element={<Chatbox />} />
            <Route path="credit" element={<Credit />} />
            <Route path="community" element={<Community />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default Ai
