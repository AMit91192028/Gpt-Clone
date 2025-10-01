import React from 'react'
import './sidebar.css'

const Sidebar = ({ 
  user,
  chats = [], 
  onOpen, 
  onCreate, 
  onDelete,
  onLogout,
  activeId,
  isOpen,
  onClose
}) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-top">
        <button className="new-chat" onClick={onCreate}>+ New chat</button>
        <button className="close-sidebar" onClick={onClose}>✕</button>
      </div>

      <nav className="chat-list">
        {chats.length === 0 && <p className="empty">No previous chats</p>}
        {chats.map(c => (
          <div key={c._id} className={`chat-item ${activeId === c._id ? 'active' : ''}`}>
            <button className="chat-button" onClick={() => onOpen(c._id)}>
              <div className="chat-title">{c.title || 'Chat'}</div>
              
            </button>
            <button className="delete-chat" onClick={() => onDelete(c._id)} title="Delete chat">
              🗑️
            </button>
          </div>
        ))}
      </nav>

      <div className="user-profile">
        <div className="user-info">
          <span className="user-avatar">{user.avatar}</span>
          <span className="user-name">{user.name}</span>
        </div>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
