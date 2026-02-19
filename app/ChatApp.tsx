'use client';

import { useState, useEffect, useRef } from 'react';

// Types
interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  online: boolean;
}

// Mock data
const initialChats: Chat[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'Hey, how are you?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=8',
    lastMessage: 'See you tomorrow!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    online: false,
  },
  {
    id: '3',
    name: 'Team Group',
    avatar: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'Meeting at 3 PM',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 5,
    online: false,
  },
  {
    id: '4',
    name: 'Mom',
    avatar: 'https://i.pravatar.cc/150?img=9',
    lastMessage: 'Call me when free',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48),
    unreadCount: 0,
    online: true,
  },
];

const initialMessages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', text: 'Hi there!', sender: 'me', timestamp: new Date(Date.now() - 1000 * 60 * 60), status: 'read' },
    { id: 'm2', text: 'Hello! How can I help you?', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 55), status: 'read' },
    { id: 'm3', text: 'I have a question about the project', sender: 'me', timestamp: new Date(Date.now() - 1000 * 60 * 10), status: 'read' },
    { id: 'm4', text: 'Hey, how are you?', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 5), status: 'read' },
  ],
  '2': [
    { id: 'm5', text: 'Are you coming to the party?', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), status: 'read' },
    { id: 'm6', text: 'Yes, I will be there!', sender: 'me', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: 'read' },
    { id: 'm7', text: 'See you tomorrow!', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: 'read' },
  ],
};

export default function ChatApp() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [activeChatId, setActiveChatId] = useState<string | null>('1');
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(chat => chat.id === activeChatId);
  const activeMessages = activeChatId ? messages[activeChatId] || [] : [];

  useEffect(() => {
    if (activeChatId && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages, activeChatId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage],
    }));

    // Update last message in chat list
    setChats(prev => prev.map(chat => 
      chat.id === activeChatId 
        ? { ...chat, lastMessage: inputText, lastMessageTime: new Date() }
        : chat
    ));

    setInputText('');

    // Simulate reply
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'That sounds great! 👍',
        sender: 'other',
        timestamp: new Date(),
        status: 'delivered',
      };

      setMessages(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), replyMessage],
      }));

      setChats(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? { ...chat, lastMessage: replyMessage.text, lastMessageTime: new Date(), unreadCount: 0 }
          : chat
      ));
    }, 2000);
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen max-w-7xl mx-auto bg-white dark:bg-[#111b21]">
      {/* Sidebar */}
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-[#efeae2] dark:bg-[#111b21]">
        {/* Header */}
        <div className="bg-[#008069] dark:bg-[#005b4a] p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <img 
              src="https://i.pravatar.cc/150?img=32" 
              alt="My avatar" 
              className="w-10 h-10 rounded-full cursor-pointer"
            />
            <h1 className="text-xl font-semibold">WhatsApp</h1>
          </div>
          <div className="flex gap-4">
            <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Search or start new chat"
              className="w-full bg-[#f0f2f5] dark:bg-[#202c33] text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#008069] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                activeChatId === chat.id 
                  ? 'bg-[#f0f2f5] dark:bg-[#2a3942]' 
                  : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'
              }`}
            >
              <div className="relative">
                <img 
                  src={chat.avatar} 
                  alt={chat.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#efeae2] dark:border-[#111b21]"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-gray-900 dark:text-gray-100 font-medium truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {formatTime(chat.lastMessageTime)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate pr-2">
                    {chat.lastMessage}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-[#25d366] text-white text-xs font-bold rounded-full min-w-[18px] h-5 flex items-center justify-center px-1">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#efeae2] dark:bg-[#111b21]">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-[#008069] dark:bg-[#005b4a] p-3 flex items-center gap-3 text-white shadow-md">
              <button className="md:hidden hover:bg-white/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <img 
                src={activeChat.avatar} 
                alt={activeChat.name} 
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
              />
              <div className="flex-1">
                <h3 className="font-medium">{activeChat.name}</h3>
                <p className="text-xs text-white/80">
                  {activeChat.online ? 'online' : 'last seen recently'}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="hover:bg-white/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button className="hover:bg-white/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#efeae2] dark:bg-[#111b21]">
              <div className="flex justify-center">
                <span className="bg-[#e2e4e6] dark:bg-[#202c33] text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-lg">
                  Today
                </span>
              </div>

              {activeMessages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 shadow-sm ${
                      msg.sender === 'me'
                        ? 'bg-[#008069] text-white rounded-tr-none'
                        : 'bg-white dark:bg-[#202c33] text-gray-800 dark:text-gray-100 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${msg.sender === 'me' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                      <span className="text-[10px]">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.sender === 'me' && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-3 w-3 ${
                            msg.status === 'read' ? 'text-blue-300' : 'text-white/80'
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f2f5] dark:bg-[#202c33] p-3 flex items-end gap-3">
              <div className="flex gap-1 pb-2">
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSendMessage} className="flex-1">
                <input
                  type="text"
                  placeholder="Type a message"
                  className="w-full bg-white dark:bg-[#2a3942] text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#008069] transition-all"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </form>
              <button
                onClick={handleSendMessage}
                className="p-3 bg-[#008069] dark:bg-[#005b4a] rounded-full text-white hover:bg-[#006b5a] dark:hover:bg-[#004a3d] transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="w-64 h-64 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">WhatsApp Web</h2>
            <p>Send and receive messages without keeping your phone online.</p>
            <p className="text-sm mt-4">Use WhatsApp on up to 4 linked devices and 1 phone.</p>
          </div>
        )}
      </div>
    </div>
  );
}
