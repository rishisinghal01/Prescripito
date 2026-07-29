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
  
  // New state for image analysis
  const [imageFile, setImageFile] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async e => {
    try {
      e.preventDefault();
      
      if (mode === 'text' && !prompt.trim()) return;
      if (mode === 'analyze' && !base64Image) return toast('Please select an image to analyze');
      if (!user) return toast('Login to send message');

      setloading(true);

      let newMessages = [];
      if (mode === 'analyze' && base64Image) {
        newMessages.push({
          role: 'user',
          content: base64Image,
          timestamp: Date.now() - 1,
          isImage: true
        });
      }
      newMessages.push({
        role: 'user',
        content: mode === 'analyze' && prompt.trim() === '' ? 'Analyze this medical image.' : prompt,
        timestamp: Date.now(),
        isImage: false,
      });

      setselectedChat(prev => ({
        ...prev,
        messages: [...(prev.messages || []), ...newMessages]
      }));

      const promptBackup = prompt;
      setprompt('');

      let res;
      if (mode === 'analyze') {
        res = await axios.post(
          '/api/message/analyze',
          { chatId: selectedChat._id, prompt: promptBackup, base64Image },
          { headers: { token } }
        );
        setImageFile(null);
        setBase64Image(null);
      } else {
        res = await axios.post(
          '/api/message/text',
          { chatId: selectedChat._id, prompt: promptBackup },
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
        messages: [...(prev.messages || []), aiMsg]
      }));

      // Deduct credits
      setuser(prev => ({
        ...prev,
        credits: prev.credits - (mode === 'analyze' ? 2 : 1)
      }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setloading(false);
    }
  };

  const handleExportPDF = () => {
    if (!selectedChat?.messages?.length) {
      toast.error("No chat history to export!");
      return;
    }
    // Using native window.print() because html2canvas does not support Tailwind V4 oklch colors.
    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [selectedChat?.messages]);

  return (
    <div className="flex-1 flex flex-col justify-between px-5 md:px-10 lg:px-20 xl:px-28 h-[calc(100vh-80px)] print:h-auto overflow-hidden print:overflow-visible bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-sm transition-colors duration-300">
      
      {/* Top Action Bar */}
      {selectedChat?.messages?.length > 0 && (
        <div className="flex justify-end pt-4 pr-2 print:hidden">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 text-xs font-semibold bg-white/80 dark:bg-gray-800/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 px-3 py-1.5 rounded-full shadow-sm hover:shadow hover:scale-105 transition-all backdrop-blur-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Report
          </button>
        </div>
      )}

      <div ref={containerRef} className="flex-1 overflow-y-auto print:overflow-visible print:h-auto mb-2 pr-2 scrollbar-hide pt-4">
        {!selectedChat?.messages?.length && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in-up print:hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 blur-3xl rounded-full"></div>
              <img src={assets.logo} alt="" className="w-full max-w-56 sm:max-w-68 opacity-80 dark:opacity-40 dark:invert dark:hue-rotate-180 animate-pulse-slow relative z-10 drop-shadow-xl" />
            </div>
            <p className="mt-8 text-4xl sm:text-6xl text-center font-light bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 bg-clip-text text-transparent opacity-90 drop-shadow-sm">
              Ask me anything
            </p>
          </div>
        )}

        <div className="pb-4">
          {selectedChat?.messages?.length > 0 && (
             <div className="hidden print:block text-center mb-6 border-b pb-4">
               <h1 className="text-2xl font-bold text-indigo-600">Prescripito Health Report</h1>
               <p className="text-sm text-gray-500">Generated by AI on {new Date().toLocaleDateString()}</p>
             </div>
          )}
          {(selectedChat?.messages || []).map((msg, idx) => (
            <Message key={idx} message={msg} />
          ))}
        </div>

        {loading && (
          <div className="flex justify-start items-center mt-3 ml-10 gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce" />
          </div>
        )}
      </div>

      {base64Image && mode === 'analyze' && (
        <div className="w-full max-w-2xl mx-auto mb-2 flex justify-start pl-4">
          <div className="relative inline-block border-2 border-[#5f6fff] dark:border-[#4052d6] rounded-lg p-1 bg-white dark:bg-gray-800 shadow-md transition-colors">
            <img src={base64Image} alt="Preview" className="h-16 w-auto rounded object-contain" />
            <button 
              type="button"
              onClick={() => { setImageFile(null); setBase64Image(null); }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-sm hover:scale-110 transition-transform"
            >✕</button>
          </div>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="bg-white/60 dark:bg-[#1a233a]/60 border border-white/40 dark:border-gray-600/50 rounded-full w-full max-w-3xl p-3 px-5 mx-auto mb-6 flex gap-3 items-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500/50 hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] animate-fade-in-up print:hidden">
        <select
          value={mode}
          onChange={e => {
            setmode(e.target.value);
            setImageFile(null);
            setBase64Image(null);
          }}
          className="text-sm bg-transparent text-gray-700 dark:text-gray-200 outline-none cursor-pointer border-r border-gray-300 dark:border-gray-600 pr-3 font-medium">
          <option value="text" className="dark:bg-gray-800">Text</option>
          <option value="analyze" className="dark:bg-gray-800">Analyze Image</option>
        </select>

        {mode === 'analyze' ? (
          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 overflow-hidden">
            <label className="cursor-pointer text-xs text-white bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold py-2 px-4 rounded-full hover:shadow-lg hover:opacity-90 whitespace-nowrap shadow-sm transition-all">
              Choose Image
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <input
              value={prompt}
              onChange={e => setprompt(e.target.value)}
              type="text"
              placeholder="Ask about this image (optional)..."
              className="flex-1 text-[15px] bg-transparent outline-none w-full min-w-[100px] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-light"
            />
          </div>
        ) : (
          <input
            value={prompt}
            onChange={e => setprompt(e.target.value)}
            type="text"
            placeholder="Type your prompt..."
            className="flex-1 text-[15px] bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-light"
            required
          />
        )}

        <button disabled={loading} className="shrink-0 group hover:scale-110 transition-transform bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-full p-2.5 shadow-md flex items-center justify-center">
          <img
            src={loading ? chatassets.stop_icon : chatassets.send_icon}
            className={`w-5 h-5 invert ${loading ? 'animate-spin' : 'group-hover:translate-x-0.5 transition-transform'}`}
            alt="send"
          />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
