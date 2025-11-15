import React, { useContext, useState } from 'react'
import { ChatContext } from '../context/Chatcontext'
import { chatassets } from '../assets/gpt-assets/chatasset'
import moment from 'moment'
import { useLocation } from 'react-router-dom'
import { AppContext } from '../context/Appcontext'
import { toast } from 'react-toastify'

const Sidebar = ({ setisMenuopen, isMenuopen }) => {
  const { chats, user, setselectedChat, selectedChat, navigate, createNewChat, axios, setchats, fetchuserChat, settoken, token } = useContext(ChatContext)
  const [search, setsearch] = useState('')
  const location = useLocation()
  const isActiveLink = (path) => location.pathname === path
  const deletechat = async (e, chatId) => {
    try {
      e.stopPropagation();
      const confirm = window.confirm('Are you sure you want to delete this chat?')
      if (!confirm) return
      const { data } = await axios.post('/api/chat/delete', { chatId }, { headers: { token: token } })
      if (data.success) {
        setchats(prev => prev.filter(chat => chat._id !== chatId))
        await fetchuserChat()
        toast.success(data.message)
      }
    }
    catch (err) {
      toast.error(err.message)
    }
  }
  return (
    <div className={`flex flex-col h-screen min-w-72 p-5 border-r border-[#5f6fff]/20 bg-white transition-all duration-500 rounded-r-2xl shadow-[0_0_20px_rgba(95,111,255,0.05)] max-md:absolute left-0 z-10 ${!isMenuopen && "max-sm:-translate-x-full "}`}>

      {/* --- New Chat Button --- */}
      <button  onClick={createNewChat} className='flex justify-center items-center w-full py-2 mt-10 text-white bg-[#5f6fff] hover:bg-[#4b58e0] text-sm rounded-lg cursor-pointer shadow-md transition-all font-medium'>
        <span className='mr-2 text-lg font-bold'>+</span> New Chat
      </button>

      {/* --- Search Bar --- */}
      <div className='flex items-center gap-2 p-3 mt-5 border border-[#5f6fff]/40 rounded-lg bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#5f6fff]/60 transition'>
        <img src={chatassets.search_icon} className='w-4 invert opacity-70' alt='search' />
        <input
          onChange={(e) => setsearch(e.target.value)}
          value={search}
          type='text'
          placeholder='Search conversations'
          className='text-xs placeholder:text-[#5f6fff]/70 outline-none bg-transparent flex-1 text-gray-700'
        />
      </div>

      {/* --- Recent Chats --- */}
      {chats.length > 0 && (
        <p className='mt-6 text-sm text-[#5f6fff] font-semibold uppercase tracking-wide'>
          Recent Chats
        </p>
      )}

      {/* --- Chat List --- */}
      <div className='mt-3 flex flex-col gap-2 overflow-y-auto scrollbar-hide pr-1'>
        {chats
          .filter(chat =>
            chat.messages[0]
              ? chat.messages[0].content.toLowerCase().includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map(chat => {
            const isActive = selectedChat?._id === chat._id
            return (
              <div
                key={chat._id}
                onClick={() => {
                  setselectedChat(chat);
                  navigate('/ai/chatbot');
                  setisMenuopen(false);
                }}
                className={`p-3 px-4 rounded-lg cursor-pointer flex justify-between items-center group transition-all duration-200 ${isActive
                    ? 'bg-[#5f6fff]/10 border border-[#5f6fff]'
                    : 'border border-transparent hover:border-[#5f6fff]/40 hover:bg-[#f3f5ff]'
                  }`}
              >
                <div>
                  <p className='truncate w-44 text-sm font-medium text-gray-800'>
                    {chat.messages.length > 0
                      ? chat.messages[0].content.slice(0, 32)
                      : chat.name}
                  </p>
                  <p className='text-xs text-[#5f6fff]/70'>
                    {moment(chat.updatedAt).fromNow()}
                  </p>
                </div>
                <img
                  onClick={(e) => toast.promise(deletechat(e, chat._id), { loading: "Deleting..." })}
                  src={chatassets.bin_icon}
                  className='hidden group-hover:block w-4 invert opacity-80 hover:opacity-100 transition'
                  alt='delete'
                />

              </div>
            )
          })}
      </div>

      {/* --- Community Link --- */}
      <div
        onClick={() => {
          navigate('/ai/community');
          setisMenuopen(false)
        }}
        className={`flex items-center gap-3 p-3 mt-6 border rounded-md cursor-pointer transition-all duration-200 ${isActiveLink('/ai/community')
            ? 'bg-[#5f6fff]/10 border-[#5f6fff] text-[#5f6fff]'
            : 'border-gray-200 hover:border-[#5f6fff]/40 hover:bg-[#f3f5ff]'
          }`}
      >
        <img
          src={chatassets.gallery_icon}
          className={`w-5 invert opacity-80 transition ${isActiveLink('/ai/community') && 'invert-0'
            }`}

          alt=''
        />
        <p className='text-sm font-medium'>Community Images</p>
      </div>

      {/* --- Credit Section --- */}
      <div
        onClick={() => {
          navigate('/ai/credit');
          setisMenuopen(false);
        }}
        className={`flex items-center gap-3 p-3 mt-4 border rounded-md cursor-pointer transition-all duration-200 ${isActiveLink('/ai/credit')
            ? 'bg-[#5f6fff]/10 border-[#5f6fff] text-[#5f6fff]'
            : 'border-gray-200 hover:border-[#5f6fff]/40 hover:bg-[#f3f5ff]'
          }`}
      >
        <img
          src={chatassets.diamond_icon}
          className='w-5  opacity-80'
          alt=''
        />
        <div className='flex flex-col text-sm'>
          <p className='font-medium'>Credit: {user?.credits ?? 0}</p>
          <p className='text-xs text-gray-400'>
            Purchase credits to use these
          </p>
        </div>
      </div>

      {/* --- User Section --- */}
     {/* --- User Section --- */}
<div className='flex items-center gap-3 p-3 mt-5 border border-gray-200 rounded-md cursor-pointer group hover:border-[#5f6fff]/40 hover:bg-[#f3f5ff] transition-all'>
  <img src={user?.image || chatassets.user_icon} className='w-7 rounded-full' alt='user' />
  <p className='flex-1 text-sm truncate text-gray-800'>
    {user ? user.name : 'Login Your Account'}
  </p>
  {user && (
    <img
      src={chatassets.logout_icon}
      className='h-5 cursor-pointer hidden group-hover:block invert opacity-80 hover:opacity-100 transition'
      alt='logout'
    />
  )}
</div>


      {/* --- Close Icon for Mobile --- */}
      <img onClick={() => setisMenuopen(false)}
        src={chatassets.close_icon}
        className='absolute top-3 right-3 w-5 h-5 cursor-pointer sm:hidden invert opacity-80 hover:opacity-100 transition'
        alt='close'
      />
    </div>
  )
}

export default Sidebar
