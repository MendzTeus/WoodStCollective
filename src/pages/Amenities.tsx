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

export default function Amenities() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
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
    { icon: <Bath size={32} />, title: "Private En-Suite Bathroom", desc: "Rainfall shower, premium fixtures and boutique toiletries." },
    { icon: <Monitor size={32} />, title: "Dedicated Workspace", desc: "Ergonomic desk and chair in every room." },
    { icon: <Wifi size={32} />, title: "500 Mbps Wi-Fi", desc: "Enterprise-grade, dedicated bandwidth throughout." },
    { icon: <ChefHat size={32} />, title: "Shared Kitchen", desc: "Fully equipped with appliances, utensils and storage." },
    { icon: <Sun size={32} />, title: "Roof Terrace", desc: "Private outdoor space above the city." },
    { icon: <Users size={32} />, title: "Top-Floor Co-Working", desc: "Hot desks, standing desks and meeting rooms." },
    { icon: <Lock size={32} />, title: "24/7 Secure Access", desc: "Keyless entry, your schedule on your terms." },
    { icon: <WashingMachine size={32} />, title: "Laundry Facilities", desc: "Washer and dryer available on-site." },
    { icon: <Archive size={32} />, title: "Secure Storage", desc: "Lockable storage for luggage and valuables." },
    { icon: <Bike size={32} />, title: "Bicycle Parking", desc: "Secure indoor parking for bikes." },
    { icon: <Sparkles size={32} />, title: "Weekly Cleaning", desc: "Professional housekeeping included." },
    { icon: <Coffee size={32} />, title: "Artisan Coffee Station", desc: "Locally roasted coffee, always on." },
  ];

  return (
    <main className="bg-background-dark">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center text-center px-12 overflow-hidden border-b border-divider-subtle">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            alt="Luxury interior" 
            className="w-full h-full object-cover brightness-[0.4]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb_QluUVG-tfSLvjtb8UCBD0SlNDQyyPcsr-3HMoeZoPeh9b0EBJAHyMvEXjFlNZPz0_kpM5s_eGsQhvau0vYheIypNoynPE7TT76E3sVWGgIh3iXIMcvnH_kIBwDLpoAdiswTadDxrGPcZvTSS-Ci8ylCniewfsc-iP5aGmOU1FLosRGPeH24ooKU_z8NT5_V3jD1zoQ1MKoJaEDw7Md1SwNdBEdZzrrRfV6rdk4VnS5TvtrDB-6uZ0jP55yZxTrI2Zyu5kIkcFU"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-display text-[clamp(48px,8vw,100px)] font-black italic leading-tight text-primary mb-8"
          >
            Everything You Need.<br />Nothing You Don't.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto font-light italic"
          >
            Every detail at Wood Street Collective has been considered for professionals who value their time and comfort.
          </motion.p>
        </div>
      </section>

      {/* Amenities Grid */}
      <section className="py-32 px-12 max-w-[1440px] mx-auto">
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
              className="bg-surface-container p-12 border border-divider-subtle group hover:border-primary/30 transition-all duration-500"
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

      {/* Split Section */}
      <section className="max-w-[1440px] mx-auto px-12 pb-32">
        <div className="flex flex-col lg:flex-row bg-surface-container border border-divider-subtle overflow-hidden">
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] relative overflow-hidden group">
            <img 
              alt="Top-floor co-working space" 
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaZahCAvZuREoXCJbduuU0ZzTtLusQLVy1Sw-sd7lot7zIRMZV_C_Fc1G5-ioaadPQkA0kIUPknRdyXOnb9TnHpvWSrSZ7KslDZXiddh0gkvGeI55GVxl2l3ll10_PL1elTG_3v2L5Ye043Mhp2_423f9ZvJOl2r_WQoOxDfBuFCmP88bu0MqVFbiHsgmvg0QjQpWiVv57G8zOdXEmD7Z75D_guKIklsGO3kb6gd2yjLS2Fe0m2HzdIQWUyA7o4kS7YPw7_oKMv-U"
            />
          </div>
          <div className="w-full lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center items-start">
            <h2 className="text-5xl font-black italic mb-8 leading-[0.9] text-primary">Built for Deep Work.</h2>
            <p className="text-xl text-text-secondary leading-relaxed mb-12 font-light italic">
              The top-floor workspace at Wood Street Collective features hot desks, dedicated desks, standing options and fully equipped meeting rooms. 500 Mbps enterprise Wi-Fi throughout. Coffee and refreshments included.
            </p>
            <button className="inline-flex items-center gap-4 py-4 border-b border-primary/30 hover:border-primary transition-colors label-caps text-xs hover:gap-6 duration-300">
              Enquire About a Desk
              <ArrowRight size={16} className="text-primary" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 bg-surface-container/30 border-t border-divider-subtle">
        <div className="max-w-3xl mx-auto px-12 text-center">
          <h2 className="text-6xl font-black italic mb-6 leading-none text-primary">Ready to See It?</h2>
          <p className="text-xl text-text-secondary mb-16 italic font-light">
            Check live availability and get in touch — we'll take it from there.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-primary text-on-primary px-12 py-5 label-caps text-xs font-bold hover:bg-white transition-colors duration-500">
              Check Availability
            </button>
            <button className="border border-divider-subtle text-text-primary px-12 py-5 label-caps text-xs font-bold hover:bg-white hover:text-background-dark transition-colors duration-500">
              View on Airbnb
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
