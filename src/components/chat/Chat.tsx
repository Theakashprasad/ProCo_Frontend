import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

interface Message {
  sender: string;
  message: string;
  timestamp: Date;
}

interface ChatProps {
  currentUser: string;
  otherUser: string;
}

const Chat: React.FC<ChatProps> = ({ currentUser, otherUser }) => {
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3005', { withCredentials: true });
    setSocket(newSocket);

    // Create a unique room ID for the chat (you might want to generate this on the server)
    const roomId = [currentUser, otherUser].sort().join('-');

    newSocket.emit('join', roomId);

    newSocket.on('previousMessages', (previousMessages: Message[]) => {
      setMessages(previousMessages);
    });

    newSocket.on('newMessage', (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser, otherUser]);

  useEffect(() => {
    // Scroll to bottom of chat container when messages update
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      const roomId = [currentUser, otherUser].sort().join('-');
      socket.emit('sendMessage', { roomId, sender: currentUser, message });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with {otherUser}</h2>
      </div>
      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === currentUser ? 'sent' : 'received'}`}>
            <p>{msg.message}</p>
            <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;