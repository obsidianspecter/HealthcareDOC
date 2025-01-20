import React, { useState, useEffect } from 'react';
import { Send, Upload, FileText, Download } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function AIHealthChat({ darkMode }: { darkMode: boolean }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      {
        id: 1,
        text: "How can I help you?",
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
      id: messages.length + 1,
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
        id: messages.length + 2,
        text: data.response,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error communicating with backend:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: messages.length + 2, text: 'Error: Unable to fetch response.', sender: 'assistant', timestamp: new Date() },
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

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-xl overflow-hidden ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } shadow-lg`}>
      <div className={`p-4 flex justify-between items-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div>
          <h3 className="text-lg font-semibold">AI Health Assistant</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Available 24/7 for your health queries
          </p>
        </div>
        <div className="flex space-x-3">
          <label className="cursor-pointer">
            <input type="file" accept=".txt,.pdf" onChange={handleFileUpload} className="hidden" />
            <Upload className="h-6 w-6 text-pink-500 hover:text-pink-600 transition" />
          </label>
          <button onClick={exportChat}>
            <Download className="h-6 w-6 text-gray-500 hover:text-gray-700 transition" />
          </button>
        </div>
      </div>

      <div className="h-[400px] overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              message.sender === 'user'
                ? darkMode
                  ? 'bg-pink-400 text-gray-900'
                  : 'bg-pink-600 text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-100'
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p>{message.text}</p>
              <p className="text-xs mt-1 text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {loading && <p className="text-center text-gray-500">Thinking...</p>}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your health question..."
          className={`flex-1 p-2 rounded-lg border ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-gray-100'
              : 'bg-white border-gray-200 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-pink-500`}
        />
        <button
          type="submit"
          className={`ml-2 p-2 rounded-lg ${
            darkMode ? 'bg-pink-400 text-gray-900' : 'bg-pink-600 text-white'
          } hover:opacity-90 transition-opacity`}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
