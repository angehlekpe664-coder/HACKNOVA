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
    <div className="markdown-content prose dark:prose-invert max-w-none text-[15px] leading-relaxed [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
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
        try { const d = await response.json(); errMsg += ` (${d.detail || response.status})`; } catch (_) { }
        if (response.status === 401) errMsg = "🔒 connexion impossible vérifiez si vous êtes connecté à internet .";
        if (response.status === 429) errMsg = "⚠️ Quota Brand.AI atteint. Réessayez dans quelques minutes.";
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
    <div className="flex w-full h-[calc(100vh-92px)] lg:h-[calc(100vh-48px)] overflow-hidden bg-[#f8fafc] dark:bg-[#020617] relative border border-gray-100 dark:border-white/5 rounded-3xl mx-2 mb-2 shadow-2xl">
      <div className="noise-bg opacity-10"></div>

      {/* Sidebar - History with Glassmorphism */}
      <div className={`
        ${isSidebarOpen ? 'w-64 md:w-80 border-r' : 'w-0'} 
        transition-all duration-500 bg-white/40 dark:bg-black/20 backdrop-blur-xl border-gray-100 dark:border-white/5 flex flex-col h-full overflow-hidden shrink-0 z-30
      `}>
        <div className="p-6 border-b border-gray-100 dark:border-white/5">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-3 bg-[#2F00E6] hover:bg-[#1200AB] text-white py-4 rounded-2xl font-black transition-all shadow-xl shadow-[#2F00E6]/20 active:scale-95 text-sm uppercase tracking-wider"
          >
            <Plus size={20} strokeWidth={3} /> {t('new_chat')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('history')}</p>
          {sessions.map(s => (
            <div
              key={s.id}
              onClick={() => {
                setActiveSessionId(s.id);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={`
                group flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all border
                ${activeSessionId === s.id
                  ? 'bg-white dark:bg-[#2F00E6] border-[#2F00E6] text-[#2F00E6] dark:text-white shadow-lg'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'}
              `}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare size={18} className={`shrink-0 ${activeSessionId === s.id ? 'opacity-100' : 'opacity-40'}`} />
                <span className={`truncate text-[13px] ${activeSessionId === s.id ? 'font-black' : 'font-semibold'}`}>{s.title}</span>
              </div>
              <button
                onClick={(e) => deleteSession(e, s.id)}
                className={`p-1.5 rounded-lg transition-all ${activeSessionId === s.id ? 'text-white/60 hover:text-white' : 'opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50'}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full relative z-10">
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`
            absolute left-4 top-4 p-2 rounded-lg transition-all z-40 shadow-md border
            ${isSidebarOpen 
              ? 'bg-white dark:bg-[#1e1b4b] text-gray-400 border-gray-100 dark:border-white/10 hover:text-[#2F00E6]' 
              : 'bg-[#2F00E6] text-white border-[#2F00E6] hover:bg-[#1200AB]'
            }
          `}
        >
          {isSidebarOpen ? <ChevronLeft size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
        </button>

        <div className="h-16 lg:h-18 flex items-center justify-center border-b border-gray-100 dark:border-white/5 shrink-0 px-16 lg:px-20 relative bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-20">
           <h2 className="text-lg lg:text-xl font-black text-[#0D0066] dark:text-white font-['Outfit'] flex items-center gap-2 tracking-tight">
              <div className="p-1 bg-[#2F00E6] rounded-lg shadow-lg shadow-[#2F00E6]/20">
                <Sparkles size={14} strokeWidth={3} className="text-white lg:w-[16px] lg:h-[16px]" />
              </div>
              BRAND.AI
              <span className="text-[8px] lg:text-[9px] bg-[#2F00E6]/10 text-[#2F00E6] dark:text-blue-400 px-1.5 py-0.5 rounded-lg uppercase tracking-tighter border border-[#2F00E6]/20 font-black">Pro Assistant</span>
            </h2>
         </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-6 scroll-smooth custom-scrollbar">
          {activeSession.messages.length === 1 && (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-3xl mx-auto py-20 animate-fade-in-up">
              <div className="relative mb-12 group">
                <div className="absolute inset-0 bg-[#2F00E6]/20 rounded-full animate-ping blur-2xl opacity-40"></div>
                <div className="w-28 h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-[#2F00E6] via-[#1200AB] to-[#0D0066] rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(47,0,230,0.4)] relative z-10 border border-white/20 transition-transform group-hover:scale-110 duration-700">
                  <Bot size={56} className="text-white" strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white dark:border-[#020617] shadow-xl z-20"></div>
              </div>

              <h1 className="text-[40px] lg:text-[50px] font-black text-[#0D0066] dark:text-white mb-6 font-['Outfit'] leading-none tracking-tight">
                Propulsez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F00E6] to-[#5CA8FF]">Business</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-xl leading-relaxed mb-12 max-w-xl mx-auto">
                Je suis votre expert stratégique. De la planification au déploiement, je vous accompagne dans chaque étape de votre succès.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-4">
                {[
                  { text: "Rédiger un Business Plan", icon: FileText },
                  { text: "Analyse Stratégique de Marché", icon: Search },
                  { text: "Conseils en Levée de Fonds", icon: Sparkles },
                  { text: "Développement Technique", icon: CodeBlock }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(item.text)}
                    className="p-5 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-sm lg:text-[15px] font-black text-gray-700 dark:text-gray-200 hover:border-[#2F00E6] hover:text-[#2F00E6] hover:shadow-2xl hover:shadow-[#2F00E6]/10 transition-all text-left flex items-center justify-between group animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <span className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl group-hover:bg-[#2F00E6]/10 transition-colors">
                        {item.icon && <item.icon size={18} className="text-gray-400 group-hover:text-[#2F00E6]" />}
                      </div>
                      {item.text}
                    </span>
                    <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSession.messages.map((msg, idx) => idx > 0 && (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
            >
              <div className={`flex gap-4 lg:gap-6 w-full max-w-[100%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-[1.2rem] flex items-center justify-center shrink-0 shadow-lg border-2 ${msg.role === 'user' ? 'bg-[#2F00E6] text-white border-white dark:border-[#020617]' : 'bg-white dark:bg-[#1e1b4b] text-[#2F00E6] border-[#2F00E6]/10'}`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`flex flex-col gap-2 min-w-0 ${msg.role === 'user' ? 'items-end' : 'items-start flex-1'}`}>
                  <div className={`
                    px-5 py-4 lg:py-5 rounded-[2rem] shadow-xl text-[15px] lg:text-[16px] break-words leading-relaxed
                    ${msg.role === 'user' 
                      ? 'w-fit max-w-[85%] bg-gradient-to-br from-[#2F00E6] to-[#1200AB] text-white rounded-tr-none' 
                      : 'w-full overflow-hidden glass-card text-gray-800 dark:text-gray-200 rounded-tl-none font-medium'
                    }
                  `}>
                    {msg.role === 'user' && msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-4">
                        {msg.attachments.map((at, i) => (
                          <div key={i} className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                            {at.type.startsWith('image/') ? (
                              <img src={at.preview} alt="Attached" className="w-28 h-28 lg:w-40 lg:h-40 object-cover" />
                            ) : (
                              <div className="w-28 h-28 lg:w-40 lg:h-40 bg-white/10 flex flex-col items-center justify-center p-3 text-center">
                                <FileText size={32} />
                                <span className="text-[11px] mt-2 font-black uppercase text-white/50">PDF Doc</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <MessageContent content={msg.content} isUser={msg.role === 'user'} />
                  </div>
                  <span className={`text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] ${msg.role === 'user' ? 'text-right pr-4' : 'text-left pl-4'}`}>
                    {msg.role === 'assistant' ? 'Intelligence BRAND.AI — Pro' : 'Utilisateur'} • {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex gap-6 max-w-[85%]">
                <div className="w-12 h-12 rounded-[1.2rem] glass-card flex items-center justify-center shrink-0 border-2 border-[#2F00E6]/10 relative">
                  <div className="absolute inset-0 bg-[#2F00E6]/10 animate-ping rounded-[1.2rem]"></div>
                  <Bot size={20} className="text-[#2F00E6]" />
                </div>
                <div className="glass-card px-8 py-5 rounded-[2rem] rounded-tl-none flex flex-col gap-3 shadow-2xl border border-[#2F00E6]/10">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-[#2F00E6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#2F00E6] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-2 h-2 bg-[#2F00E6] rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                    <span className="text-[#2F00E6] dark:text-blue-400 text-xs font-black tracking-[0.2em] uppercase">Réseau neuronal actif...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area Enhancements */}
        <div className="px-4 pt-6 pb-4 lg:px-6 lg:pt-8 lg:pb-6 relative z-30">
          <div className="max-w-4xl mx-auto relative">
            
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4 glass-card p-4 rounded-[2rem] animate-fade-in-up shadow-2xl">
                {attachments.map((at, i) => (
                  <div key={i} className="relative group/att">
                    {at.preview ? (
                      <img src={at.preview} alt="preview" className="w-16 h-16 object-cover rounded-2xl border-2 border-white dark:border-[#020617] shadow-xl transition-transform hover:scale-110" />
                    ) : (
                      <div className="w-16 h-16 glass-card flex items-center justify-center rounded-2xl border-2 border-[#2F00E6]/20 text-[#2F00E6]">
                        <FileText size={24} />
                      </div>
                    )}
                    <button onClick={() => removeAttachment(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-xl hover:bg-red-600 transition-all hover:scale-110">
                      <X size={12} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="glass-card rounded-[1.5rem] shadow-[0_16px_40px_rgba(0,0,0,0.10)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.30)] p-2 relative transition-all focus-within:ring-4 focus-within:ring-[#2F00E6]/10 border-2 border-white/50 dark:border-white/5">
              <form onSubmit={handleSendMessage} className="flex flex-col">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }
                  }}
                  placeholder={t('chat_placeholder')}
                  className="w-full bg-transparent border-none focus:ring-0 py-2.5 px-6 resize-none min-h-[40px] max-h-[110px] text-gray-800 dark:text-white custom-scrollbar text-[16px] font-bold placeholder:text-gray-400/70"
                  rows="1"
                />
                <div className="flex items-center justify-between px-2 pb-2">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-4 text-gray-400 hover:text-[#2F00E6] hover:bg-[#2F00E6]/5 rounded-2xl transition-all group">
                      <Paperclip size={22} className="group-hover:rotate-45 transition-transform" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple accept="image/*,application/pdf" className="hidden" />

                    {/* Visual energy indicators */}
                    <div className="hidden md:flex gap-1.5 px-3 h-6 items-center">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-1 h-3 bg-[#2F00E6]/20 rounded-full animate-pulse" style={{ animationDelay: `${i*300}ms` }}></div>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={(!input.trim() && attachments.length === 0) || isLoading} 
                    className={`p-4 rounded-[1.25rem] transition-all shadow-2xl active:scale-95 flex items-center gap-3 ${(!input.trim() && attachments.length === 0) || isLoading 
                      ? 'bg-gray-100 dark:bg-white/5 text-gray-300' 
                      : 'bg-[#2F00E6] text-white hover:bg-[#1200AB] hover:shadow-[#2F00E6]/40'}`}
                  >
                    {isLoading ? <Loader2 size={24} className="animate-spin" /> : (
                      <>
                        <span className="hidden sm:inline font-black text-[11px] uppercase tracking-widest pl-2">Envoyer</span>
                        <Send size={22} strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            <p className="mt-6 text-[10px] text-center text-gray-400 font-black uppercase tracking-[0.3em] opacity-40">Intelligence Artificielle • Binôme 35 • TECHNOVA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherFeatures;
