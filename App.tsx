import React, { useState, useEffect, useRef } from 'react';
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

// --- Função Auxiliar para Salvar ---
const saveData = async (endpoint: string, data: any) => {
    try {
        await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        // console.log('Salvo com sucesso:', endpoint);
    } catch (error) {
        console.error('Erro ao salvar em:', endpoint, error);
    }
};

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
  pageRoute?: Page; 
}

export interface LocationItem {
  id: string;
  title: string; 
  cep: string;
  address: string;
  district: string;
  city: string;
  state: string;
  number: string;
}

export interface SiteFeatures {
    floatingWhatsapp: boolean;
    ambientSound: boolean;
    accessibility: boolean;
    testimonials: boolean;
    blog: boolean;
}

export interface AudienceItem {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  icon: string;
  color: string;
  bg: string;
  active: boolean;
}

export interface SiteConfig {
  ownerName: string;
  professionTitle: string;
  heroTitle: string; 
  heroBio: string;
  whatsapp: string;
  email: string; 
  primaryColor: string;
  locations: LocationItem[];
  galleryImages: string[];
  features: SiteFeatures;
  audience: AudienceItem[];
}

// --- Componentes das Funcionalidades ---

const FloatingWhatsapp = ({ number }: { number: string }) => (
    <a 
        href={`https://wa.me/${number}`} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform animate-bounce-slow"
        style={{ animationDuration: '3s' }}
    >
        <span className="material-symbols-outlined text-3xl">chat</span>
    </a>
);

const AmbientPlayer = () => {
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggle = () => {
        if(!audioRef.current) {
            audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=forest-lullaby-110624.mp3');
            audioRef.current.loop = true;
            audioRef.current.volume = 0.3;
        }
        
        if(playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        }
        setPlaying(!playing);
    }

    return (
        <button 
            onClick={toggle}
            className={`fixed bottom-24 left-4 md:bottom-8 md:left-8 z-50 p-3 rounded-full shadow-lg backdrop-blur-md border border-white/20 transition-all ${playing ? 'bg-pink-500 text-white' : 'bg-white/80 text-slate-600'}`}
        >
            <span className="material-symbols-outlined text-xl">{playing ? 'volume_up' : 'music_off'}</span>
        </button>
    );
}

const AccessibilityWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);

    const handleZoom = (val: number) => {
        const newSize = fontSize + val;
        setFontSize(newSize);
        document.documentElement.style.fontSize = `${(newSize / 100) * 16}px`;
    }

    return (
        <div className="fixed top-24 right-0 z-40 flex items-start">
             <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-slate-800 text-white p-2 rounded-l-xl shadow-md hover:bg-slate-700"
            >
                <span className="material-symbols-outlined">accessibility_new</span>
            </button>
            {isOpen && (
                <div className="bg-slate-800 p-2 rounded-bl-xl shadow-md flex flex-col gap-2 animate-fade-in mr-2">
                    <button onClick={() => handleZoom(10)} className="bg-white/10 text-white p-2 rounded hover:bg-white/20" title="Aumentar Fonte">A+</button>
                    <button onClick={() => handleZoom(-10)} className="bg-white/10 text-white p-2 rounded hover:bg-white/20" title="Diminuir Fonte">A-</button>
                    <button onClick={() => {document.documentElement.classList.toggle('grayscale')}} className="bg-white/10 text-white p-2 rounded hover:bg-white/20" title="Alto Contraste">
                        <span className="material-symbols-outlined text-sm">contrast</span>
                    </button>
                </div>
            )}
        </div>
    )
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.EDITOR);
  const [overlayColor, setOverlayColor] = useState('transparent');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Serviços Iniciais Padrão (Serão sobrescritos pelo fetch se houver dados no banco)
  const [services, setServices] = useState<ServiceItem[]>([
    {
        id: 'psicanalise',
        title: 'Psicanálise Clínica',
        desc: 'Um mergulho no inconsciente para compreender os conflitos com as angústias, traumas e padrões de repetição.',
        icon: 'psychology_alt',
        img: 'https://santanamendes.com.br/Sonia/Sonia_d0_img1.png',
        category: 'emotional',
        pageRoute: Page.PSYCHOANALYSIS
    },
    {
        id: 'psicopedagogia',
        title: 'Psicopedagogia',
        desc: 'Avaliação e intervenção nas dificuldades de aprendizagem e barreiras cognitivas.',
        icon: 'extension',
        img: 'https://santanamendes.com.br/Sonia/Sonia_d0_img2.png',
        category: 'learning',
        pageRoute: Page.PSYCHOPEDAGOGY
    },
    {
        id: 'irlen',
        title: 'Síndrome de Irlen',
        desc: 'Rastreio de estresse visual e distorções na leitura com aplicação de filtros espectrais.',
        icon: 'visibility',
        img: 'https://santanamendes.com.br/Sonia/Sonia_d0_img8.png',
        category: 'focus',
        pageRoute: Page.IRLEN
    },
    {
        id: 'carreira',
        title: 'Orientação Profissional',
        desc: 'Auxílio na escolha da primeira carreira ou transição profissional para adultos.',
        icon: 'explore',
        img: 'https://santanamendes.com.br/Sonia/Sonia_d3_img0.png',
        category: 'career',
        pageRoute: Page.VOCATIONAL
    },
    {
        id: 'tdah',
        title: 'TDAH e Neurodivergência',
        desc: 'Acolhimento e estratégias para lidar com o déficit de atenção e hiperatividade em crianças e adultos.',
        icon: 'bolt',
        img: 'https://santanamendes.com.br/Sonia/Sonia_d5_img0.png',
        category: 'focus',
        pageRoute: Page.ADHD
    },
    {
        id: 'florals',
        title: 'Terapia Floral',
        desc: 'Equilíbrio das emoções através das essências florais de Bach para ansiedade e medos.',
        icon: 'local_florist',
        img: 'https://santanamendes.com.br/Sonia/Sonia_d6_img0.png',
        category: 'emotional',
        pageRoute: Page.FLORALS
    }
  ]);

  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    ownerName: "Sônia Andrade",
    professionTitle: "Psicanalista e Psicopedagoga",
    heroTitle: "Sônia Andrade", 
    heroBio: "Um espaço de acolhimento e escuta qualificada. Como especialista em desenvolvimento humano, estou pronta para te ajudar a florescer.",
    whatsapp: "5521992717217",
    email: "soniarosa.psi@email.com",
    primaryColor: "pink",
    locations: [
      {
        id: '1',
        title: 'Unidade Miguel Pereira',
        cep: '26900-000',
        address: 'Rua Principal',
        number: '123',
        district: 'Centro',
        city: 'Miguel Pereira',
        state: 'RJ'
      },
      {
        id: '2',
        title: 'Unidade Ilha do Governador',
        cep: '21931-000',
        address: 'Estrada do Galeão',
        number: '800',
        district: 'Jardim Guanabara',
        city: 'Rio de Janeiro',
        state: 'RJ'
      }
    ],
    galleryImages: [
        "https://soniarsandrade.com.br/wp-content/uploads/2021/08/1.jpeg",
        "https://soniarsandrade.com.br/wp-content/uploads/2021/08/2.jpeg",
        "https://soniarsandrade.com.br/wp-content/uploads/2021/08/3.jpeg",
        "https://soniarsandrade.com.br/wp-content/uploads/2021/08/3.jpeg"
    ],
    features: {
        floatingWhatsapp: true,
        ambientSound: false,
        accessibility: false,
        testimonials: true,
        blog: true
    },
    audience: [
        {
            id: 'child',
            title: "Crianças e Adolescentes",
            icon: "child_care",
            desc: "Acompanhamento focado em dificuldades escolares, alfabetização, distúrbios de atenção e desenvolvimento emocional infantil.",
            tags: ["TDAH", "Dislexia", "Baixo Rendimento", "Timidez"],
            color: "text-blue-600",
            bg: "bg-blue-50",
            active: true
        },
        {
            id: 'self',
            title: "Adultos",
            icon: "face_4",
            desc: "Tratamento de questões emocionais, ansiedade, depressão e orientação de carreira para quem busca novos caminhos profissionais.",
            tags: ["Ansiedade", "Carreira", "Luto", "Autoconhecimento"],
            color: "text-pink-600",
            bg: "bg-pink-50",
            active: true
        },
        {
            id: 'elder',
            title: "Terceira Idade",
            icon: "elderly",
            desc: "Estímulo cognitivo para prevenir o declínio da memória e acolhimento emocional para as transformações dessa fase da vida.",
            tags: ["Memória", "Foco", "Socialização", "Bem-estar"],
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            active: true
        },
        {
            id: 'neuro',
            title: "Neurodiversidade",
            icon: "psychology",
            desc: "Atendimento especializado para pessoas com TDAH, Autismo (TEA) e Síndrome de Irlen, visando adaptação e qualidade de vida.",
            tags: ["TEA", "Irlen", "Processamento Visual", "Filtros"],
            color: "text-violet-600",
            bg: "bg-violet-50",
            active: true
        }
    ]
  });

  // --- 1. CARREGAR DADOS DO BANCO AO INICIAR ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            // Carrega Configuração Geral
            const resConfig = await fetch(`${API_BASE_URL}/config`);
            if (resConfig.ok) {
                const dataConfig = await resConfig.json();
                if (dataConfig && Object.keys(dataConfig).length > 0) {
                    setSiteConfig(prev => ({ ...prev, ...dataConfig }));
                }
            }

            // Carrega Serviços
            const resServices = await fetch(`${API_BASE_URL}/services`);
            if (resServices.ok) {
                const dataServices = await resServices.json();
                if (Array.isArray(dataServices) && dataServices.length > 0) {
                    setServices(dataServices);
                }
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    };
    fetchData();
  }, []);

  // --- 2. SALVAMENTO AUTOMÁTICO DA CONFIGURAÇÃO ---
  useEffect(() => {
    const timer = setTimeout(() => {
        if (siteConfig.ownerName) { 
            saveData('/config', siteConfig);
        }
    }, 1500); // Aguarda 1.5s após a última digitação para salvar

    return () => clearTimeout(timer);
  }, [siteConfig]);

  // --- 3. SALVAMENTO AUTOMÁTICO DOS SERVIÇOS ---
  useEffect(() => {
      const timer = setTimeout(() => {
          // Salva/Atualiza cada serviço da lista
          services.forEach(svc => saveData('/services', svc));
      }, 2000);
      return () => clearTimeout(timer);
  }, [services]);


  const navigate = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Home navigate={navigate} profile={profile} config={siteConfig} services={services} />;
      case Page.JOURNEY:
        return <PersonalizedJourney navigate={navigate} profile={profile} />;
      case Page.PSYCHOANALYSIS:
        return <Psychoanalysis navigate={navigate} />;
      case Page.PSYCHOPEDAGOGY:
        return <Psychopedagogy navigate={navigate} />;
      case Page.VOCATIONAL:
        return <Vocational navigate={navigate} />;
      case Page.IRLEN:
        return <Irlen navigate={navigate} setOverlayColor={setOverlayColor} />;
      case Page.ADHD:
        return <Adhd navigate={navigate} />;
      case Page.FLORALS:
        return <Florals navigate={navigate} />;
      case Page.APPOINTMENT:
        return <Appointment navigate={navigate} initialName={profile?.name} config={siteConfig} />;
      case Page.SERVICES:
        return <Services navigate={navigate} filter={profile?.need} services={services} config={siteConfig} />;
      case Page.AUDIENCE:
        return <Audience navigate={navigate} filter={profile?.target} config={siteConfig} />;
      case Page.CONTACT:
        return <Contact navigate={navigate} config={siteConfig} />;
      case Page.EDITOR:
        return (
          <Editor 
            navigate={navigate} 
            currentConfig={siteConfig} 
            onUpdateConfig={setSiteConfig}
            services={services}
            onUpdateServices={setServices}
          />
        );
      default:
        return <Home navigate={navigate} profile={profile} config={siteConfig} services={services} />;
    }
  };

  const isMainApp = currentPage !== Page.EDITOR;

  return (
    <div className={`font-sans antialiased text-slate-700 bg-white min-h-screen flex flex-col relative pb-24 md:pb-0 theme-${siteConfig.primaryColor}`}>
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          pointerEvents: 'none', 
          zIndex: 40, 
          mixBlendMode: 'multiply', 
          transition: 'background-color 0.3s ease',
          backgroundColor: overlayColor
        }} 
      />

      <style>{`
        :root { font-size: 16px; }
        @media (min-width: 768px) { :root { font-size: 18px; } }
        body { -webkit-tap-highlight-color: transparent; scroll-behavior: smooth; }
        .font-heading { font-family: 'Playfair Display', serif; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .bg-mesh { background-image: radial-gradient(at 0% 0%, hsla(339, 49%, 91%, 1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225, 39%, 95%, 1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339, 49%, 91%, 1) 0, transparent 50%); }
        
        /* Dynamic Theme Colors */
        .theme-pink .accent-bg { background-color: #db2777; }
        .theme-pink .accent-text { color: #db2777; }
        .theme-blue .accent-bg { background-color: #0284c7; }
        .theme-blue .accent-text { color: #0284c7; }
        .theme-violet .accent-bg { background-color: #7c3aed; }
        .theme-violet .accent-text { color: #7c3aed; }
      `}</style>

      {/* Render Optional Features */}
      {isMainApp && siteConfig.features.floatingWhatsapp && <FloatingWhatsapp number={siteConfig.whatsapp} />}
      {isMainApp && siteConfig.features.ambientSound && <AmbientPlayer />}
      {isMainApp && siteConfig.features.accessibility && <AccessibilityWidget />}

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
