import React, { useState, useEffect } from 'react';
import { Send, Upload, Download, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function AIHealthChat({ darkMode }: { darkMode: boolean }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            id: 1,
            text: "Hello! How can I assist you today? 😊",
            sender: 'assistant',
            timestamp: new Date(),
          },
        ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: input }),
      });

      const data = await response.json();
      const aiMessage: Message = {
        id: Date.now(),
        text: data.response,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error communicating with backend:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          text: 'Error: Unable to fetch response. Please try again later.',
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      alert(`File "${e.target.files[0].name}" uploaded successfully.`);
    }
  };

  const exportChat = () => {
    const chatText = messages.map(msg => `${msg.sender === 'user' ? 'You' : 'Assistant'}: ${msg.text}`).join('\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chat_history.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearChatHistory = () => {
    localStorage.removeItem('chatMessages');
    setMessages([]);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-xl overflow-hidden ${
      darkMode ? 'bg-gray-900' : 'bg-white'
    } shadow-lg`}>
      <div className={`p-6 flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-300'
      } rounded-t-xl`}>
        <div>
          <h3 className="text-2xl font-bold">🤖 AI Health Assistant</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Available 24/7 for your health queries
          </p>
        </div>
        <div className="flex space-x-4">
          <label className="cursor-pointer">
            <input type="file" accept=".txt,.pdf" onChange={handleFileUpload} className="hidden" />
            <Upload className="h-7 w-7 text-pink-500 hover:text-pink-600 transition-transform transform hover:scale-110" />
          </label>
          <button onClick={exportChat}>
            <Download className="h-7 w-7 text-gray-500 hover:text-gray-700 transition-transform transform hover:scale-110" />
          </button>
          <button onClick={clearChatHistory}>
            <Trash2 className="h-7 w-7 text-red-500 hover:text-red-700 transition-transform transform hover:scale-110" />
          </button>
        </div>
      </div>

      <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-lg p-4 ${
              message.sender === 'user'
                ? darkMode ? 'bg-pink-500 text-gray-900' : 'bg-pink-600 text-white'
                : darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-900'
            } shadow-md transition-all transform hover:scale-105`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
              <p className="text-xs mt-2 text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 animate-pulse">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
            </div>
            <p className="mt-2 text-pink-500 font-semibold">Thinking...</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-6 border-t border-gray-300 flex items-center bg-white dark:bg-gray-900">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className={`flex-1 p-3 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all`}
        />
        <button
          type="submit"
          className={`ml-4 p-3 rounded-lg ${
            darkMode ? 'bg-pink-400 text-gray-900' : 'bg-pink-600 text-white'
          } hover:opacity-90 transition-all transform hover:scale-105`}
        >
          <Send className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
}
