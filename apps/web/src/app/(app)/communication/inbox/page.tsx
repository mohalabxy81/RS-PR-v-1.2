'use client';

import React, { useState } from 'react';
import { MessageCircle, Search, Send, File, Image, User, MoreVertical, Sparkles, Filter, MoreHorizontal, FileText, Settings } from 'lucide-react';

// Mock Data
const CONVERSATIONS = [
  { id: '1', name: 'John Doe', lastMessage: 'Is the villa still available?', time: '10:45 AM', unread: 2, platform: 'WhatsApp', status: 'Active' },
  { id: '2', name: 'Sarah Smith', lastMessage: 'Thank you for the brochure.', time: 'Yesterday', unread: 0, platform: 'WhatsApp', status: 'Closed' },
  { id: '3', name: 'Mike Johnson', lastMessage: 'Can we schedule a viewing?', time: 'Tuesday', unread: 1, platform: 'SMS', status: 'Active' },
];

const MESSAGES = [
  { id: '1', text: 'Hi, I saw the listing for the Marina Villa.', sender: 'them', time: '10:40 AM' },
  { id: '2', text: 'Hello John! Yes, it is still available. Would you like me to send you the full brochure?', sender: 'me', time: '10:42 AM' },
  { id: '3', text: 'Yes please. Also, is the price negotiable?', sender: 'them', time: '10:45 AM' },
];

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [messageInput, setMessageInput] = useState('');
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-zinc-50 overflow-hidden rounded-xl border border-zinc-200 m-4 shadow-sm">
      
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-zinc-200 bg-white flex flex-col">
        <div className="p-4 border-b border-zinc-200">
          <h2 className="text-xl font-semibold mb-4 text-zinc-800">Inbox</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-9 pr-4 py-2 bg-zinc-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-2 py-2 gap-1 border-b border-zinc-100">
          {['All', 'Unread', 'WhatsApp'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-zinc-600 hover:bg-zinc-100'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map((chat) => (
            <div key={chat.id} className="p-4 border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer flex gap-3 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-medium flex-shrink-0">
                {chat.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-semibold text-zinc-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-zinc-500">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-zinc-600 truncate pr-2">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white relative">
        {/* Chat Header */}
        <div className="h-16 border-b border-zinc-200 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-medium">
              J
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">John Doe</h2>
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online • WhatsApp
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsCopilotOpen(!isCopilotOpen)}
              className={`p-2 rounded-lg flex items-center gap-2 transition-colors ${isCopilotOpen ? 'bg-indigo-50 text-indigo-700' : 'text-zinc-600 hover:bg-zinc-100'}`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium hidden md:block">Copilot</span>
            </button>
            <button className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('/bg-pattern.png')] bg-repeat">
          {MESSAGES.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${msg.sender === 'me' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-zinc-100 text-zinc-800 rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1.5 text-right ${msg.sender === 'me' ? 'text-blue-100' : 'text-zinc-400'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-zinc-200">
          <div className="flex items-end gap-2 bg-zinc-50 border border-zinc-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <button className="p-2 text-zinc-400 hover:text-blue-600 transition-colors rounded-lg">
              <File className="w-5 h-5" />
            </button>
            <button className="p-2 text-zinc-400 hover:text-blue-600 transition-colors rounded-lg">
              <Image className="w-5 h-5" />
            </button>
            <textarea 
              rows={1}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..." 
              className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 resize-none py-2 px-2 text-sm outline-none"
            />
            <button className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Copilot Sidebar */}
      {isCopilotOpen && (
        <div className="w-80 border-l border-zinc-200 bg-white flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
          <div className="p-4 border-b border-zinc-200 flex items-center gap-2 bg-indigo-50/50">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-semibold text-indigo-900">AI Copilot</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Suggested Replies */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Suggested Replies</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setMessageInput("Yes, the Marina Villa is currently available. Would you like to schedule a viewing for this week?")}
                  className="w-full text-left p-3 text-sm bg-white border border-indigo-100 hover:border-indigo-300 rounded-xl hover:shadow-sm transition-all group"
                >
                  <p className="text-zinc-700 group-hover:text-indigo-900">"Yes, the Marina Villa is currently available. Would you like to schedule a viewing for this week?"</p>
                </button>
                <button 
                  onClick={() => setMessageInput("The listed price is 4.5M AED, but there is slight room for negotiation for serious buyers.")}
                  className="w-full text-left p-3 text-sm bg-white border border-indigo-100 hover:border-indigo-300 rounded-xl hover:shadow-sm transition-all group"
                >
                  <p className="text-zinc-700 group-hover:text-indigo-900">"The listed price is 4.5M AED, but there is slight room for negotiation for serious buyers."</p>
                </button>
              </div>
            </div>

            {/* Conversation Summary */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Conversation Insights</h3>
              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Sentiment</span>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Positive</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Intent</span>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Property Inquiry</span>
                </div>
                <div className="pt-2 border-t border-zinc-200">
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Lead is highly interested in the Marina Villa and is inquiring about price flexibility. 
                    Recommended next step: <strong className="text-zinc-900">Push for a viewing appointment.</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* CRM Context */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">CRM Context</h3>
              <div className="border border-zinc-200 rounded-xl overflow-hidden">
                <div className="bg-zinc-50 px-4 py-2 border-b border-zinc-200 flex justify-between items-center">
                  <span className="text-xs font-medium text-zinc-700">Lead Details</span>
                  <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">HOT</span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Budget</span>
                    <span className="font-medium text-zinc-900">4M - 5M AED</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Location</span>
                    <span className="font-medium text-zinc-900">Dubai Marina</span>
                  </div>
                  <button className="w-full mt-2 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100">
                    View Full Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
