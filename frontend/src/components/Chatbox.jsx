import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChatContext } from '../context/Chatcontext';
import { assets } from '../assets/assets_frontend/assets';
import Message from './Message';
import { chatassets } from '../assets/gpt-assets/chatasset';
import { toast } from 'react-toastify';

const Chatbox = () => {
  const containerRef = useRef(null);
  const { selectedChat, user, axios, token, setuser, setselectedChat } =
    useContext(ChatContext);
  const [loading, setloading] = useState(false);
  const [prompt, setprompt] = useState('');
  const [mode, setmode] = useState('text');
  const [isPublished, setisPublished] = useState(false);

  const onSubmit = async e => {
    try {
      e.preventDefault();
      if (!prompt.trim()) return;
      if (!user) return toast('Login to send message');

      setloading(true);

      // User message added instantly
      const userMsg = {
        role: 'user',
        content: prompt,
        timestamp: Date.now(),
        isImage: false
      };

      setselectedChat(prev => ({
        ...prev,
        messages: [...prev.messages, userMsg]
      }));

      const promptBackup = prompt;
      setprompt('');

      let res;
      if (mode === 'image') {
        res = await axios.post(
          '/api/message/image',
          { chatId: selectedChat._id, prompt: promptBackup, isPublished },
          { headers: { token } }
        );
      } else {
        res = await axios.post(
          '/api/message/text',
          { chatId: selectedChat._id, prompt: promptBackup, isPublished },
          { headers: { token } }
        );
      }

      const data = res.data;

      if (!data.success) {
        toast.error(data.message);
        setprompt(promptBackup);
        return;
      }

      const aiMsg = data.reply;

      // AI message added instantly
      setselectedChat(prev => ({
        ...prev,
        messages: [...prev.messages, aiMsg]
      }));

      // Deduct credits
      setuser(prev => ({
        ...prev,
        credits: prev.credits - (mode === 'image' ? 2 : 1)
      }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [selectedChat?.messages]);

  return (
    <div className="flex-1 flex flex-col justify-between px-5 md:px-10 lg:px-20 xl:px-28 h-[calc(100vh-80px)] overflow-hidden bg-white">
      <div ref={containerRef} className="flex-1 overflow-y-auto mb-2 pr-2 scrollbar-hide">
        {!selectedChat?.messages?.length && (
          <div className="flex flex-col items-center justify-center h-full">
            <img src={assets.logo} alt="" className="w-full max-w-56 sm:max-w-68" />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400">
              Ask me anything
            </p>
          </div>
        )}

        {(selectedChat?.messages || []).map((msg, idx) => (
          <Message key={idx} message={msg} />
        ))}

        {loading && (
          <div className="flex justify-start items-center mt-3 ml-10 gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
          </div>
        )}
      </div>

      {mode === 'image' && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">Publish Generated Image to community</p>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={e => setisPublished(e.target.checked)}
          />
        </label>
      )}

      <form
        onSubmit={onSubmit}
        className="bg-[#5f6fff]/20 border border-[#5f6fff] rounded-full w-full max-w-2xl p-2 pl-4 mx-auto mb-6 flex gap-3 items-center shadow-md">
        <select
          value={mode}
          onChange={e => setmode(e.target.value)}
          className="text-sm bg-transparent text-gray-700 outline-none cursor-pointer">
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>

        <input
          value={prompt}
          onChange={e => setprompt(e.target.value)}
          type="text"
          placeholder="Type your prompt..."
          className="flex-1 text-sm bg-transparent outline-none"
          required
        />

        <button disabled={loading}>
          <img
            src={loading ? chatassets.stop_icon : chatassets.send_icon}
            className="w-7 sm:w-8"
            alt="send"
          />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
