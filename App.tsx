import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Psychoanalysis from './pages/Psychoanalysis';
import Psychopedagogy from './pages/Psychopedagogy';
import Vocational from './pages/Vocational';
import Irlen from './pages/Irlen';
import Adhd from './pages/Adhd';
import Florals from './pages/Florals';
import Appointment from './pages/Appointment';
import Services from './pages/Services';
import Audience from './pages/Audience';
import Contact from './pages/Contact';
import Editor from './pages/Editor';
import PersonalizedJourney from './pages/PersonalizedJourney';

// --- CONFIGURAÇÃO DA API ---
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://sonia-final-backend.alex-s-mendes.workers.dev/api' 
  : 'http://localhost:8787/api';

export enum Page {
  HOME = 'home',
  PSYCHOANALYSIS = 'psychoanalysis',
  PSYCHOPEDAGOGY = 'psychopedagogy',
  VOCATIONAL = 'vocational',
  IRLEN = 'irlen',
  ADHD = 'adhd',
  FLORALS = 'florals',
  APPOINTMENT = 'appointment',
  SERVICES = 'services',
  AUDIENCE = 'audience',
  CONTACT = 'contact',
  EDITOR = 'editor',
  JOURNEY = 'journey'
}

export interface UserProfile {
  name: string;
  target: 'self' | 'child' | 'elder';
  need: 'emotional' | 'learning' | 'career' | 'focus' | 'general';
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  img: string;
  category: 'emotional' | 'learning' | 'focus' | 'career' | 'general';
}

export interface SiteConfig {
  ownerName: string;
  professionTitle: string;
  heroBio: string;
  whatsapp: string;
  primaryColor: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.EDITOR); // Começa no Editor para facilitar testes
  const [overlayColor, setOverlayColor] = useState('transparent');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Estados com dados padrão
  const [services, setServices] = useState<ServiceItem[]>([
    { id: 'loading', title: 'Carregando...', desc: 'Buscando informações...', icon: 'sync', img: '', category: 'general' }
  ]);

  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    ownerName: "Carregando...",
    professionTitle: "...",
    heroBio: "...",
    whatsapp: "",
    primaryColor: "pink"
  });

  // --- 1. CARREGAR DADOS ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            console.log("Conectando em:", API_BASE_URL);
            
            // Configurações
            const configRes = await fetch(`${API_BASE_URL}/config`);
            if (configRes.ok) {
                const configData = await configRes.json();
                setSiteConfig(configData);
            }

            // Serviços
            const servicesRes = await fetch(`${API_BASE_URL}/services`);
            if (servicesRes.ok) {
                const servicesData = await servicesRes.json();
                setServices(Array.isArray(servicesData) ? servicesData : []);
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    };
    fetchData();
  }, []);

  // --- 2. SALVAR CONFIGURAÇÃO ---
  const handleUpdateConfig = async (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
    try {
        await fetch(`${API_BASE_URL}/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newConfig)
        });
    } catch (e) {
        console.error("Erro ao salvar config:", e);
    }
  };

  // --- 3. SALVAR SERVIÇO ---
  const handleSaveService = async (service: ServiceItem) => {
    setServices(prev => {
        const index = prev.findIndex(s => s.id === service.id);
        if (index >= 0) {
            const newList = [...prev];
            newList[index] = service;
            return newList;
        }
        return [...prev, service];
    });

    try {
        await fetch(`${API_BASE_URL}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(service)
        });
    } catch (e) {
        console.error("Erro ao salvar serviço:", e);
    }
  };

  // --- 4. DELETAR SERVIÇO ---
  const handleDeleteService = async (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    try {
        await fetch(`${API_BASE_URL}/services?id=${id}`, { method: 'DELETE' });
    } catch (e) {
        console.error("Erro ao deletar:", e);
    }
  };

  const navigate = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME: return <Home navigate={navigate} profile={profile} config={siteConfig} services={services} />;
      case Page.JOURNEY: return <PersonalizedJourney navigate={navigate} profile={profile} />;
      case Page.PSYCHOANALYSIS: return <Psychoanalysis navigate={navigate} />;
      case Page.PSYCHOPEDAGOGY: return <Psychopedagogy navigate={navigate} />;
      case Page.VOCATIONAL: return <Vocational navigate={navigate} />;
      case Page.IRLEN: return <Irlen navigate={navigate} setOverlayColor={setOverlayColor} />;
      case Page.ADHD: return <Adhd navigate={navigate} />;
      case Page.FLORALS: return <Florals navigate={navigate} />;
      case Page.APPOINTMENT: return <Appointment navigate={navigate} initialName={profile?.name} config={siteConfig} />;
      case Page.SERVICES: return <Services navigate={navigate} filter={profile?.need} services={services} config={siteConfig} />;
      case Page.AUDIENCE: return <Audience navigate={navigate} filter={profile?.target} />;
      case Page.CONTACT: return <Contact navigate={navigate} />;
      case Page.EDITOR:
        return (
          <Editor 
            navigate={navigate} 
            currentConfig={siteConfig} 
            onUpdateConfig={handleUpdateConfig}
            services={services}
            onSaveService={handleSaveService}
            onDeleteService={handleDeleteService}
          />
        );
      default: return <Home navigate={navigate} profile={profile} config={siteConfig} services={services} />;
    }
  };

  const isMainApp = currentPage !== Page.EDITOR;

  return (
    <div className={`font-sans antialiased text-slate-700 bg-white min-h-screen flex flex-col relative pb-20 md:pb-0 theme-${siteConfig.primaryColor}`}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 40, mixBlendMode: 'multiply', transition: 'background-color 0.3s ease', backgroundColor: overlayColor }} />

      <style>{`
        :root { font-size: 16px; }
        @media (min-width: 768px) { :root { font-size: 18px; } }
        body { -webkit-tap-highlight-color: transparent; scroll-behavior: smooth; }
        .font-heading { font-family: 'Playfair Display', serif; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        /* Dynamic Theme Colors */
        .theme-pink .accent-bg { background-color: #db2777; } .theme-pink .accent-text { color: #db2777; }
        .theme-blue .accent-bg { background-color: #0284c7; } .theme-blue .accent-text { color: #0284c7; }
        .theme-violet .accent-bg { background-color: #7c3aed; } .theme-violet .accent-text { color: #7c3aed; }
      `}</style>

      {isMainApp && (
        <div className="lg:hidden p-4 bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-50 flex justify-between items-center">
           <div className={`flex items-center gap-2 font-heading font-bold text-xl theme-${siteConfig.primaryColor} accent-text`}>
              <span className="material-symbols-outlined font-bold" onClick={() => navigate(Page.HOME)}>psychology</span>
              <span onClick={() => navigate(Page.HOME)}>{siteConfig.ownerName.split(' ')[0]}</span>
           </div>
        </div>
      )}

      <main className="flex-grow">
        {renderPage()}
      </main>

      {isMainApp && (
        <>
          <Footer navigate={navigate} />
          <BottomNav navigate={navigate} currentPage={currentPage} />
        </>
      )}
    </div>
  );
};

export default App;