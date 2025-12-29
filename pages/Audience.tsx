
import React from 'react';
import { Page, SiteConfig } from '../App';

interface Props {
  navigate: (page: Page) => void;
  filter?: 'self' | 'child' | 'elder';
  config: SiteConfig;
}

const Audience: React.FC<Props> = ({ navigate, filter, config }) => {
    // Only show active audience categories
    const categories = config.audience.filter(a => a.active);

    return (
        <div className="animate-fade-in bg-white min-h-screen pb-24">
            <header className="bg-slate-50 px-6 py-12 text-center">
                <h1 className="text-4xl font-heading font-bold text-slate-800 mb-4">Público Atendido</h1>
                <p className="text-slate-500 max-w-md mx-auto">
                    Acolhimento humanizado para cada fase do desenvolvimento humano.
                </p>
            </header>

            <div className="container mx-auto px-6 py-12 space-y-12">
                <div className="grid md:grid-cols-2 gap-8">
                    {categories.length > 0 ? categories.map((cat, i) => {
                        const isMatch = filter && cat.id === filter;

                        return (
                            <div 
                                key={i} 
                                className={`bg-white rounded-3xl border ${isMatch ? 'border-pink-300 ring-4 ring-pink-50' : 'border-slate-100'} shadow-sm p-8 flex flex-col items-center text-center relative transition-all duration-300`}
                            >
                                {isMatch && (
                                    <div className="absolute top-4 right-4 bg-pink-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                                        Seu perfil de busca
                                    </div>
                                )}
                                <div className={`${cat.bg} ${cat.color} w-20 h-20 rounded-full flex items-center justify-center mb-6`}>
                                    <span className="material-symbols-outlined text-4xl">{cat.icon}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">{cat.title}</h2>
                                <p className="text-slate-600 mb-8 leading-relaxed">
                                    {cat.desc}
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {cat.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full uppercase">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="col-span-2 text-center text-slate-400 py-12">
                            Nenhum público configurado.
                        </div>
                    )}
                </div>

                {/* Focus Area */}
                <div className="bg-pink-600 rounded-[2.5rem] p-10 text-white text-center shadow-xl shadow-pink-100">
                    <h3 className="text-2xl font-bold mb-4 italic font-heading">"Cada indivíduo é um universo a ser compreendido."</h3>
                    <p className="opacity-90 mb-8 max-w-lg mx-auto">
                        Se você não se sente encaixado em nenhuma categoria específica, entre em contato para conversarmos sobre sua demanda.
                    </p>
                    <button 
                        onClick={() => navigate(Page.APPOINTMENT)}
                        className="bg-white text-pink-600 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
                    >
                        Quero uma avaliação
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Audience;
