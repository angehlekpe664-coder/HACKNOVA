import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Loader2, Paperclip, Plus, Trash2, Image, FileText, MessageSquare, X, ChevronLeft, ChevronRight, Copy, Check, Menu, Clock, RotateCcw, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code my-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <span className="text-xs font-mono text-gray-500 uppercase">{language || 'code'}</span>
        <button 
          onClick={copyToClipboard}
          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-500"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'javascript'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          background: 'transparent',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

const MessageContent = ({ content, isUser }) => {
  if (!content) return null;
  
  if (isUser) {
    return <div className="whitespace-pre-wrap break-words">{content}</div>;
  }

  return (
    <div className="markdown-content prose dark:prose-invert max-w-none text-[15px] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <CodeBlock
                language={match ? match[1] : ''}
                value={String(children).replace(/\n$/, '')}
                {...props}
              />
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[#1700E5] dark:text-blue-400 font-mono text-sm" {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <table className="w-full border-collapse text-sm text-left">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 font-bold">{children}</thead>;
          },
          th({ children }) {
            return <th className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">{children}</td>;
          },
          h1: ({ children }) => <h1 className="text-2xl font-black mt-6 mb-4 text-[#0D0066] dark:text-white font-['Outfit']">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3 text-[#0D0066] dark:text-white font-['Outfit'] border-b border-gray-100 dark:border-gray-800 pb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2 text-[#0D0066] dark:text-white font-['Outfit']">{children}</h3>,
          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc ml-5 mb-4 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-5 mb-4 space-y-2">{children}</ol>,
          li: ({ children }) => <li className="mb-1 leading-normal">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#1700E5] pl-4 py-2 my-4 italic bg-blue-50/50 dark:bg-blue-900/10 rounded-r-lg">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#1700E5] dark:text-blue-400 underline decoration-2 underline-offset-4 hover:text-[#0D0066] transition-colors font-bold">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const OtherFeatures = () => {
  const { t } = useLanguage();
  
  // State for Chat Sessions
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('entrepreneurChatHistory');
    return saved ? JSON.parse(saved) : [{ 
      id: Date.now(), 
      title: t('new_chat') || 'Nouvelle discussion', 
      messages: [{ 
        id: 1, 
        role: 'assistant', 
        content: t('chat_welcome') || 'Bonjour ! Je suis BRAND.AI, votre conseiller stratégique. Posez-moi vos questions sur l\'entrepreneuriat, la gestion de projet ou le développement technique.', 
        timestamp: new Date().toLocaleTimeString() 
      }] 
    }];
  });
  
  const [activeSessionId, setActiveSessionId] = useState(sessions[0]?.id);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState([]); // Array of { file, preview, type, base64 }
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || { messages: [] };

  useEffect(() => {
    localStorage.setItem('entrepreneurChatHistory', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isLoading]);

  // Create a new chat session
  const createNewChat = () => {
    const newSession = {
      id: Date.now(),
      title: t('new_chat') || 'Nouvelle discussion',
      messages: [{ 
        id: 1, 
        role: 'assistant', 
        content: t('chat_welcome') || 'Bonjour ! Je suis BRAND.AI, votre conseiller stratégique.',
        timestamp: new Date().toLocaleTimeString()
      }]
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  // Delete a session
  const deleteSession = (e, id) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    if (newSessions.length === 0) {
      const resetSession = {
        id: Date.now(),
        title: t('new_chat') || 'Nouvelle discussion',
        messages: [{ 
          id: 1, 
          role: 'assistant', 
          content: t('chat_welcome') || 'Bonjour ! Je suis BRAND.AI.',
          timestamp: new Date().toLocaleTimeString()
        }]
      };
      setSessions([resetSession]);
      setActiveSessionId(resetSession.id);
    } else {
      setSessions(newSessions);
      if (activeSessionId === id) setActiveSessionId(newSessions[0].id);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachments(prev => [...prev, {
          file,
          preview: URL.createObjectURL(file),
          type: file.type,
          base64: reader.result.split(',')[1]
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Send message to backend
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const userMsgContent = input.trim();
    const currentAttachments = [...attachments];
    const timestamp = new Date().toLocaleTimeString();
    
    const userMessage = { 
      id: Date.now(), 
      role: 'user', 
      content: userMsgContent || "Analyse de document", 
      attachments: currentAttachments,
      timestamp 
    };

    // Update session messages
    const updatedSessions = sessions.map(s => {
      if (s.id === activeSessionId) {
        // Auto-update title if it's the first user message
        const newTitle = s.messages.length === 1 && userMsgContent ? (userMsgContent.substring(0, 25) + (userMsgContent.length > 25 ? '...' : '')) : s.title;
        return { ...s, title: newTitle, messages: [...s.messages, userMessage] };
      }
      return s;
    });
    setSessions(updatedSessions);
    
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const payloadAttachments = currentAttachments.map(a => ({
        mime_type: a.type,
        data: a.base64
      }));

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/entrepreneur-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          message: userMsgContent || "Analyse ce fichier s'il te plaît.", 
          attachments: payloadAttachments 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage = { 
          id: Date.now() + 1, 
          role: 'assistant', 
          content: data.response,
          timestamp: new Date().toLocaleTimeString()
        };
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, assistantMessage] } : s));
      } else {
        let errMsg = "❌ Erreur lors de la communication avec l'IA.";
        try { const d = await response.json(); errMsg += ` (${d.detail || response.status})`; } catch(_) {}
        if (response.status === 401) errMsg = "🔒 Session expirée. Veuillez vous **déconnecter** et **reconnecter** pour continuer.";
        if (response.status === 429) errMsg = "⚠️ Quota Gemini atteint. Réessayez dans quelques minutes.";
        if (response.status === 503) errMsg = "🔧 Le serveur backend est indisponible. Vérifiez que `uvicorn` est lancé.";
        const assistantMessage = { 
          id: Date.now() + 1, 
          role: 'assistant', 
          content: errMsg,
          timestamp: new Date().toLocaleTimeString()
        };
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, assistantMessage] } : s));
      }
    } catch (err) {
      console.error('Chat error:', err);
      const assistantMessage = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: "Erreur réseau. Vérifiez votre connexion avec le serveur backend.",
        timestamp: new Date().toLocaleTimeString()
      };
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, assistantMessage] } : s));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-[calc(100vh-140px)] lg:h-[calc(100vh-80px)] overflow-hidden bg-white dark:bg-[#0F172A] relative border border-gray-100 dark:border-gray-800 rounded-3xl mx-2 mb-2 shadow-sm">
      
      {/* Sidebar - History */}
      <div className={`
        ${isSidebarOpen ? 'w-64 md:w-72 border-r' : 'w-0'} 
        transition-all duration-500 bg-gray-50/50 dark:bg-[#1A1A2E]/50 border-gray-100 dark:border-gray-800 flex flex-col h-full overflow-hidden shrink-0
      `}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-transparent">
          <button 
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 bg-[#1700E5] hover:bg-[#0D0066] text-white py-3 rounded-2xl font-black transition-all shadow-lg shadow-[#1700E5]/20 active:scale-95 text-sm"
          >
            <Plus size={18} strokeWidth={3} /> {t('new_chat') || 'Nouveau Chat'}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{t('history') || 'Historique'}</p>
          {sessions.map(s => (
            <div 
              key={s.id}
              onClick={() => {
                setActiveSessionId(s.id);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={`
                group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all border
                ${activeSessionId === s.id 
                  ? 'bg-white dark:bg-[#1700E5]/10 border-[#1700E5]/20 text-[#1700E5] dark:text-blue-400 shadow-sm' 
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 hover:border-gray-100 dark:hover:border-white/5'}
              `}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare size={16} className={`shrink-0 ${activeSessionId === s.id ? 'opacity-100' : 'opacity-40'}`} />
                <span className={`truncate text-sm ${activeSessionId === s.id ? 'font-black' : 'font-medium'}`}>{s.title}</span>
              </div>
              <button 
                onClick={(e) => deleteSession(e, s.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-white dark:bg-[#0F172A] relative">
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`
            absolute left-4 top-4 p-2.5 rounded-xl transition-all z-30 shadow-sm border
            ${isSidebarOpen 
              ? 'bg-white dark:bg-[#1A1A2E] text-gray-400 border-gray-100 dark:border-gray-800 hover:text-[#1700E5]' 
              : 'bg-[#1700E5] text-white border-[#1700E5] hover:bg-[#0D0066]'
            }
          `}
          title={isSidebarOpen ? "Fermer l'historique" : "Ouvrir l'historique"}
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>

        <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-gray-800 shrink-0 px-16 relative bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl z-20">
           <h2 className="text-lg font-black text-[#0D0066] dark:text-white font-['Outfit'] flex items-center gap-2">
             <Sparkles className="text-[#1700E5] w-5 h-5" />
             BRAND.AI
             <span className="text-[10px] bg-[#1700E5]/10 text-[#1700E5] dark:text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-[#1700E5]/20 ml-2">PRO</span>
           </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8 scroll-smooth custom-scrollbar bg-gray-50/30 dark:bg-transparent">
          {activeSession.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
            >
              <div className={`flex gap-3 lg:gap-4 max-w-[92%] md:max-w-[85%] lg:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 lg:w-9 h-8 lg:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${msg.role === 'user' ? 'bg-[#1700E5] text-white border-[#1700E5]' : 'bg-white dark:bg-[#1A1A2E] text-[#1700E5] border-gray-100 dark:border-gray-800'}`}>
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-w-0 overflow-hidden">
                  <div className={`
                    px-4 lg:px-5 py-3 lg:py-3.5 rounded-2xl shadow-sm text-sm lg:text-base overflow-hidden break-words leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-[#1700E5] text-white rounded-tr-none' 
                      : 'bg-white dark:bg-[#1A1A2E] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-tl-none prose dark:prose-invert max-w-none prose-sm lg:prose-base'
                    }
                  `}>
                    {msg.role === 'user' && msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {msg.attachments.map((at, i) => (
                          <div key={i} className="relative rounded-lg overflow-hidden border border-white/20 shadow-sm">
                            {at.type.startsWith('image/') ? (
                              <img src={at.preview} alt="Attached" className="w-24 h-24 lg:w-32 lg:h-32 object-cover" />
                            ) : (
                              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white/10 flex flex-col items-center justify-center p-2 text-center">
                                <FileText size={24} />
                                <span className="text-[10px] mt-1 truncate w-full">Document PDF</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <MessageContent content={msg.content} isUser={msg.role === 'user'} />
                  </div>
                  <span className={`text-[10px] text-gray-400 font-bold uppercase tracking-widest ${msg.role === 'user' ? 'text-right pr-2' : 'text-left pl-2'}`}>
                    {msg.role === 'assistant' ? 'Intelligence Gemini 2.0' : 'Moi'} • {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-9 h-9 rounded-xl bg-[#1700E5]/5 flex items-center justify-center shrink-0 border border-[#1700E5]/10">
                  <Bot size={18} className="text-[#1700E5] animate-bounce" />
                </div>
                <div className="bg-white dark:bg-[#1A1A2E] px-6 py-4 rounded-3xl rounded-tl-none border border-gray-100 dark:border-gray-800 flex flex-col gap-3 shadow-md">
                   <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-[#1700E5] rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-[#1700E5] rounded-full animate-bounce delay-200"></div>
                        <div className="w-1.5 h-1.5 bg-[#1700E5] rounded-full animate-bounce delay-300"></div>
                      </div>
                      <span className="text-[#1700E5] dark:text-blue-400 text-[10px] lg:text-xs font-black tracking-[0.1em] uppercase">Analyse stratégique...</span>
                   </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 lg:p-10 bg-white dark:bg-[#0F172A] z-10">
          <div className="max-w-4xl mx-auto relative group">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 bg-gray-50 dark:bg-black/20 p-3 rounded-2xl animate-fade-in border border-gray-100 dark:border-gray-800">
                {attachments.map((at, i) => (
                  <div key={i} className="relative group/att">
                    {at.preview ? (
                      <img src={at.preview} alt="preview" className="w-14 h-14 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm" />
                    ) : (
                      <div className="w-14 h-14 bg-white dark:bg-gray-800 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-[#1700E5]">
                        <FileText size={20} />
                      </div>
                    )}
                    <button onClick={() => removeAttachment(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-white dark:bg-[#1A1A2E] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-2 relative transition-all focus-within:ring-4 focus-within:ring-[#1700E5]/10">
              <form onSubmit={handleSendMessage} className="flex flex-col">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }
                  }}
                  placeholder={t('chat_placeholder') || 'Posez votre question...'}
                  className="w-full bg-transparent border-none focus:ring-0 py-4 px-5 lg:px-6 resize-none min-h-[60px] max-h-[200px] text-gray-800 dark:text-white custom-scrollbar text-sm lg:text-base font-medium placeholder:text-gray-400"
                  rows="1"
                />
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-400 hover:text-[#1700E5] hover:bg-[#1700E5]/5 rounded-2xl transition-all">
                      <Paperclip size={22} />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple accept="image/*,application/pdf" className="hidden" />
                    <div className="h-4 w-[1px] bg-gray-100 dark:bg-gray-800 mx-3"></div>
                  </div>
                  <button type="submit" disabled={(!input.trim() && attachments.length === 0) || isLoading} className={`p-4 rounded-2xl transition-all shadow-xl active:scale-95 ${(!input.trim() && attachments.length === 0) || isLoading ? 'bg-gray-100 dark:bg-gray-800 text-gray-300' : 'bg-[#1700E5] text-white hover:bg-[#0D0066] hover:shadow-[#1700E5]/40'}`}>
                    {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} strokeWidth={2.5} />}
                  </button>
                </div>
              </form>
            </div>
            <p className="mt-4 text-[9px] lg:text-[10px] text-center text-gray-400 font-bold uppercase tracking-[0.2em] opacity-50">BRAND.AI • Pro Power Intelligence</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherFeatures;
