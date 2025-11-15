import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const ChatContext = createContext();
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const ChatContextProvider = (props) => {
  const navigate = useNavigate();

  const [user, setuser] = useState(null);
  const [chats, setchats] = useState([]);
  const [selectedChat, setselectedChat] = useState(null);
  const [token, settoken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setloadingUser] = useState(true);

  const fetchuserChat = async () => {
    try {
      const { data } = await axios.get("/api/chat/get", {
        headers: { token },
      });

      if (data.success) {
        setchats(data.chats);

        if (data.chats.length === 0) {
          await createNewChat();
          return fetchuserChat();
        }

        setselectedChat(data.chats[0]);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchuser = async () => {
    try {
      const { data } = await axios.get("/api/user/get-profile", {
        headers: { token },
      });

      if (data.success) {
        setuser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setloadingUser(false);
    }
  };

  const createNewChat = async () => {
    try {
      if (!user) {
        toast.error("Login to create a new chat");
        navigate("/login");
        return;
      }

      await axios.get("/api/chat/create", { headers: { token } });

      await fetchuserChat();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // LOAD USER ON TOKEN CHANGE
  useEffect(() => {
    if (token) {
      fetchuser(); // load user only once
    } else {
      setuser(null);
      setloadingUser(false);
    }
  }, [token]);

  // LOAD CHATS ONCE USER IS LOADED
  useEffect(() => {
    if (user?._id) {
      fetchuserChat();
    }
  }, [user?._id]);

  const value = {
    navigate,
    user,
    setuser,
    fetchuser,
    chats,
    selectedChat,
    setchats,
    setselectedChat,
    createNewChat,
    loadingUser,
    fetchuserChat,
    token,
    settoken,
    axios,
  };

  return (
    <ChatContext.Provider value={value}>
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
