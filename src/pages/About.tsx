import { motion } from "motion/react";
import { 
  Users, 
  Target, 
  PenTool
} from "lucide-react";

export default function About() {
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
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className="bg-background-dark">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden border-b border-divider-subtle">
        <div className="absolute inset-0 z-0">
          <motion.img 
             initial={{ scale: 1.1 }}
             animate={{ scale: 1 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             alt="Manchester Skyline" 
             className="w-full h-full object-cover brightness-[0.4]" 
             src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM0tRKGJ76qkiUGHXCLhtOnzmG6pkFc-Xf7Pe24pJKlu5Z1ZMVfYTMJXimrwSkQkZ1UoGlc4EC93vwg9_L-XQQVzdvDGSdQyBhEuYT9Rn6FFfw5800gCuH6xWbKbupuPn41B_6TIlqjE1j5l4JyLevX4im7W9Jis0eijNX5cf79YxLMwHRWikczg3vUoNyXbsYPQOqJg6Se5VkreKUmf7HRxQZnt8yhhjHHr73YwPtArTPLxPydlWxCwXDP2xpenK28re12r3WS60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-12 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-display text-[clamp(48px,8vw,100px)] font-black italic leading-tight text-primary mb-8"
          >
            Elevating the<br />Manchester Experience.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto font-light italic"
          >
            A sanctuary for professionals and creatives in the heart of the city.
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-[1440px] mx-auto px-12 py-32 editorial-grid gap-24">
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-center">
          <motion.h2 {...fadeIn} className="text-6xl font-black italic mb-12 text-primary leading-[0.9]">
            Our Story.
          </motion.h2>
          <motion.div {...fadeIn} className="space-y-8 text-lg font-light text-text-secondary leading-relaxed italic">
            <p>
              Wood Street Collective was born from a vision to redefine urban living and working in Manchester. We recognized a need for spaces that inspire rather than merely accommodate. Our spaces are meticulously crafted to blend historic charm with contemporary luxury, providing an environment where ambition meets comfort.
            </p>
            <p className="text-base text-text-muted not-italic">
              Situated in a vibrant, culturally rich district, we offer more than just a desk or a room; we offer a community. Every detail, from the ambient lighting to the bespoke furnishings, is chosen to support professional focus and creative flow, establishing a new standard for premium co-living and co-working.
            </p>
          </motion.div>
        </div>
        
        <div className="col-span-12 lg:col-span-6 relative h-[600px] overflow-hidden border border-divider-subtle group">
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            alt="WSC Interior" 
            className="w-full h-full object-cover transition-all duration-1000" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC84ZE9VOt8qd3YlHdRm3JsqmduYTY2yHLoh4cZc5F0tgclzBadPouOLwCtsqVo2UpFqhMJLs8_VRoqyytozdbKgXJu2kjMkrCSJlZk3L6TlnvF_bTM-wz-xXHmh99spSFaFM-UuWDBnX0iAseitb1ZgPsXPgDAulw__ukRtJ2bgWKsChbc6IGNRHdGzRYSAN27p9Nibe5CoJrpHFySHw4ozX7bdnlL-MT3tbbvHSPg79Qtn7ABdSsa9KWsuPLUTGXA2Iq1A7KcHY0" 
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-surface-container/30 py-32 px-12 border-y border-divider-subtle">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-black italic text-primary">Our Core Values.</h2>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Value 1 */}
            <motion.div variants={fadeIn} className="glass-card p-12 border border-divider-subtle group hover:border-primary/30 transition-all duration-500">
              <Users className="text-primary mb-8" size={40} />
              <h3 className="text-3xl font-bold italic mb-4">Community</h3>
              <p className="text-text-secondary leading-relaxed font-light italic">
                Curating a network of driven individuals. We foster connections that spark collaboration and lifelong relationships.
              </p>
            </motion.div>

            {/* Value 2 */}
            <motion.div variants={fadeIn} className="glass-card p-12 border border-divider-subtle group hover:border-primary/30 transition-all duration-500 md:scale-105 bg-background-dark/40">
              <Target className="text-primary mb-8" size={40} />
              <h3 className="text-3xl font-bold italic mb-4">Focus</h3>
              <p className="text-text-secondary leading-relaxed font-light italic">
                Environments engineered for deep work. Acoustic treatments and ergonomic design ensure your productivity is paramount.
              </p>
            </motion.div>

            {/* Value 3 */}
            <motion.div variants={fadeIn} className="glass-card p-12 border border-divider-subtle group hover:border-primary/30 transition-all duration-500">
              <PenTool className="text-primary mb-8" size={40} />
              <h3 className="text-3xl font-bold italic mb-4">Craft</h3>
              <p className="text-text-secondary leading-relaxed font-light italic">
                An unwavering commitment to quality. From architectural design to the coffee we serve, excellence is in our details.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team (Placeholder) */}
      <section className="py-48 px-12 text-center max-w-[1440px] mx-auto">
        <motion.h2 {...fadeIn} className="text-4xl font-bold italic text-primary mb-8">The Team</motion.h2>
        <motion.p {...fadeIn} className="text-xl text-text-muted italic max-w-xl mx-auto">Meet the visionaries behind Wood Street Collective — coming soon.</motion.p>
      </section>
    </main>
  );
}
