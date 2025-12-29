
import React, { useEffect, useRef } from 'react';
import { Page, SiteConfig } from '../App';

interface Props {
  navigate: (page: Page) => void;
  config: SiteConfig;
}

const Contact: React.FC<Props> = ({ navigate, config }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Map initialization currently uses static markers for visual purposes in this demo version.
        // For a full dynamic map, Google Maps Geocoding API would be required to convert addresses to lat/lng.
        const initMap = async () => {
            if (!mapRef.current || !(window as any).google) return;
            try {
                const { Map } = await (window as any).google.maps.importLibrary("maps");
                const { AdvancedMarkerElement, PinElement } = await (window as any).google.maps.importLibrary("marker");

                // Default center (Rio de Janeiro region)
                const map = new Map(mapRef.current, {
                    center: { lat: -22.63, lng: -43.34 },
                    zoom: 9,
                    mapId: 'SONIA_CONTACT_MAP',
                    disableDefaultUI: true,
                    zoomControl: true
                });

                // Adding a generic pin to show map activity
                const pin = new PinElement({ background: "#DB2777", glyphColor: "white" });
                new AdvancedMarkerElement({ map, position: {lat: -22.4571, lng: -43.4803}, content: pin.element, title: "Miguel Pereira" });
            } catch (e) { console.error(e); }
        };
        initMap();
    }, []);

    return (
        <div className="animate-fade-in bg-white min-h-screen pb-24">
            <header className="bg-slate-900 text-white px-6 py-12 md:py-16 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full blur-[100px] opacity-20"></div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 relative z-10">Contato & Unidades</h1>
                <p className="text-slate-400 relative z-10 text-sm md:text-base">Agende sua visita em um de nossos consultórios.</p>
            </header>

            <div className="container mx-auto px-6 -mt-8 relative z-20 space-y-8 md:space-y-12">
                {/* Locations Cards (Dynamic) */}
                <div className="grid md:grid-cols-2 gap-4">
                    {config.locations.length > 0 ? (
                        config.locations.map((loc) => (
                            <div key={loc.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 flex items-start gap-4">
                                <div className="bg-pink-100 text-pink-600 p-3 rounded-2xl shrink-0">
                                    <span className="material-symbols-outlined text-2xl md:text-3xl">location_on</span>
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">{loc.title}</h3>
                                    <p className="text-xs md:text-sm text-slate-500 mb-4">
                                        {loc.address}, {loc.number} <br/>
                                        {loc.district} - {loc.city}/{loc.state} <br/>
                                        CEP: {loc.cep}
                                    </p>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.address}, ${loc.number}, ${loc.city} - ${loc.state}`)}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-pink-600 text-[10px] md:text-xs font-bold uppercase flex items-center gap-1 hover:underline"
                                    >
                                        Ver no Google Maps <span className="material-symbols-outlined text-sm">open_in_new</span>
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 col-span-2 text-center text-slate-400">
                            Nenhum endereço cadastrado.
                        </div>
                    )}
                </div>

                {/* Interactive Map (Visual) */}
                <div className="rounded-[2.5rem] overflow-hidden shadow-inner border border-slate-100 h-64 md:h-80 bg-slate-50 relative group">
                    <div ref={mapRef} className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                    <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 text-[10px] text-slate-500 rounded-full font-bold shadow-sm">
                        Visualização da Região
                    </div>
                </div>

                {/* Contact List */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 text-center">Fale Conosco</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <a 
                            href={`https://wa.me/${config.whatsapp}`} 
                            target="_blank"
                            rel="noreferrer"
                            className="w-full bg-green-500 text-white p-5 rounded-2xl flex items-center justify-between font-bold text-base md:text-lg active:scale-95 transition-transform"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-2xl md:text-3xl">chat</span>
                                WhatsApp
                            </div>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </a>
                        <a 
                            href={`mailto:${config.email || 'soniarosa.psi@email.com'}`}
                            className="w-full bg-slate-800 text-white p-5 rounded-2xl flex items-center justify-between font-bold text-base md:text-lg active:scale-95 transition-transform"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-2xl md:text-3xl">mail</span>
                                Email Profissional
                            </div>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </a>
                    </div>
                </div>

                {/* Gallery Section (New) */}
                {config.galleryImages && config.galleryImages.length > 0 && (
                    <div className="py-8">
                        <div className="flex items-center gap-4 mb-8 justify-center">
                            <div className="h-px bg-slate-200 w-16"></div>
                            <h3 className="text-lg md:text-xl font-heading font-bold text-slate-800">Conheça nosso Espaço</h3>
                            <div className="h-px bg-slate-200 w-16"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {config.galleryImages.map((img, idx) => (
                                <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-slate-100">
                                    <img src={img} alt={`Consultório ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Appointment CTA */}
                <div className="py-8">
                    <button 
                        onClick={() => navigate(Page.APPOINTMENT)}
                        className="w-full bg-pink-600 text-white p-6 rounded-[2rem] font-bold text-lg md:text-xl shadow-lg shadow-pink-100 active:scale-95 transition-transform flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined">event_available</span>
                        Reservar Horário
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Contact;
