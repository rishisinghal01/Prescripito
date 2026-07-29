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
        messages: [...prev.messages, ...newMessages]
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
        messages: [...prev.messages, aiMsg]
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

      {base64Image && mode === 'analyze' && (
        <div className="w-full max-w-2xl mx-auto mb-2 flex justify-start pl-4">
          <div className="relative inline-block border-2 border-[#5f6fff] rounded-lg p-1 bg-white shadow-md">
            <img src={base64Image} alt="Preview" className="h-16 w-auto rounded object-contain" />
            <button 
              type="button"
              onClick={() => { setImageFile(null); setBase64Image(null); }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-sm"
            >✕</button>
          </div>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="bg-[#5f6fff]/20 border border-[#5f6fff] rounded-full w-full max-w-2xl p-2 pl-4 mx-auto mb-6 flex gap-3 items-center shadow-md overflow-hidden">
        <select
          value={mode}
          onChange={e => {
            setmode(e.target.value);
            setImageFile(null);
            setBase64Image(null);
          }}
          className="text-sm bg-transparent text-gray-700 outline-none cursor-pointer border-r border-gray-400 pr-2">
          <option value="text">Text</option>
          <option value="analyze">Analyze Image</option>
        </select>

        {mode === 'analyze' ? (
          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 overflow-hidden">
            <label className="cursor-pointer text-xs text-[#5f6fff] bg-white font-semibold py-1.5 px-3 rounded-full hover:bg-gray-100 whitespace-nowrap shadow-sm border border-gray-200">
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
              className="flex-1 text-sm bg-transparent outline-none w-full min-w-[100px]"
            />
          </div>
        ) : (
          <input
            value={prompt}
            onChange={e => setprompt(e.target.value)}
            type="text"
            placeholder="Type your prompt..."
            className="flex-1 text-sm bg-transparent outline-none"
            required
          />
        )}

        <button disabled={loading} className="shrink-0">
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
