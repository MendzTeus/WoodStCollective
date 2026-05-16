import { motion } from "motion/react";
import { 
  Bath, 
  Monitor, 
  Wifi, 
  ChefHat, 
  Sun, 
  Users, 
  Lock, 
  WashingMachine, 
  Archive, 
  Bike, 
  Sparkles, 
  Coffee,
  ArrowRight
} from "lucide-react";
import { useSiteData } from "../context/SiteContext";
import { Link } from "react-router-dom";
import { toExternalUrl } from "../lib/url";
import { trackEvent } from "../lib/analytics";

export default function Amenities() {
  const { data } = useSiteData();
  const pageData = data.pages['Amenities'];
  const airbnbUrl = toExternalUrl(data.settings.airbnbUrl);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" as const }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const amenitiesList = [
    { icon: <Bath size={32} />, title: "Private En-Suite Bathroom", desc: "Private bathroom in every room - shower, sink and toilet." },
    { icon: <Monitor size={32} />, title: "Dedicated Workspace", desc: "Ergonomic desk and chair in every room." },
    { icon: <Wifi size={32} />, title: "Fast Wi-Fi", desc: "Reliable high-speed Wi-Fi throughout the house and workspace." },
    { icon: <ChefHat size={32} />, title: "Shared Kitchen", desc: "Fully equipped with appliances, utensils and storage." },
    { icon: <Sun size={32} />, title: "Roof Terrace", desc: "Private outdoor space above the city." },
    { icon: <Users size={32} />, title: "Top-Floor Co-Working", desc: "Hot desks, monitors and terrace access upstairs." },
    { icon: <Lock size={32} />, title: "24/7 Secure Access", desc: "Keyless entry, your schedule on your terms." },
    { icon: <WashingMachine size={32} />, title: "Laundry Facilities", desc: "Washer and dryer available on-site." },
    { icon: <Archive size={32} />, title: "Secure Storage", desc: "Lockable storage for luggage and valuables." },
    { icon: <Bike size={32} />, title: "Bicycle Parking", desc: "Secure indoor parking for bikes." },
    { icon: <Sparkles size={32} />, title: "Weekly Cleaning", desc: "Professional housekeeping included." },
    { icon: <Coffee size={32} />, title: "Artisan Coffee Station", desc: "Coffee and refreshments available in the shared kitchen." },
  ];

  return (
    <main className="bg-background-dark">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-end pb-24 px-6 md:px-12 overflow-hidden border-b border-divider-subtle">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" as const }}
            alt="Luxury interior" 
            className="w-full h-full object-cover brightness-[0.4]" 
            src={pageData.coverImage}
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        
        <div className="relative z-10 max-w-[1440px] mx-auto w-full">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display page-hero-title font-black leading-[0.95] text-primary mb-10 italic whitespace-pre-line max-w-4xl"
            >
              {pageData.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl text-text-secondary max-w-xl leading-relaxed font-light italic"
            >
              {pageData.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Shared Kitchen Gallery */}
      <section className="py-32 px-12 max-w-[1440px] mx-auto">
        <motion.div {...fadeIn} className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16 border-b border-divider-subtle pb-8">
          <h2 className="text-6xl font-black italic text-primary">Shared Kitchen</h2>
          <p className="text-text-secondary italic text-lg max-w-md font-light text-right">
            Fully equipped with modern appliances, ample storage, and artisanal coffee to connect with the community.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 aspect-[16/9] overflow-hidden border border-divider-subtle rounded-2xl">
            <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Shared Kitchen 1" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transition-transform"
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2070" 
            />
          </div>
          <div className="col-span-12 lg:col-span-4 aspect-square lg:aspect-auto overflow-hidden border border-divider-subtle rounded-2xl">
            <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Shared Kitchen 2" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transition-transform"
              src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=2070" 
            />
          </div>
          <div className="col-span-6 md:col-span-6 aspect-video overflow-hidden border border-divider-subtle rounded-2xl">
            <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Shared Kitchen 3" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transition-transform"
              src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=2070" 
            />
          </div>
          <div className="col-span-6 md:col-span-6 aspect-video overflow-hidden border border-divider-subtle rounded-2xl">
            <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Shared Kitchen 4" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transition-transform"
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2070" 
            />
          </div>
        </div>
      </section>

      {/* Amenities Grid */}
      <section className="py-32 px-12 max-w-[1440px] mx-auto border-t border-divider-subtle">
        <div className="text-center mb-24">
          <motion.h2 {...fadeIn} className="text-5xl font-black italic text-primary">Your Space, Fully Equipped.</motion.h2>
        </div>
        
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {amenitiesList.map((item, i) => (
            <motion.div 
              key={i}
              variants={fadeIn}
              className="bg-surface-container p-12 border border-divider-subtle group hover:border-primary/30 transition-all duration-500 rounded-2xl"
            >
              <div className="text-primary mb-8 transform group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold italic mb-4">{item.title}</h3>
              <p className="text-text-secondary leading-relaxed font-light italic">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-48 bg-surface-container/30 border-t border-divider-subtle">
        <div className="max-w-3xl mx-auto px-12 text-center">
          <h2 className="text-6xl font-black italic mb-6 leading-none text-primary">Ready to See It?</h2>
          <p className="text-xl text-text-secondary mb-16 italic font-light">
            Check live availability and get in touch — we'll take it from there.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/coliving" onClick={() => trackEvent("click_check_availability")} className="bg-primary text-on-primary px-12 py-5 label-caps text-xs font-bold hover:bg-white transition-colors duration-500 rounded-lg">
              Check Availability
            </Link>
            <a href={airbnbUrl || "/coliving"} target={airbnbUrl ? "_blank" : undefined} rel="noopener noreferrer" onClick={() => trackEvent("click_airbnb_amenities", { link_url: airbnbUrl || "/coliving" })} className="border border-divider-subtle text-text-primary px-12 py-5 label-caps text-xs font-bold hover:bg-white hover:text-background-dark transition-colors duration-500 rounded-lg">
              View on Airbnb
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
