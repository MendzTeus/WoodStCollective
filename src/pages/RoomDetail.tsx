import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  Bed,
  Monitor,
  Bath,
  Wifi,
  Coffee,
  Maximize,
  Zap,
  Music,
  Sunset,
  Layers,
  Wind,
  Camera,
  Shield,
  Box,
  Cloud,
  Mic,
  Truck,
  Moon,
  Mail,
  MessageSquare
} from "lucide-react";
import { useSiteData } from "../context/SiteContext";
import { toExternalUrl, toMailto, toWhatsAppUrl } from "../lib/url";
import { trackEvent } from "../lib/analytics";

const iconMap: any = {
  Bed, Monitor, Bath, Wifi, Coffee, Maximize, Zap, Music, Sunset, Layers, Wind, Camera, Shield, Box, Cloud, Mic, Truck, Moon
};

export default function RoomDetail() {
  const { id } = useParams();
  const { data } = useSiteData();
  const room = id ? data.rooms[id] : undefined;
  const airbnbUrl = toExternalUrl(room?.airbnbUrl);
  const emailUrl = toMailto(room?.enquiryEmail || data.settings.email);
  const whatsappUrl = toWhatsAppUrl(room?.whatsappUrl || data.settings.whatsappUrl);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary">
        <div className="text-center">
          <h2 className="text-4xl font-display italic mb-4">Residence Not Found</h2>
          <Link to="/coliving" className="label-caps border-b border-primary pb-1">Return to Co-living</Link>
        </div>
      </div>
    );
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" as const }
  };

  return (
    <main className="bg-background-dark">
      {/* Hero Section */}
      <header className="relative w-full h-screen overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          alt={room.name} 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4]" 
          src={room.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent" />
        
        <div className="absolute top-32 left-12 z-20">
          <Link to="/coliving" className="inline-flex items-center gap-3 text-white/60 hover:text-primary transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
            <span className="label-caps text-[10px]">Back to Residences</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full px-12 pb-24 max-w-[1440px] mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block bg-primary text-on-primary label-caps px-4 py-2 mb-8 font-bold rounded-lg">{room.type}</span>
            <h1 className="font-display text-[clamp(64px,10vw,120px)] font-black italic leading-[0.85] text-primary mb-6">
              {room.name.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h1>
            <p className="font-sans text-xl text-text-secondary max-w-2xl leading-relaxed font-light italic">
              {room.description}
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-12 py-32 flex flex-col gap-32">
        {/* Gallery Section */}
        <div className="space-y-12">
          <h2 className="text-5xl font-black italic border-b border-divider-subtle pb-6 max-w-fit text-primary">Visual Tour</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-8 aspect-[4/3] overflow-hidden border border-divider-subtle group rounded-2xl">
              <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Gallery 1" 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700" 
                src={room.gallery[0]} 
              />
            </div>
            <div className="col-span-6 md:col-span-4 aspect-square md:aspect-auto overflow-hidden border border-divider-subtle group rounded-2xl">
              <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Gallery 2" 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700" 
                src={room.gallery[1]} 
              />
            </div>
            <div className="col-span-6 md:col-span-4 aspect-square md:aspect-auto overflow-hidden border border-divider-subtle group rounded-2xl">
              <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Gallery 3" 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700" 
                src={room.gallery[2]} 
              />
            </div>
            <div className="col-span-12 md:col-span-8 aspect-[2/1] overflow-hidden border border-divider-subtle group rounded-2xl">
              <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Main Display" 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700" 
                src={room.image} 
              />
            </div>
          </div>
        </div>

        {/* Space & Features Section */}
        <div className="space-y-12">
          <motion.h2 {...fadeIn} className="text-5xl font-black italic border-b border-divider-subtle pb-6 max-w-fit text-primary">
            The Space
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            <div className="lg:col-span-5">
              <p className="text-xl text-text-secondary leading-relaxed font-light italic">
                {room.longDescription}
              </p>
              <div className="mt-12 flex flex-col gap-6">
                <div className="flex items-center gap-4 text-text-secondary">
                  <MapPin className="text-primary" size={20} />
                  <span className="label-caps italic text-xs tracking-widest">{room.details}</span>
                </div>
                <div className="flex items-center gap-4 text-text-secondary">
                  <Calendar className="text-primary" size={20} />
                  <span className="label-caps italic text-xs tracking-widest">Flexible residency terms</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
              {room.features.slice(0, 4).map((item: any, i) => {
                const Icon = iconMap[item.icon] || Shield;
                return (
                  <motion.div key={i} {...fadeIn} className="bg-surface-container p-10 border border-divider-subtle group hover:border-primary/30 transition-colors rounded-2xl">
                    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500 text-primary">
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 italic">{item.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Combined Availability & Enquiry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start pb-24 border-b border-divider-subtle">
          <div className="lg:col-span-7 space-y-12">
            <motion.h2 {...fadeIn} className="text-5xl font-black italic border-b border-divider-subtle pb-6 max-w-fit text-primary">
              Availability
            </motion.h2>
            <div className="w-full">
              <AvailabilityCalendar roomId={room.id} />
            </div>
          </div>
          
          <div className="lg:col-span-5 space-y-12">
            <motion.h2 {...fadeIn} className="text-5xl font-black italic border-b border-divider-subtle pb-6 max-w-fit text-primary">
              Enquire
            </motion.h2>
            <motion.div 
              {...fadeIn}
              className="bg-surface-container p-12 border border-divider-subtle flex flex-col gap-10 rounded-2xl"
            >
              <div>
                <p className="text-text-secondary text-sm italic leading-relaxed">Connect with our concierge team to explore availability and bespoke terms for the {room.name}.</p>
              </div>
              
              <div className="flex flex-col gap-4">
                <a
                  href={emailUrl || "#"}
                  onClick={() => trackEvent("click_email_room", { room_id: room.id, room_name: room.name })}
                  className="w-full bg-primary text-on-primary py-6 label-caps text-[10px] font-bold hover:bg-white transition-colors duration-500 flex items-center justify-center gap-3 rounded-lg"
                >
                  <Mail size={16} /> Email Enquiry
                </a>
                <a
                  href={whatsappUrl || "#"}
                  target={whatsappUrl ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("click_whatsapp_room", { room_id: room.id, room_name: room.name })}
                  className="w-full border border-divider-subtle py-6 label-caps text-[10px] font-bold hover:bg-primary hover:text-on-primary transition-all duration-500 flex items-center justify-center gap-3 rounded-lg"
                >
                  <MessageSquare size={16} /> WhatsApp
                </a>
                {airbnbUrl ? (
                  <a 
                    href={airbnbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("click_airbnb_room", { room_id: room.id, room_name: room.name, link_url: airbnbUrl })}
                    className="w-full border border-divider-subtle py-6 label-caps text-[10px] font-bold hover:bg-[#FF385C] hover:text-white hover:border-[#FF385C] transition-all duration-500 flex items-center justify-center gap-3 rounded-lg"
                  >
                    Airbnb
                  </a>
                ) : (
                  <button className="w-full border border-divider-subtle py-6 label-caps text-[10px] font-bold hover:bg-[#FF385C] hover:text-white hover:border-[#FF385C] transition-all duration-500 flex items-center justify-center gap-3 rounded-lg">
                    Airbnb
                  </button>
                )}
              </div>
              <p className="text-center text-[10px] label-caps opacity-40 italic">Direct concierge response guaranteed.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
