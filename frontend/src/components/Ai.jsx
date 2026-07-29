import React, { useState, useEffect, useContext } from 'react'
import Sidebar from './Sidebar'
import { Routes, Route, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Chatbox from './Chatbox'
import Credit from '../pages/Credit'
import Community from '../pages/Community'
import { chatassets } from '../assets/gpt-assets/chatasset'
import '../assets/gpt-assets/prism.css'
import Loading from '../pages/Loading'
import { AppContext } from '../context/Appcontext'
import { ChatContext } from '../context/Chatcontext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Ai = () => {
  const [isMenuopen, setisMenuopen] = useState(false)
  const {pathname}= useLocation()
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { backendurl, token, loadUserData } = useContext(AppContext);
  const { fetchuser } = useContext(ChatContext);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId && token) {
      const verifyPayment = async () => {
        try {
          const { data } = await axios.post(`${backendurl}/api/credit/verify-stripe`, { session_id: sessionId }, { headers: { token } });
          if (data.success) {
            toast.success(data.message);
            loadUserData(); // Updates AppContext
            if (fetchuser) fetchuser(); // Updates ChatContext
          } else {
            toast.error(data.message);
          }
          // Remove session_id from URL
          searchParams.delete('session_id');
          setSearchParams(searchParams);
        } catch (error) {
          console.error(error);
          toast.error("Error verifying payment");
        }
      };
      verifyPayment();
    }
  }, [searchParams, token, backendurl, loadUserData, fetchuser, setSearchParams]);

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
      <div className="flex w-full h-[calc(100vh-80px)] print:h-auto bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-[#0f172a] dark:to-indigo-950 bg-animated-mesh transition-colors duration-300 overflow-hidden print:overflow-visible relative">
        <Sidebar isMenuopen={isMenuopen} setisMenuopen={setisMenuopen} />
        <div className="flex-1 overflow-hidden print:overflow-visible">
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
