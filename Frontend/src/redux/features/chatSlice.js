import { createSlice } from '@reduxjs/toolkit';

// const loadChatsFromStorage = () => {
//   try {
//     const raw = localStorage.getItem('chats');
//     return raw ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// };

const initialState = {
  chats:[],
  currentChat: null,
  messages: [],
  activeChatId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
    },
    // addMessage: (state, action) => {
    // const { chatId, message } = action.payload;
    //    const chat = state.chats.find(c => c.id === chatId);
    //    if (!chat) return;
    //     // if (chat.messages.length === 0) {
    //     //  chat.title = message.content.slice(0, 40) + (message.content.length > 40 ? '…' : '');
    //     // }
    //   chat.messages.push(message); 
    // },
    deleteChat: (state, action) => {
      state.chats = state.chats.filter(c => c.id !== action.payload);
      if (action.payload === state.activeChatId) {
        state.activeChatId = null;
        state.messages = [];
        state.currentChat = null;
      }
    },
    createNewChat: (state, action) => {
      const{_id,title} = action.payload
      const newChat = {
        _id: _id,
        title: title || 'New chat',
        messages: []
      };
      state.chats.unshift(newChat);
      state.activeChatId = newChat._id;
      state.currentChat = newChat;
      state.messages = [];
    }
  }
});

export const {
  setChats,
  setCurrentChat,
  setMessages,
  setActiveChatId,
  deleteChat,
  createNewChat
} = chatSlice.actions;

export default chatSlice.reducer;