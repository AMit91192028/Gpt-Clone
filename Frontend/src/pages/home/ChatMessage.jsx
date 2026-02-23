import React from 'react'
import './chatmessage.css'

const formatMessage = (text) => {
  // Split message into blocks (code vs text)
  const blocks = text.split(/(```[\s\S]*?```)/g)
  
  return blocks.map((block, index) => {
    // Code block
    if (block.startsWith('```')) {
      const [, lang, ...code] = block.split('\n')
      const content = code.slice(0, -1).join('\n') // Remove closing ```
      return (
        <div key={index} className="code-block">
          <div className="code-header">
            <span className="code-lang">{lang?.trim() || 'plain'}</span>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(content)}>
              Copy code
            </button>
          </div>
          <pre><code>{content}</code></pre>
        </div>
      )
    }
    
    // Text content - handle paragraphs and lists
    return (
      <div key={index} className="text-content">
        {block.split('\n').map((line, i) => {
          // List items
          if (line.match(/^[*-]\s/)) {
            return <li key={i}>{line.replace(/^[*-]\s/, '')}</li>
          }
          // Numbered list
          if (line.match(/^\d+\.\s/)) {
            return <li key={i}>{line}</li>
          }
          // Regular paragraph
          if (line.trim()) {
            // Handle bold text between ** markers
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return <p key={i}>
              {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  // Remove ** and wrap in strong tag
                  return <strong key={index}>{part.slice(2, -2)}</strong>;
                }
                return part;
              })}
            </p>;
          }
          return null
        }).filter(Boolean)}
      </div>
    )
  })
}

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
)

const ThumbsUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
  </svg>
)

const ThumbsDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
  </svg>
)

const MessageActions = ({ onCopy }) => {
  const [copyStatus, setCopyStatus] = React.useState('idle') // idle, copying, copied

  const handleCopy = async () => {
    setCopyStatus('copying')
    await onCopy()
    setCopyStatus('copied')
    setTimeout(() => setCopyStatus('idle'), 2000)
  }

  return (
    <div className="message-actions">
      <button 
        className={`action-button ${copyStatus !== 'idle' ? 'active' : ''}`} 
        onClick={handleCopy}
        disabled={copyStatus === 'copying'}
      >
        {copyStatus === 'copied' ? (
          <>
            <span className="check-icon">✓</span>
            Copied!
          </>
        ) : (
          <>
            <CopyIcon />
            Copy
          </>
        )}
      </button>
      <button className="action-button" title="Like message">
        <ThumbsUpIcon />
      </button>
      <button className="action-button" title="Dislike message">
        <ThumbsDownIcon />
      </button>
    </div>
  )
}

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user'
  const [isVisible, setIsVisible] = React.useState(false)
  const messageRef = React.useRef(null)

  React.useEffect(() => {
    setIsVisible(true)
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text)
      return true
    } catch (err) {
      console.error('Failed to copy:', err)
      return false
    }
  }

  return (
    <div 
      ref={messageRef}
      className={`chat-message ${isUser ? 'user' : 'ai'} ${isVisible ? 'visible' : ''}`}
    >
      <div className="bubble">
        <div className={`message-avatar ${isUser ? 'user' : ''}`}>
          {isUser ? '👤' : 'AI'}
        </div>
        <div className="message-content">
          <div className="message-text">
            {formatMessage(message.content)}
          </div>
          {!isUser && <MessageActions onCopy={handleCopy} />}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
