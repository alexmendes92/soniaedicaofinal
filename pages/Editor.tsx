import React, { useState, useEffect } from 'react';
import { Page, SiteConfig, ServiceItem, LocationItem } from '../App';

// --- CONFIGURAÇÃO DA API (Mesma do App.tsx para garantir consistência) ---
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://sonia-final-backend.alex-s-mendes.workers.dev/api' 
  : 'http://localhost:8787/api';

interface Props {
  navigate: (page: Page) => void;
  currentConfig: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
  services: ServiceItem[];
  onUpdateServices: (services: ServiceItem[]) => void;
}

const Editor: React.FC<Props> = ({ navigate, currentConfig, onUpdateConfig, services, onUpdateServices }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [showIntro, setShowIntro] = useState(true);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    
    // Services Form State
    const [isEditingService, setIsEditingService] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [serviceForm, setServiceForm] = useState<ServiceItem>({
        id: '',
        title: '',
        desc: '',
        icon: 'psychology',
        img: '',
        category: 'general',
        pageRoute: undefined 
    });

    // Location Form State
    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [locationForm, setLocationForm] = useState<LocationItem>({
        id: '',
        title: '',
        cep: '',
        address: '',
        number: '',
        district: '',
        city: '',
        state: ''
    });

    // Appointment Config
    const [welcomeMessage, setWelcomeMessage] = useState("Olá! Que alegria receber você aqui. 😊\nPara começarmos, qual é o seu nome?");

    useEffect(() => {
        const timer = setTimeout(() => { setShowIntro(false); }, 3000); 
        return () => clearTimeout(timer);
    }, []);

    const steps = [
        { title: 'Identidade', subtitle: 'Visual & Cores', icon: 'palette' },
        { title: 'Perfil', subtitle: 'Bio & Contato', icon: 'face_3' },
        { title: 'Público', subtitle: 'Quem Atende', icon: 'groups' },
        { title: 'Serviços', subtitle: 'Seu Portfólio', icon: 'grid_view' },
        { title: 'Chat', subtitle: 'Agendamento', icon: 'chat' },
        { title: 'Locais', subtitle: 'Endereços', icon: 'location_on' },
        { title: 'Extras', subtitle: 'Funcionalidades', icon: 'toggle_on' },
        { title: 'Publicar', subtitle: 'Revisão Final', icon: 'rocket_launch' }
    ];

    const changeStep = (dir: 'next' | 'prev') => {
        if (animating) return;
        setDirection(dir);
        setAnimating(true);
        setTimeout(() => {
            if (dir === 'next') setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
            else setCurrentStep(prev => Math.max(prev - 1, 0));
            setAnimating(false);
        }, 300);
    };

    const handleConfigChange = (field: keyof SiteConfig, value: any) => {
        onUpdateConfig({ ...currentConfig, [field]: value });
    };

    const toggleFeature = (featureKey: keyof typeof currentConfig.features) => {
        onUpdateConfig({
            ...currentConfig,
            features: { ...currentConfig.features, [featureKey]: !currentConfig.features[featureKey] }
        });
    };

    const toggleAudience = (id: string) => {
        const updated = currentConfig.audience.map(a => a.id === id ? { ...a, active: !a.active } : a);
        onUpdateConfig({ ...currentConfig, audience: updated });
    };

    // Service Logic
    const handleEditService = (service: ServiceItem) => {
        setServiceForm(service);
        setEditingId(service.id);
        setIsEditingService(true);
    };
    const handleSaveService = () => {
        if(!serviceForm.title) return;
        if (editingId) {
            onUpdateServices(services.map(s => s.id === editingId ? serviceForm : s));
        } else {
            onUpdateServices([...services, serviceForm]);
        }
        setIsEditingService(false);
    };

    // Location Logic
    const fetchCep = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) return;
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();
            if (!data.erro) setLocationForm(prev => ({ ...prev, address: data.logradouro, district: data.bairro, city: data.localidade, state: data.uf }));
        } catch (error) { console.error(error); }
    };
    const handleSaveLocation = () => {
        if(!locationForm.title) return;
        onUpdateConfig({ ...currentConfig, locations: [...currentConfig.locations, { ...locationForm, id: Date.now().toString() }] });
        setIsAddingLocation(false);
        setLocationForm({ id: '', title: '', cep: '', address: '', number: '', district: '', city: '', state: '' });
    };

    const getTheme = () => {
        switch(currentConfig.primaryColor) {
            case 'blue': return { bg: 'bg-sky-600', text: 'text-sky-600', border: 'border-sky-200', gradient: 'from-sky-500 to-blue-600', shadow: 'shadow-sky-200' };
            case 'violet': return { bg: 'bg-violet-600', text: 'text-violet-600', border: 'border-violet-200', gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-200' };
            default: return { bg: 'bg-pink-600', text: 'text-pink-600', border: 'border-pink-200', gradient: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-200' };
        }
    };
    const theme = getTheme();
    const progressPercent = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="fixed inset-0 z-[60] h-[100dvh] bg-slate-50 font-sans flex flex-col overflow-hidden">
            <style>{`
                .step-enter { animation: enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .step-exit { animation: exit 0.3s ease-in forwards; opacity: 0; }
                @keyframes enter { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes exit { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-20px); } }
                .glass-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.5); }
                .animate-blob { animation: blob 7s infinite; }
                @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
            `}</style>

            {/* INTRO OVERLAY */}
            <div className={`absolute inset-0 z-[100] bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center transition-all duration-1000 ${showIntro ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                 <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
                    <div className="absolute top-0 left-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                 </div>
                 
                 <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 p-1 shadow-2xl animate-bounce mb-6">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-4 border-white/20">
                            <span className="material-symbols-outlined text-5xl text-white">face_3</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-heading font-bold text-white mb-2 tracking-tight">Olá, Sônia!</h1>
                    <p className="text-slate-300 text-lg font-light">Seu painel de edição está pronto.</p>
                    
                    <div className="mt-8 flex gap-2">
                         <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                         <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse delay-75"></span>
                         <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse delay-150"></span>
                    </div>
                 </div>
            </div>

            {/* HEADER */}
            <header className="glass-card pt-4 pb-2 px-6 shrink-0 z-40 relative shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <button onClick={() => navigate(Page.HOME)} className="w-10 h-10 rounded-full bg-slate-100/50 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Passo {currentStep + 1} de {steps.length}</span>
                        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <span className={`material-symbols-outlined text-lg ${theme.text}`}>{steps[currentStep].icon}</span>
                            {steps[currentStep].title}
                        </h2>
                    </div>
                    <div className="w-10"></div>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${theme.bg} transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,0,0,0.2)]`} style={{ width: `${progressPercent}%` }}></div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth pb-32 relative">
                <div key={currentStep} className={`max-w-xl mx-auto ${animating ? 'step-exit' : 'step-enter'}`}>
                    
                    {/* STEP 0: IDENTITY */}
                    {currentStep === 0 && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block text-center">Escolha o Tema</label>
                                <div className="flex justify-center gap-4">
                                    {[
                                        { id: 'pink', color: 'bg-pink-500', ring: 'ring-pink-200' },
                                        { id: 'blue', color: 'bg-sky-500', ring: 'ring-sky-200' },
                                        { id: 'violet', color: 'bg-violet-500', ring: 'ring-violet-200' }
                                    ].map(opt => (
                                        <button 
                                            key={opt.id} 
                                            onClick={() => handleConfigChange('primaryColor', opt.id)} 
                                            className={`w-16 h-16 rounded-full ${opt.color} transition-all duration-300 transform ${currentConfig.primaryColor === opt.id ? `scale-110 ring-4 ring-offset-2 ${opt.ring} shadow-lg` : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                                        >
                                            {currentConfig.primaryColor === opt.id && <span className="material-symbols-outlined text-white text-2xl animate-pop-in">check</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Seu Nome Profissional</label>
                                    <input type="text" value={currentConfig.ownerName} onChange={e => handleConfigChange('ownerName', e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-slate-800 outline-none font-bold text-slate-800 transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Título / Cargo</label>
                                    <input type="text" value={currentConfig.professionTitle} onChange={e => handleConfigChange('professionTitle', e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-slate-800 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Frase de Destaque (Hero)</label>
                                    <input type="text" value={currentConfig.heroTitle} onChange={e => handleConfigChange('heroTitle', e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-slate-800 outline-none font-heading font-bold text-lg transition-all" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 1: BIO & CONTACT */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-4 mt-4 mb-2 block">Sua Biografia</label>
                                <textarea 
                                    value={currentConfig.heroBio} 
                                    onChange={e => handleConfigChange('heroBio', e.target.value)} 
                                    rows={6} 
                                    className="w-full p-4 rounded-[1.5rem] bg-slate-50 text-slate-700 leading-relaxed outline-none focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all resize-none text-base border-none" 
                                />
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
                                <label className="text-xs font-bold text-slate-400 uppercase block text-center">Dados de Contato</label>
                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-transparent focus-within:border-green-400 focus-within:bg-white transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                        <span className="material-symbols-outlined">chat</span>
                                    </div>
                                    <input type="tel" value={currentConfig.whatsapp} onChange={e => handleConfigChange('whatsapp', e.target.value)} className="flex-1 bg-transparent outline-none font-mono text-slate-700" placeholder="WhatsApp" />
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <input type="email" value={currentConfig.email} onChange={e => handleConfigChange('email', e.target.value)} className="flex-1 bg-transparent outline-none text-slate-700" placeholder="Email" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: AUDIENCE */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="bg-blue-50/50 p-4 rounded-2xl text-blue-800 text-sm flex gap-3 items-center border border-blue-100">
                                <span className="material-symbols-outlined">info</span>
                                <span>Selecione os públicos que aparecem no site.</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {currentConfig.audience.map(item => (
                                    <button 
                                        key={item.id}
                                        onClick={() => toggleAudience(item.id)}
                                        className={`p-5 rounded-[1.5rem] border-2 text-left transition-all duration-300 relative overflow-hidden group active:scale-95 ${item.active ? `border-slate-800 bg-slate-800 text-white shadow-xl` : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'}`}
                                    >
                                        <div className="flex justify-between items-start mb-3 relative z-10">
                                            <span className={`material-symbols-outlined text-3xl transition-transform group-hover:scale-110`}>{item.icon}</span>
                                            {item.active ? 
                                                <span className="material-symbols-outlined text-green-400 animate-pop-in">check_circle</span> : 
                                                <span className="material-symbols-outlined text-slate-200">radio_button_unchecked</span>
                                            }
                                        </div>
                                        <h4 className="font-bold text-sm relative z-10">{item.title}</h4>
                                        {item.active && <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: SERVICES */}
                    {currentStep === 3 && (
                        <div className="h-full">
                            {!isEditingService ? (
                                <div className="space-y-4">
                                    <button 
                                        onClick={() => { setServiceForm({ id: Date.now().toString(), title: '', desc: '', icon: 'psychology', img: '', category: 'general' }); setIsEditingService(true); setEditingId(null); }} 
                                        className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all hover:shadow-slate-500/20"
                                    >
                                        <span className="material-symbols-outlined">add_circle</span> Adicionar Novo Serviço
                                    </button>
                                    
                                    <div className="space-y-3">
                                        {services.map(s => (
                                            <div key={s.id} onClick={() => handleEditService(s)} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:border-pink-200 hover:shadow-md transition-all group relative overflow-hidden">
                                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-slate-200 to-transparent group-hover:via-pink-400 transition-all"></div>
                                                <div className="w-14 h-14 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 relative group-hover:scale-105 transition-transform">
                                                    {s.img ? <img src={s.img} className="w-full h-full object-cover" /> : <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-slate-300">image</span>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-slate-800 text-sm truncate">{s.title}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`w-2 h-2 rounded-full ${s.category === 'emotional' ? 'bg-pink-500' : s.category === 'learning' ? 'bg-orange-500' : s.category === 'focus' ? 'bg-violet-500' : s.category === 'career' ? 'bg-sky-500' : 'bg-slate-400'}`}></span>
                                                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">{s.category}</p>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-slate-300 group-hover:text-pink-500 transition-colors">edit</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-2xl space-y-6 animate-slide-up relative z-20">
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                            {editingId ? <span className="material-symbols-outlined text-pink-500">edit</span> : <span className="material-symbols-outlined text-green-500">add</span>}
                                            {editingId ? 'Editar Serviço' : 'Criar Serviço'}
                                        </h3>
                                        <button onClick={() => setIsEditingService(false)} className="px-4 py-2 bg-slate-50 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancelar</button>
                                    </div>
                                    
                                    {/* Cover Image Input */}
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Imagem de Capa</label>
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 bg-white rounded-xl shrink-0 border border-slate-200 overflow-hidden shadow-sm">
                                                {serviceForm.img ? <img src={serviceForm.img} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-slate-300">image</span></div>}
                                            </div>
                                            <textarea value={serviceForm.img} onChange={e => setServiceForm({...serviceForm, img: e.target.value})} className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-xs outline-none resize-none focus:border-slate-400 transition-colors" placeholder="Cole o link da imagem (URL) aqui..." rows={3}></textarea>
                                        </div>
                                    </div>

                                    {/* Info Inputs */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Título</label>
                                            <input value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} placeholder="Ex: Psicoterapia Infantil" className="w-full p-4 border border-slate-200 rounded-2xl text-base bg-white focus:border-slate-800 outline-none font-bold shadow-sm transition-colors" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Descrição</label>
                                            <textarea value={serviceForm.desc} onChange={e => setServiceForm({...serviceForm, desc: e.target.value})} rows={3} placeholder="Breve descrição do serviço..." className="w-full p-4 border border-slate-200 rounded-2xl text-sm bg-white focus:border-slate-800 outline-none resize-none shadow-sm transition-colors" />
                                        </div>
                                    </div>

                                    {/* Category Select */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Categoria (Cor)</label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { id: 'emotional', label: 'Emocional', bg: 'bg-pink-100 text-pink-700 border-pink-200' },
                                                { id: 'learning', label: 'Aprendizado', bg: 'bg-orange-100 text-orange-700 border-orange-200' },
                                                { id: 'focus', label: 'Foco/TDAH', bg: 'bg-violet-100 text-violet-700 border-violet-200' },
                                                { id: 'career', label: 'Carreira', bg: 'bg-sky-100 text-sky-700 border-sky-200' },
                                                { id: 'general', label: 'Geral', bg: 'bg-slate-100 text-slate-700 border-slate-200' }
                                            ].map(cat => (
                                                <button 
                                                    key={cat.id} 
                                                    onClick={() => setServiceForm({...serviceForm, category: cat.id as any})}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${serviceForm.category === cat.id ? 'bg-slate-800 text-white border-slate-800 shadow-lg scale-105' : `${cat.bg} opacity-60 hover:opacity-100`}`}
                                                >
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Link Select */}
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Página de Destino (Link)</label>
                                        <select 
                                            value={serviceForm.pageRoute || ''} 
                                            onChange={e => setServiceForm({...serviceForm, pageRoute: e.target.value ? e.target.value as Page : undefined})}
                                            className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer"
                                        >
                                            <option value="">Apenas Agendamento (Padrão)</option>
                                            <option value={Page.PSYCHOANALYSIS}>Pág. Psicanálise</option>
                                            <option value={Page.PSYCHOPEDAGOGY}>Pág. Psicopedagogia</option>
                                            <option value={Page.VOCATIONAL}>Pág. Carreira</option>
                                            <option value={Page.IRLEN}>Pág. Irlen</option>
                                            <option value={Page.ADHD}>Pág. TDAH</option>
                                            <option value={Page.FLORALS}>Pág. Florais</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button onClick={handleSaveService} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-black transition-all active:scale-95">
                                            Salvar Alterações
                                        </button>
                                        {editingId && (
                                            <button onClick={async () => { 
                                                if(confirm('Remover este serviço?')) { 
                                                    // 1. Atualiza visualmente
                                                    onUpdateServices(services.filter(s => s.id !== editingId)); 
                                                    setIsEditingService(false);
                                                    
                                                    // 2. Remove do Backend
                                                    if(editingId) {
                                                        try {
                                                            await fetch(`${API_BASE_URL}/services?id=${editingId}`, { method: 'DELETE' });
                                                        } catch(e) { console.error("Erro ao deletar", e); }
                                                    }
                                                }
                                            }} className="px-5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 4: APPOINTMENT */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-6xl">chat</span></div>
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-4 block">Mensagem de Boas-Vindas (Chat)</label>
                                
                                <div className="flex gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-md">
                                         <img src="https://santanamendes.com.br/Sonia/Sonia_d0_img0.png" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none text-sm text-slate-600 shadow-sm max-w-[85%] relative">
                                        <div className="absolute -left-2 top-0 w-4 h-4 bg-slate-100 transform rotate-45"></div>
                                        {welcomeMessage.split('\n').map((line, i) => <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>)}
                                    </div>
                                </div>

                                <textarea 
                                    value={welcomeMessage} 
                                    onChange={e => setWelcomeMessage(e.target.value)} 
                                    className="w-full p-4 border-2 border-slate-100 rounded-2xl text-sm bg-white focus:border-slate-800 outline-none resize-none transition-colors"
                                    rows={3}
                                    placeholder="Digite a mensagem aqui..."
                                />
                                <p className="text-[10px] text-slate-400 mt-2 px-1 text-center">Essa mensagem aparece automaticamente quando o cliente abre a tela de agendamento.</p>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: LOCATIONS */}
                    {currentStep === 5 && (
                        <div className="space-y-4">
                             {currentConfig.locations.map(loc => (
                                <div key={loc.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined">location_on</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{loc.title}</h4>
                                            <p className="text-xs text-slate-500">{loc.city} - {loc.state}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => onUpdateConfig({ ...currentConfig, locations: currentConfig.locations.filter(l => l.id !== loc.id) })} className="w-10 h-10 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-full transition-colors">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            ))}
                            
                            <button onClick={() => setIsAddingLocation(true)} className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-400 rounded-[2rem] font-bold text-sm hover:bg-white hover:border-slate-500 hover:text-slate-600 transition-all">
                                + Adicionar Endereço
                            </button>
                            
                            {/* Modal Location */}
                            {isAddingLocation && (
                                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] flex items-center justify-center p-6 animate-fade-in">
                                    <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl w-full max-w-sm animate-pop-in space-y-4 relative">
                                        <div className="text-center">
                                            <h3 className="font-bold text-lg text-slate-800">Novo Endereço</h3>
                                            <p className="text-xs text-slate-400">Preencha os dados do local.</p>
                                        </div>
                                        <input value={locationForm.title} onChange={e => setLocationForm({...locationForm, title: e.target.value})} placeholder="Nome (ex: Consultório Centro)" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all" />
                                        <div className="flex gap-2">
                                            <input value={locationForm.cep} onChange={e => setLocationForm({...locationForm, cep: e.target.value})} onBlur={e => fetchCep(e.target.value)} placeholder="CEP" className="w-28 p-4 bg-slate-50 rounded-2xl text-sm outline-none" />
                                            <input value={locationForm.number} onChange={e => setLocationForm({...locationForm, number: e.target.value})} placeholder="Nº" className="flex-1 p-4 bg-slate-50 rounded-2xl text-sm outline-none" />
                                        </div>
                                        <input value={locationForm.address} placeholder="Endereço (Auto)" readOnly className="w-full p-4 bg-slate-100 rounded-2xl text-xs text-slate-500" />
                                        <div className="flex gap-2 pt-2">
                                            <button onClick={() => setIsAddingLocation(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                                            <button onClick={handleSaveLocation} disabled={!locationForm.title} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg disabled:opacity-50">Salvar</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 6: EXTRAS */}
                    {currentStep === 6 && (
                         <div className="space-y-3">
                            {[
                                { k: 'floatingWhatsapp', l: 'Botão WhatsApp Flutuante', i: 'chat' },
                                { k: 'ambientSound', l: 'Player de Música Ambiente', i: 'music_note' },
                                { k: 'accessibility', l: 'Barra de Acessibilidade', i: 'accessibility_new' },
                                { k: 'testimonials', l: 'Seção de Depoimentos', i: 'format_quote' },
                                { k: 'blog', l: 'Seção de Artigos/Blog', i: 'newspaper' }
                            ].map(f => {
                                const isActive = currentConfig.features[f.k as keyof typeof currentConfig.features];
                                return (
                                    <button 
                                        key={f.k} 
                                        onClick={() => toggleFeature(f.k as any)} 
                                        className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border transition-all duration-300 ${isActive ? 'bg-white border-green-300 shadow-md' : 'bg-slate-50 border-transparent opacity-60'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                                                 <span className="material-symbols-outlined">{f.i}</span>
                                            </div>
                                            <span className={`font-bold text-sm ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{f.l}</span>
                                        </div>
                                        <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${isActive ? 'bg-green-500' : 'bg-slate-300'}`}>
                                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${isActive ? 'translate-x-7' : 'translate-x-1'}`}></div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* STEP 7: FINISH */}
                    {currentStep === 7 && (
                        <div className="text-center py-10 space-y-8">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                                <div className="w-32 h-32 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl relative z-10 mx-auto animate-pop-in">
                                    <span className="material-symbols-outlined text-6xl">check_circle</span>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <h2 className="text-3xl font-heading font-bold text-slate-800">Site Atualizado!</h2>
                                <p className="text-slate-500 max-w-xs mx-auto">Todas as suas configurações foram salvas e já estão visíveis.</p>
                            </div>

                            <button onClick={() => navigate(Page.HOME)} className={`w-full py-5 ${theme.bg} text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-pink-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2`}>
                                <span className="material-symbols-outlined">visibility</span>
                                Ver Site Online
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* FOOTER NAV */}
            {currentStep < 7 && (
                <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-white via-white to-transparent pointer-events-none z-50">
                    <div className="bg-slate-900 text-white p-2 rounded-[2.5rem] shadow-2xl flex justify-between pointer-events-auto max-w-xl mx-auto backdrop-blur-md bg-opacity-90">
                         <button 
                            onClick={() => changeStep('prev')} 
                            disabled={currentStep === 0}
                            className="w-14 h-14 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <button 
                            onClick={() => changeStep('next')} 
                            className="flex-1 font-bold text-lg flex items-center justify-center gap-2 pr-4"
                        >
                            {currentStep === 6 ? 'Finalizar' : 'Continuar'} <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Editor;
