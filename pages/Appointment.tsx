
import React, { useState, useEffect, useRef } from 'react';
import { Page, SiteConfig } from '../App';

interface Props {
  navigate: (page: Page) => void;
  initialName?: string;
  config: SiteConfig;
}

// Components
interface ChatBubbleProps {
    children?: React.ReactNode;
    delay?: number;
    ownerName: string;
}

const ChatBubble = ({ children, delay = 0, ownerName }: ChatBubbleProps) => (
    <div className="flex gap-3 mb-4 animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
        <div className="shrink-0 self-end">
            <img src="https://santanamendes.com.br/Sonia/Sonia_d0_img0.png" className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" alt={ownerName} />
        </div>
        <div className="bg-white p-3.5 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 text-slate-700 text-sm leading-relaxed max-w-[85%]">
            {children}
        </div>
    </div>
);

const UserBubble = ({ children }: { children?: React.ReactNode }) => (
    <div className="flex gap-3 mb-4 justify-end animate-slide-up">
        <div className="bg-pink-600 text-white p-3.5 rounded-2xl rounded-br-none shadow-md max-w-[85%] text-right text-sm">
            {children}
        </div>
    </div>
);

const TypingIndicator = () => (
    <div className="flex gap-3 mb-4 animate-fade-in">
         <div className="shrink-0 self-end">
            <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl rounded-bl-none border border-slate-100 flex gap-1 items-center h-10">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
    </div>
);

const Appointment: React.FC<Props> = ({ navigate, initialName, config }) => {
    // Steps: 0=Name, 1=Service, 2=Time/Details, 3=Review
    const [step, setStep] = useState(initialName ? 1 : 0);
    const [isTyping, setIsTyping] = useState(false);
    
    // Data State
    const [name, setName] = useState(initialName || '');
    const [selectedService, setSelectedService] = useState<{id: string, label: string, icon: string, color: string} | null>(null);
    const [preference, setPreference] = useState(''); // Morning, Afternoon, Evening
    const [message, setMessage] = useState('');

    const services = [
        { id: 'psicanalise', label: 'Psicanálise', icon: 'psychology_alt', color: 'bg-pink-100 text-pink-700 border-pink-200' },
        { id: 'psicopedagogia', label: 'Psicopedagogia', icon: 'extension', color: 'bg-orange-100 text-orange-700 border-orange-200' },
        { id: 'irlen', label: 'Síndrome de Irlen', icon: 'visibility', color: 'bg-blue-100 text-blue-700 border-blue-200' },
        { id: 'carreira', label: 'Carreira/OP', icon: 'explore', color: 'bg-sky-100 text-sky-700 border-sky-200' },
        { id: 'tdah', label: 'TDAH', icon: 'bolt', color: 'bg-violet-100 text-violet-700 border-violet-200' },
        { id: 'florais', label: 'Florais', icon: 'local_florist', color: 'bg-green-100 text-green-700 border-green-200' }
    ];

    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll Logic: Always scroll to bottom of chat area when step changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [step, isTyping, name, message]);

    // Simulate typing effect
    useEffect(() => {
        setIsTyping(true);
        const timer = setTimeout(() => {
            setIsTyping(false);
        }, 800); 
        return () => clearTimeout(timer);
    }, [step]);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSendWhatsApp = () => {
        const text = `Olá ${config.ownerName.split(' ')[0]}! Meu nome é *${name}*.%0A%0AGostaria de agendar um atendimento para: *${selectedService?.label.toUpperCase()}*.%0A%0APreferência de horário: ${preference}%0AObservações: ${message || 'Nenhuma.'}`;
        window.open(`https://wa.me/${config.whatsapp}?text=${text}`, '_blank');
    };

    return (
        <div className="bg-slate-50 h-[100dvh] w-full flex flex-col fixed inset-0 z-[60] overflow-hidden">
            {/* Header Sticky */}
            <header className="bg-white/95 backdrop-blur-md z-40 border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
                <button onClick={() => navigate(Page.HOME)} className="flex items-center gap-1 text-slate-500 hover:text-pink-600 transition-colors p-2 rounded-full hover:bg-slate-100">
                    <span className="material-symbols-outlined">arrow_back_ios</span>
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agendamento</span>
                    <div className="flex gap-1 mt-1">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className={`h-1 w-8 rounded-full transition-colors duration-500 ${step >= i ? 'bg-pink-500' : 'bg-slate-200'}`}></div>
                        ))}
                    </div>
                </div>
                <div className="w-8"></div>
            </header>

            {/* Chat Area (Scrollable) */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth overscroll-contain pb-32">
                 {/* Step 0: Name History */}
                 {step === 0 && (
                    <ChatBubble ownerName={config.ownerName}>
                        Olá! Que alegria receber você aqui. 😊<br/>
                        Para começarmos, <strong>qual é o seu nome?</strong>
                    </ChatBubble>
                )}
                
                {step > 0 && (
                    <>
                        <UserBubble>Me chamo {name}.</UserBubble>
                        <ChatBubble ownerName={config.ownerName}>Prazer, {name.split(' ')[0]}! ✨</ChatBubble>
                    </>
                )}

                 {/* Step 1: Service History */}
                 {step === 1 && !isTyping && (
                    <ChatBubble ownerName={config.ownerName}>
                        Como posso te ajudar hoje? Selecione o atendimento que você busca:
                    </ChatBubble>
                 )}

                 {step > 1 && (
                     <>
                        <UserBubble>Busco por {selectedService?.label}.</UserBubble>
                        <ChatBubble ownerName={config.ownerName}>Excelente escolha.</ChatBubble>
                     </>
                 )}

                 {/* Step 2: Time History */}
                 {step === 2 && !isTyping && (
                    <ChatBubble ownerName={config.ownerName}>
                         Para agilizar, qual sua preferência de turno? E quer deixar alguma observação?
                    </ChatBubble>
                 )}

                 {step > 2 && (
                     <UserBubble>Prefiro {preference}. {message && `Obs: ${message}`}</UserBubble>
                 )}

                 {/* Step 3: Final */}
                 {step === 3 && !isTyping && (
                     <ChatBubble ownerName={config.ownerName}>
                         Tudo pronto! Confira o resumo abaixo e clique para enviar. 👇
                     </ChatBubble>
                 )}

                 {isTyping && <TypingIndicator />}
            </div>

            {/* Input/Action Area (Fixed Bottom) */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50">
                <div className="max-w-xl mx-auto">
                    
                    {/* STEP 0 INPUT */}
                    {step === 0 && (
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Digite seu nome..."
                                className="flex-1 p-4 rounded-xl border-2 border-slate-200 focus:border-pink-500 outline-none text-base bg-slate-50 text-slate-800"
                            />
                            <button 
                                onClick={handleNext}
                                disabled={!name.trim()}
                                className="bg-pink-600 text-white p-4 rounded-xl font-bold disabled:opacity-50 disabled:grayscale transition-all shadow-md active:scale-95 shrink-0"
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    )}

                    {/* STEP 1 INPUT */}
                    {step === 1 && !isTyping && (
                         <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                            {services.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => { setSelectedService(s); handleNext(); }}
                                    className={`p-3 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-center items-center gap-2 ${s.color}`}
                                >
                                    <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                                    <span className="font-bold text-xs text-center leading-tight">{s.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* STEP 2 INPUT */}
                    {step === 2 && !isTyping && (
                        <div className="space-y-3">
                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                {['Manhã', 'Tarde', 'Noite', 'Flexível'].map(p => (
                                    <button 
                                        key={p}
                                        onClick={() => setPreference(p)}
                                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm border whitespace-nowrap transition-all ${preference === p ? 'bg-pink-600 text-white border-pink-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2 items-center">
                                <input 
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Obs (opcional)..."
                                    className="flex-1 p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-pink-500 outline-none text-slate-800"
                                />
                                <button 
                                    onClick={handleNext}
                                    disabled={!preference}
                                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 disabled:opacity-50 shrink-0"
                                >
                                    Revisar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 INPUT */}
                    {step === 3 && !isTyping && (
                        <div className="space-y-3 animate-slide-up">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Resumo</p>
                                    <p className="font-bold text-slate-800 text-sm">{selectedService?.label}</p>
                                    <p className="text-xs text-slate-500">{preference}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedService?.color} bg-opacity-20`}>
                                     <span className="material-symbols-outlined">{selectedService?.icon}</span>
                                </div>
                            </div>
                            <button 
                                onClick={handleSendWhatsApp}
                                className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">chat</span>
                                Enviar no WhatsApp
                            </button>
                             <button onClick={handleBack} className="w-full text-slate-400 text-xs font-bold uppercase hover:text-pink-600 py-2">Corrigir Dados</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Appointment;
