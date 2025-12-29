
import React, { useRef } from 'react';
import { Page, UserProfile, SiteConfig, ServiceItem } from '../App';

interface HomeProps {
  navigate: (page: Page) => void;
  profile: UserProfile | null;
  config: SiteConfig;
  services: ServiceItem[];
}

const Home: React.FC<HomeProps> = ({ navigate, profile, config, services }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Helper to get theme-based classes
  const getThemeClasses = () => {
     switch(config.primaryColor) {
         case 'blue': return { bg: 'bg-sky-50', text: 'text-sky-600', btn: 'bg-sky-600 hover:bg-sky-700', lightBtn: 'bg-sky-100 text-sky-700', border: 'border-sky-200' };
         case 'violet': return { bg: 'bg-violet-50', text: 'text-violet-600', btn: 'bg-violet-600 hover:bg-violet-700', lightBtn: 'bg-violet-100 text-violet-700', border: 'border-violet-200' };
         default: return { bg: 'bg-pink-50', text: 'text-pink-600', btn: 'bg-pink-600 hover:bg-pink-700', lightBtn: 'bg-pink-100 text-pink-700', border: 'border-pink-200' };
     }
  };
  
  const theme = getThemeClasses();

  return (
    <div className="animate-fade-in flex flex-col gap-8 lg:gap-24">
      {/* Hero Dinâmico */}
      <header className={`min-h-[65vh] md:min-h-[80vh] flex items-center relative overflow-hidden transition-all duration-1000 ${theme.bg}`}>
        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            <div className="w-full flex justify-center lg:order-2">
              <div className="relative w-48 h-48 md:w-80 md:h-80 lg:w-full lg:h-auto">
                <div className="absolute inset-0 bg-white/50 blur-3xl opacity-40 rounded-full animate-pulse"></div>
                <img 
                    alt={config.ownerName} 
                    className="relative w-full h-full lg:w-full lg:h-auto rounded-full lg:rounded-[3rem] shadow-2xl border-4 md:border-8 border-white object-cover aspect-square" 
                    src="https://santanamendes.com.br/Sonia/Sonia_d0_img0.png" 
                />
              </div>
            </div>

            <div className="space-y-4 md:space-y-6 text-center lg:text-left lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-md text-slate-600 rounded-full text-[10px] font-bold tracking-widest uppercase border border-white shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Bem-vindo(a), {profile?.name.split(' ')[0] || 'Visitante'}
              </div>
              
              <h1 className="text-3xl md:text-6xl font-heading font-bold text-slate-800 leading-[1.1]">
                {config.ownerName}
                <br /> 
                <span className={`${theme.text} italic text-xl md:text-4xl block mt-2`}>{config.professionTitle}</span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {config.heroBio}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                <button 
                    onClick={() => navigate(Page.APPOINTMENT)}
                    className={`px-8 py-4 md:py-5 text-white rounded-2xl transition-all shadow-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 ${theme.btn}`}
                >
                  <span className="material-symbols-outlined">calendar_month</span>
                  Marcar Atendimento
                </button>
                {profile && (
                  <button 
                      onClick={() => navigate(Page.JOURNEY)}
                      className="px-8 py-4 md:py-5 bg-white text-slate-800 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-bold text-base md:text-lg flex items-center justify-center gap-2"
                  >
                    <span className={`material-symbols-outlined ${theme.text}`}>auto_awesome</span>
                    Meu Plano
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Grid Geral de Especialidades (Dynamic) */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-800">Minhas Especialidades</h2>
              <p className="text-slate-400 mt-2 text-sm md:text-base">Conheça o leque completo de atendimentos.</p>
            </div>
            <button onClick={() => navigate(Page.SERVICES)} className={`${theme.text} font-bold flex items-center gap-2 group text-sm md:text-base`}>
               Ver todos os serviços <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
          
          {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {services.map((s, i) => (
                  <div 
                      key={s.id}
                      onClick={() => navigate(s.pageRoute || Page.SERVICES)} 
                      className="bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg active:scale-[0.98] transition-all duration-500 cursor-pointer group"
                  >
                      <div className="h-40 md:h-48 overflow-hidden relative">
                         {s.img ? (
                            <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         ) : (
                            <div className={`w-full h-full ${theme.bg} flex items-center justify-center`}>
                                <span className={`material-symbols-outlined text-6xl ${theme.text}`}>{s.icon}</span>
                            </div>
                         )}
                      </div>
                      <div className="p-6 md:p-8">
                          <h3 className="font-bold text-lg md:text-xl text-slate-800 mb-2">{s.title}</h3>
                          <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3">{s.desc}</p>
                          <div className={`${theme.text} font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-1 group-hover:gap-3 transition-all`}>
                              Ver detalhes <span className="material-symbols-outlined text-sm">east</span>
                          </div>
                      </div>
                  </div>
                ))}
              </div>
          ) : (
              <div className="text-center py-12 text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2">grid_off</span>
                  <p>Nenhum serviço cadastrado ainda.</p>
              </div>
          )}
        </div>
      </section>

      {/* Feature: Testimonials (Conditional) */}
      {config.features.testimonials && (
          <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black"></div>
            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-10 md:mb-16">O que dizem os pacientes</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { text: "A Sônia tem uma sensibilidade incrível. O tratamento para TDAH mudou a vida do meu filho na escola.", author: "Mariana S." },
                        { text: "Me senti acolhida desde o primeiro momento. A psicanálise me ajudou a entender padrões que eu repetia há anos.", author: "Carla T." },
                        { text: "A orientação vocacional foi certeira. Hoje me sinto realizada na minha nova profissão.", author: "Ana Paula R." }
                    ].map((t, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 relative">
                            <span className="material-symbols-outlined text-3xl md:text-4xl text-white/20 absolute top-4 left-4">format_quote</span>
                            <p className="text-slate-300 italic mb-6 relative z-10 text-sm md:text-base">"{t.text}"</p>
                            <p className="font-bold text-white text-xs md:text-sm text-right">- {t.author}</p>
                        </div>
                    ))}
                </div>
            </div>
          </section>
      )}

      {/* Feature: Blog/News (Conditional) */}
      {config.features.blog && (
          <section className="py-12 md:py-20 bg-white border-t border-slate-100">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-8 md:mb-10">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-800">Últimos Artigos</h2>
                    <button className={`${theme.text} text-xs md:text-sm font-bold uppercase`}>Ver Blog</button>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Como identificar TDAH em adultos?", cat: "Neurociência", date: "12 Out" },
                        { title: "A importância do luto não vivido", cat: "Psicanálise", date: "05 Set" },
                        { title: "Brincar é coisa séria: desenvolvimento infantil", cat: "Psicopedagogia", date: "28 Ago" }
                    ].map((post, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="h-40 md:h-48 bg-slate-100 rounded-2xl mb-4 overflow-hidden relative">
                                <div className={`absolute inset-0 ${theme.bg} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] md:text-xs mb-2">
                                <span className={`font-bold ${theme.text} uppercase`}>{post.cat}</span>
                                <span className="text-slate-400">• {post.date}</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors">{post.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
          </section>
      )}

      {/* Unidades & Mapa */}
      <section className="py-16 md:py-24 bg-white mb-8">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 mb-4">Onde me encontrar</h2>
              <p className="text-slate-500 text-sm md:text-base">Atendimento presencial em dois endereços estratégicos e atendimento online para todo o Brasil.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 md:mb-12">
                <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-50 text-pink-600 rounded-2xl md:rounded-3xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl md:text-3xl">location_on</span>
                    </div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-800">Miguel Pereira</h3>
                        <p className="text-slate-500 text-sm">Centro, Rio de Janeiro</p>
                        <p className="text-xs text-slate-400 mt-4 leading-relaxed italic">Ambiente acolhedor focado em terapias infantis e psicopedagogia.</p>
                    </div>
                </div>
                <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-blue-600 rounded-2xl md:rounded-3xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl md:text-3xl">location_on</span>
                    </div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-800">Ilha do Governador</h3>
                        <p className="text-slate-500 text-sm">Jardim Guanabara, Rio de Janeiro</p>
                        <p className="text-xs text-slate-400 mt-4 leading-relaxed italic">Consultório especializado em psicanálise clínica e orientação profissional.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
