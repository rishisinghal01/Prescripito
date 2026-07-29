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
    <div className={`flex my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* --- AI Message --- */}
      {!isUser && (
        <div className='flex items-start max-w-[80%]'>
          <img
            src={chatassets.ai_icon}
            alt='AI'
            className='w-9 h-9 rounded-full mr-3 shadow-sm border border-[#5f6fff]/30 dark:border-[#5f6fff]/50 bg-white dark:bg-gray-800'
          />
          <div className='bg-white dark:bg-gray-800 border border-[#5f6fff]/20 dark:border-[#5f6fff]/40 shadow-sm px-4 py-2 rounded-2xl rounded-tl-none text-gray-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed transition-colors'>
            {message.isImage ? (
              <img
                src={message.content}
                alt='' 
                className='w-full max-w-xs rounded-md mt-1'
              />
            ) : (
              <Markdown>{message.content}</Markdown>
            )}
            <p className='text-[10px] text-gray-400 dark:text-gray-500 mt-1 text-right'>
              {moment(message.timestamp).fromNow()}
            </p>
          </div>
        </div>
      )}

      {/* --- User Message --- */}
      {isUser && (
        <div className='flex items-start max-w-[80%]'>
          <div className='bg-gradient-to-br from-[#5f6fff] to-[#4052d6] dark:from-[#2e3a8c] dark:to-[#1e265c] text-white px-4 py-2 rounded-2xl rounded-tr-none shadow-md text-sm sm:text-base leading-relaxed transition-colors'>
            {message.isImage ? (
              <img
                src={message.content}
                alt='User Upload' 
                className='w-full max-w-xs rounded-md mt-1'
              />
            ) : (
              message.content
            )}
            <p className='text-[10px] text-gray-200 dark:text-gray-300 mt-1 text-right'>
              {moment(message.timestamp).fromNow()}
            </p>
          </div>
          <img
            src={chatassets.user_icon}
            alt='User'
            className='w-9 h-9 rounded-full ml-3 shadow-sm border border-[#5f6fff]/30 dark:border-[#5f6fff]/50 bg-white dark:bg-gray-800'
          />
        </div>
      )}
    </div>
  )
}

export default Message
