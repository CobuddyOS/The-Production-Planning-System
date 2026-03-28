'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Message {
  role: 'nio' | 'user';
  content: string;
}

export default function NIOChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);

  const SYSTEM = `You are NIO (Network Integrity Operator) — the AI guide assistant for Cobuddy OS. You are a friendly, knowledgeable, slightly futuristic assistant.
Tagline: "Visualize it. Construct it. Execute it. Before the truck is even loaded."
Planets: ORB, NIO, OUL (Directory), CUE (Calendar), ATLAS (Assets), AXIS (Design), LIBRA (Logistics), NEXUS (Dashboard), PROPRINT (Blueprint).
Launch: Easter Sunday, April 20, 2026.
Company: Cobuddy LLC.
Waitlist: Join at cobuddyos.com.`;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'nio',
        content: "Hey — I'm NIO. I run the intelligence layer for Cobuddy OS. Ask me anything about the system, the planets, the launch — I've got you."
      }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim() || isThinking) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue('');
    setIsThinking(true);

    // Simulated response for now
    setTimeout(() => {
      let response = "I've received your transmission. The ExoGalaxy is currently initializing. Stay tuned for our April 20th launch.";
      const lowerText = text.toLowerCase();
      if (lowerText.includes('oul')) response = "OUL is the Occupational Utility Locator — the industry directory for finding AV companies and vendors.";
      if (lowerText.includes('axis')) response = "AXIS is our advanced spatial design canvas where you can build your production layouts visually.";
      if (lowerText.includes('atlas')) response = "ATLAS is the Approved Technology & Labor Asset System, our global asset registry.";
      
      setMessages(prev => [...prev, { role: 'nio', content: response }]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <>
      {/* NIO Ship */}
      <div 
        className="fixed bottom-[60px] right-[30px] z-[9999] cursor-pointer select-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative w-[160px] h-auto flex items-center justify-center animate-nio-float filter drop-shadow-[0_0_18px_rgba(0,255,136,0.5)] group-hover:drop-shadow-[0_0_32px_rgba(0,255,136,0.95)] transition-all">
          <div className="absolute -inset-[14px] rounded-full border-[1.5px] border-[#00ff88]/35 animate-nio-pulse-ring pointer-events-none" />
          <div className="absolute bottom-[calc(100%+10px)] right-0 bg-black/88 border border-[#00ff88]/30 rounded-[3px] px-[13px] py-[7px] text-[#00ff88] text-[7px] tracking-[2px] whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all pointer-events-none">
            ASK NIO
          </div>
          <Image 
            src="/exogalaxy/nio-help-bot.png" 
            alt="NIO" 
            width={160} 
            height={160} 
            className="mix-blend-screen"
          />
        </div>
      </div>

      {/* NIO Panel */}
      <div className={`fixed bottom-6 right-6 w-[340px] max-h-[520px] bg-[#040806]/97 border border-[#00ff88]/25 rounded-md flex flex-col z-[9998] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-5 scale-95 pointer-events-none'}`}>
        <div className="flex items-center gap-[10px] p-3 px-4 bg-[#00ff88]/5 border-b border-[#00ff88]/10 flex-shrink-0">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="5" y="8" width="18" height="14" rx="2" fill="#111" stroke="#00ff88" strokeWidth=".8"/>
            <rect x="3" y="10" width="3" height="8" rx="1.5" fill="#00ff88"/>
            <rect x="22" y="10" width="3" height="8" rx="1.5" fill="#00ff88"/>
            <ellipse cx="11" cy="14" rx="2" ry="2" fill="#00ff88"/>
            <ellipse cx="17" cy="14" rx="2" ry="2" fill="#00ff88"/>
            <path d="M10 18.5 Q14 20.5 18 18.5" stroke="#00ff88" strokeWidth=".8" fill="none" strokeLinecap="round"/>
            <circle cx="12" cy="8.5" r="1.2" fill="#ff3333"/>
          </svg>
          <div className="flex-1">
            <div className="text-white text-[9px] font-extrabold tracking-[3px]">NIO</div>
            <div className="text-[#00ff88]/60 text-[6px] tracking-[2px]">NETWORK INTELLIGENCE OPERATOR</div>
          </div>
          <div className="text-white/35 cursor-pointer hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>✕</div>
        </div>

        <div ref={messagesRef} className="flex-1 overflow-y-auto p-[14px] flex flex-col gap-[10px] min-h-0 custom-scrollbar">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`text-[8px] tracking-[0.8px] leading-[1.9] max-w-[88%] p-[10px] px-[13px] rounded-[4px] border ${msg.role === 'nio' ? 'bg-[#00ff88]/5 border-[#00ff88]/10 text-white/80 self-start' : 'bg-white/5 border-white/10 text-white/65 self-end'}`}
            >
              {msg.content}
            </div>
          ))}
          {isThinking && (
            <div className="flex gap-[5px] items-center p-[10px] px-[13px] self-start">
              <span className="w-[5px] h-[5px] rounded-full bg-[#00ff88] animate-pulse" />
              <span className="w-[5px] h-[5px] rounded-full bg-[#00ff88] animate-pulse [animation-delay:180ms]" />
              <span className="w-[5px] h-[5px] rounded-full bg-[#00ff88] animate-pulse [animation-delay:360ms]" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-[6px] p-2 px-4 flex-shrink-0">
          {['What is Cobuddy OS?', 'What is OUL?', 'Launch Date?', 'PROPRINT?'].map((q) => (
            <button 
              key={q}
              className="text-[#00ff88]/70 border border-[#00ff88]/20 bg-transparent px-[9px] py-[5px] rounded-[2px] text-[6.5px] tracking-[1.5px] hover:bg-[#00ff88]/10 hover:text-white transition-all"
              onClick={() => handleSend(q)}
            >
              {q.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-2 p-3 px-3 border-t border-[#00ff88]/10 flex-shrink-0">
          <input 
            className="flex-1 bg-white/5 border border-white/10 rounded-[2px] p-2 px-3 text-white text-[8px] tracking-[1px] outline-none focus:border-[#00ff88]/40 transition-colors"
            placeholder="ASK ME ANYTHING..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            className="bg-[#00ff88] rounded-[2px] w-9 h-9 flex items-center justify-center text-black font-bold disabled:opacity-40 transition-all shadow-[0_0_12px_rgba(0,255,136,0.3)] hover:shadow-[0_0_22px_rgba(0,255,136,0.55)]"
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isThinking}
          >
            ➤
          </button>
        </div>
      </div>

    </>
  );
}
