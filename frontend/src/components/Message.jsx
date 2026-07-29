import React, { useEffect } from 'react'
import { chatassets } from '../assets/gpt-assets/chatasset'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'
const Message = ({ message }) => {
  const isUser = message.role === 'user'
useEffect(()=>{
Prism.highlightAll()
},[message.content])
  return (
    <div className={`flex my-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
      {/* --- AI Message --- */}
      {!isUser && (
        <div className='flex items-start max-w-[85%]'>
          <img
            src={chatassets.logo}
            alt='AI'
            className='w-10 h-10 rounded-full mr-3 shadow-md border-2 border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800'
          />
          <div className='bg-white/70 dark:bg-[#1a233a]/70 backdrop-blur-md border border-white/50 dark:border-indigo-500/20 shadow-[0_4px_20px_rgb(0,0,0,0.05)] px-5 py-3.5 rounded-2xl rounded-tl-sm text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed transition-colors'>
            {message.isImage ? (
              <img
                src={message.content}
                alt='' 
                className='w-full max-w-sm rounded-lg mt-1 shadow-sm'
              />
            ) : (
              <Markdown>{message.content}</Markdown>
            )}
            <p className='text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-right font-medium tracking-wide'>
              {moment(message.timestamp).fromNow()}
            </p>
          </div>
        </div>
      )}

      {/* --- User Message --- */}
      {isUser && (
        <div className='flex items-start max-w-[85%]'>
          <div className='bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-[0_8px_20px_rgba(99,102,241,0.25)] text-[15px] leading-relaxed transition-colors'>
            {message.isImage ? (
              <img
                src={message.content}
                alt='User Upload' 
                className='w-full max-w-sm rounded-lg mt-1 shadow-md border border-white/20'
              />
            ) : (
              message.content
            )}
            <p className='text-[10px] text-indigo-100 dark:text-indigo-200 mt-2 text-right font-medium tracking-wide opacity-80'>
              {moment(message.timestamp).fromNow()}
            </p>
          </div>
          <img
            src={chatassets.user_icon}
            alt='User'
            className='w-10 h-10 rounded-full ml-3 shadow-md border-2 border-purple-200 dark:border-purple-900 bg-white dark:bg-gray-800'
          />
        </div>
      )}
    </div>
  )
}

export default Message
