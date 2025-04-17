import { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/api';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    
    // Show loading state
    setLoading(true);
    
    try {
      // Send message to API
      const response = await chatService.sendMessage(userMessage);
      
      // Add bot response to chat
      setMessages(prev => [...prev, { text: response.data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev, 
        { text: 'Sorry, there was an error. Please try again.', sender: 'bot', error: true }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-lg shadow-md">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">SAT AI Tutor</h2>
        <p className="text-sm opacity-80">Ask anything about SAT Math, Writing, or College Prep</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>Start a conversation with your SAT AI Tutor</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`mb-4 p-3 rounded-lg max-w-[80%] ${
                msg.sender === 'user' 
                  ? 'ml-auto bg-blue-500 text-white' 
                  : 'bg-white border border-gray-200 shadow-sm'
              } ${msg.error ? 'bg-red-100 text-red-800 border-red-300' : ''}`}
            >
              {msg.text}
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg max-w-[80%]">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
            <span className="text-sm text-gray-500">AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about SAT math, essay writing, etc."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}