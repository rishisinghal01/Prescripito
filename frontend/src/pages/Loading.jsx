import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loading = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/ai/chatbot')
    }, 8000)
    return () => clearTimeout(timeout)
  }, [navigate])

  return (
    <div
      className="
        fixed top-0 left-0 w-full h-full
        bg-gradient-to-b from-[#531B81] to-[#291848]
        flex items-center justify-center
        z-[9999] text-white text-2xl
      "
    >
      <div
        className="
          w-12 h-12 
          border-4 border-white border-t-transparent
          rounded-full animate-spin
        "
      ></div>
    </div>
  )
}

export default Loading
