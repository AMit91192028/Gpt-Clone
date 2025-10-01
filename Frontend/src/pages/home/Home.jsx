import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'
import MessageInput from './MessageInput'
import axios from 'axios';
import '../../styles/theme.css'
import './home.css'
import { deleteChat, createNewChat, setActiveChatId,setChats } from '../../redux/features/chatSlice'
import { nanoid } from '@reduxjs/toolkit';

const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '🧑‍💻' 
}

const Home = () => {
  const dispatch = useDispatch()
  const { chats, activeChatId } = useSelector(state => state.chat)
  const [user] = useState(mockUser)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const[socket,setSocket] = useState(null)
  // Redux handles localStorage persistence
  const [messages,setMessages] = useState([]);
 
  const getMessages = async(chatId)=>{
    dispatch(setActiveChatId(chatId))
    const response =  await axios.get(`http://localhost:3000/chat/messages/${chatId}`,{
      withCredentials:true
     })

   console.log(response.data.messages)
     
   setMessages(response.data.messages.map(m=>({
    _id:m._id,
    role:m.role==='user'?'user':'ai',
    content:m.content
   })))
  }
  // const openChat = (id) => {
  //   dispatch(setActiveChatId(id))
  //   const chat = chats.find(c => c._id === id)
  //   // dispatch(setMessages(chat ? chat.messages : []))

  // }

  const handleDeleteChat = (id) => {
    dispatch(deleteChat(id))
  }

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...')
  }

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

  const handleCreateNewChat = async() => {
    // Prompt user for chat title
    let title = window.prompt('Enter a title for your new chat:', 'New chat')
    if(title) title = title.trim();
    console.log(title)
      if(!title) return;
      try{
       const response = await axios.post("http://localhost:3000/chat/",{title},{withCredentials:true})
      //  console.log(response.data.chats);
      dispatch(createNewChat({title:response.data.chat.title,_id:response.data.chat._id}));
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
      axios.get("http://localhost:3000/chat/",{withCredentials:true})
      .then(response=>{
        console.log(response.data.chats)
        dispatch(setChats(response.data.chats.reverse()));
      })
        
        
        const tempSocket = io("http://localhost:3000", {
          withCredentials: true
        })

         tempSocket.on("connected", () => {
    console.log("Socket connected ✅", tempSocket.id);
  });
          tempSocket.on("ai-response",(messaagePayload)=>{
            console.log("Connect to server",messaagePayload);
            // dispatch(addMessage(activeChatId,messaagePayload.content))
            setMessages((prevMessage)=>[...prevMessage,{
              _id:nanoid(),
              role:'ai',
              content:messaagePayload.content
            }])

          })

      setSocket(tempSocket)
  },[])

  const sendMessage = async (text) => {
    if (!text) return
    // if (!activeChatId) {
    //   alert("Please create a new chat or select one from chat history first");
    //   return;
    // }
    // if (!socket) {
    //   alert("Connection error. Please try again.");
    //   return;
    // }
    console.log("Sending message ",text,"\n activeChatId",activeChatId);
    
    setMessages((prevMessage)=>[...prevMessage,{
      _id:nanoid(),
      role:'user',
      content:text
    }])
    socket.emit("ai-message",{
      chat:activeChatId,
      content:text
    })
    // dispatch(addMessage(userMsg))

    // placeholder AI response (replace with real API call)
    // const aiResponse = { 
    //   id: (Date.now()+1).toString(), 
    //   role: 'assistant', 
    //   text: 'This is a mock response from AI.' 
    // }
    
    // setTimeout(() => {
    //   dispatch(addMessage(aiResponse))
    // }, 700)
  }

  return (
    <div className="home-root">
      <Sidebar 
        user={user}
        chats={chats}
        onOpen={getMessages}
        onCreate={handleCreateNewChat}
        onDelete={handleDeleteChat}
        onLogout={handleLogout}
        activeId={activeChatId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="home-main">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <span className="menu-icon">☰</span>
        </button>
        <ChatWindow messages={messages} onCreateNew={handleCreateNewChat} />
        <MessageInput onSend={sendMessage} activeChatId={activeChatId}/>
      </main>
    </div>
  )
}

export default Home
