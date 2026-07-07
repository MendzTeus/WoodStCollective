import type React from "react";
import { motion } from "motion/react";
import { 
  Clock, 
  Monitor, 
  Coffee, 
  Wifi, 
  ChevronDown
} from "lucide-react";
import { useSiteData } from "../context/SiteContext";
import { openMailEnquiry } from "../lib/enquiry";
import { getCommonAreaImages } from "../data/commonAreas";

export default function Coworking() {
  const { data } = useSiteData();
  const pageData = data.pages['Coworking'];
  const officeImages = getCommonAreaImages('sharedOffice');
  const balconyImages = getCommonAreaImages('sharedBalcony');
  const commonImage = (images: readonly string[], index: number) => (
    images.length > 0 ? images[index % images.length] : pageData.coverImage
  );

  const handleDeskEnquiry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get('website')) return;

    openMailEnquiry('Wood Street coworking enquiry', {
      'First name': formData.get('firstName') || '',
      'Last name': formData.get('lastName') || '',
      'Email': formData.get('email') || '',
      'Desired duration': formData.get('duration') || '',
    }, data.settings.email);
  };

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
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className="bg-background-dark">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-end pb-24 px-12 overflow-hidden border-b border-divider-subtle">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" as const }}
            alt="Workspace Hero"
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

      {/* Features Bento Grid */}
      <section className="py-32 px-12 max-w-[1440px] mx-auto border-b border-divider-subtle">
        <motion.h2 
          {...fadeIn}
          className="text-6xl font-black italic mb-24 max-w-xl text-primary"
        >
          Workspace Features
        </motion.h2>
        
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Feature 1 */}
          <motion.div 
            variants={fadeIn}
            className="glass-card p-12 flex flex-col justify-between group h-[400px] rounded-2xl"
          >
            <Clock className="text-primary" size={48} />
            <div>
              <h3 className="text-3xl font-bold italic mb-4">24/7 Access</h3>
              <p className="text-text-secondary leading-relaxed font-light">Work on your own terms. Secure, round-the-clock access for our members.</p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            variants={fadeIn}
            className="glass-card p-12 flex flex-col justify-between group h-[400px] rounded-2xl"
          >
            <Monitor className="text-primary" size={48} />
            <div>
              <h3 className="text-3xl font-bold italic mb-4">Hot Desks & Monitors</h3>
              <p className="text-text-secondary leading-relaxed font-light">Four dedicated hot desks with monitors. Plug in and get to work.</p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            variants={fadeIn}
            className="glass-card p-12 flex flex-col justify-between group h-[400px] rounded-2xl"
          >
            <Coffee className="text-primary" size={48} />
            <div>
              <h3 className="text-3xl font-bold italic mb-4">Artisan Refreshments</h3>
              <p className="text-text-secondary leading-relaxed font-light">Coffee and refreshments available in the shared kitchen downstairs.</p>
            </div>
          </motion.div>

          {/* Feature 4 (Large) */}
          <motion.div 
            variants={fadeIn}
            className="glass-card p-12 md:col-span-3 flex flex-col justify-between group rounded-2xl min-h-[320px]"
          >
            <div className="max-w-3xl">
              <Wifi className="text-primary mb-8" size={48} />
              <h3 className="text-3xl font-bold italic mb-4">Enterprise Wi-Fi</h3>
              <p className="text-text-secondary leading-relaxed font-light">
                Fast, reliable Wi-Fi to keep guests and day-pass members connected through focused work, calls, and team sessions.
              </p>
            </div>
          </motion.div>
          
        </motion.div>
      </section>

      {/* Office Gallery */}
      <section className="py-32 px-12 max-w-[1440px] mx-auto">
        <motion.div {...fadeIn} className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16 border-b border-divider-subtle pb-8">
          <h2 className="text-6xl font-black italic text-primary">Office</h2>
          <p className="text-text-secondary italic text-lg max-w-md font-light text-right">
            Four hot desks with monitors on the top floor. Quiet, fast, and fully connected.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 aspect-[16/9] overflow-hidden border border-divider-subtle rounded-2xl">
            <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Office 1" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transition-transform"
              src={commonImage(officeImages, 0)}
            />
          </div>
          <div className="col-span-12 lg:col-span-4 aspect-square lg:aspect-auto overflow-hidden border border-divider-subtle rounded-2xl">
            <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Office 2" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transition-transform"
              src={commonImage(officeImages, 1)}
            />
          </div>
          <div className="col-span-6 md:col-span-6 aspect-video overflow-hidden border border-divider-subtle rounded-2xl">
            <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Office 3" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transition-transform"
              src={commonImage(officeImages, 2)}
            />
          </div>
          <div className="col-span-6 md:col-span-6 aspect-video overflow-hidden border border-divider-subtle rounded-2xl">
            <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Office 4" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transition-transform"
              src={commonImage(officeImages, 3)}
            />
          </div>
        </div>
      </section>

      {/* Balcony Gallery */}
      <section className="py-32 px-12 max-w-[1440px] mx-auto border-t border-divider-subtle">
        <motion.div {...fadeIn} className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16 border-b border-divider-subtle pb-8">
          <h2 className="text-6xl font-black italic text-primary">Balcony</h2>
          <p className="text-text-secondary italic text-lg max-w-md font-light text-right">
            Our rooftop terrace - outdoor seating above the city for calls, breaks, or fresh-air working sessions.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6 md:col-span-6 aspect-square md:aspect-video overflow-hidden border border-divider-subtle rounded-2xl">
            <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Balcony 1" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transition-transform"
              src={commonImage(balconyImages, 0)}
            />
          </div>
          <div className="col-span-6 md:col-span-6 aspect-square md:aspect-video overflow-hidden border border-divider-subtle rounded-2xl">
            <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Balcony 2" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transition-transform"
              src={commonImage(balconyImages, 1)}
              />
          </div>
          <div className="col-span-12 lg:col-span-8 aspect-[16/10] overflow-hidden border border-divider-subtle rounded-2xl">
            <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Balcony 3" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transition-transform"
              src={commonImage(balconyImages, 2)}
            />
          </div>
          <div className="col-span-12 lg:col-span-4 aspect-square lg:aspect-auto overflow-hidden border border-divider-subtle rounded-2xl">
            <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                alt="Balcony 4" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transition-transform"
              src={commonImage(balconyImages, 3)}
            />
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-32 px-12 max-w-[1440px] mx-auto border-t border-divider-subtle">
        {/* Enquiry Form */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl font-black italic mb-8 text-primary">Enquire About a Desk</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-16 italic">Join our community of professionals. Enquire about daily, weekly, or monthly passes.</p>
          
          <form className="space-y-10" onSubmit={handleDeskEnquiry}>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label htmlFor="coworking-first-name" className="label-caps text-[10px]">First Name</label>
                <input id="coworking-first-name" name="firstName" type="text" required placeholder="Jane" className="w-full bg-transparent border-b border-divider-subtle py-4 focus:border-primary transition-colors outline-none placeholder:text-text-muted/30" />
              </div>
              <div className="space-y-3">
                <label htmlFor="coworking-last-name" className="label-caps text-[10px]">Last Name</label>
                <input id="coworking-last-name" name="lastName" type="text" required placeholder="Doe" className="w-full bg-transparent border-b border-divider-subtle py-4 focus:border-primary transition-colors outline-none placeholder:text-text-muted/30" />
              </div>
            </div>
            
            <div className="space-y-3">
              <label htmlFor="coworking-email" className="label-caps text-[10px]">Email Address</label>
              <input id="coworking-email" name="email" type="email" required placeholder="jane@example.com" className="w-full bg-transparent border-b border-divider-subtle py-4 focus:border-primary transition-colors outline-none placeholder:text-text-muted/30" />
            </div>

            <div className="space-y-3">
              <label htmlFor="coworking-duration" className="label-caps text-[10px]">Desired Duration</label>
              <div className="relative group">
                <select id="coworking-duration" name="duration" className="w-full bg-transparent border-b border-divider-subtle py-4 focus:border-primary transition-colors outline-none appearance-none cursor-pointer">
                  <option className="bg-background-dark">Daily Pass</option>
                  <option className="bg-background-dark">Weekly Pass</option>
                  <option className="bg-background-dark">Monthly Dedicated Desk</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-primary transition-colors" size={16} />
              </div>
            </div>

            <button type="submit" className="w-full py-6 bg-primary text-on-primary label-caps text-xs font-bold hover:bg-white transition-colors duration-500 rounded-lg">
              Submit Enquiry
            </button>
          </form>
        </div>

      </section>
    </main>
  );
}
