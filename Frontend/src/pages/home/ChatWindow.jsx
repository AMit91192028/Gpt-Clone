import React from 'react'
import ChatMessage from './ChatMessage'
import './chatwindow.css'

const ChatWindow = ({ messages = [], onCreateNew }) => {
  return (
    <section className="chat-window">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <h2>Welcome to Ami Mitra</h2>
            <p>Experience the power of AI conversation. Ask questions, get creative solutions, or simply chat about any topic.</p>
            <button className="start-btn" onClick={onCreateNew}>
              Start a conversation
            </button>
          </div>
        ) : (
          <div className="messages">
            {messages.map(m => <ChatMessage key={m._id} message={m} />)}
          </div>
        )}
      </div>
    </section>
  )
}

export default ChatWindow
