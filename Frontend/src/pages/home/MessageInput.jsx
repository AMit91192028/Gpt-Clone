import React, { useState } from 'react'
import './messageinput.css'

const MessageInput = ({ onSend,activeChatId }) => {
  const [text, setText] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  const hasText = text.trim().length > 0;

  return (
    <div className="input-toolbar">
      <form className="message-input-container" onSubmit={submit}>
       {activeChatId&& 
        <input 
          type="text"
          className="message-field" 
          placeholder="Ask anything" 
          value={text} 
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit(e);
            }
          }}
        />}{activeChatId&&
        <div className="input-controls">
          <button 
            type="button" 
            className={`mic-button ${!hasText ? 'disabled' : ''}`}
            disabled={!hasText}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path fill="currentColor" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
          <button 
            type="submit" 
            className={`submit-button ${!hasText ? 'disabled' : ''}`}
            disabled={!hasText}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/>
            </svg>
          </button>
        </div>
}
      </form>
    </div>
  )
}

export default MessageInput
