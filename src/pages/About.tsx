import { motion } from "motion/react";
import { 
  Users, 
  Target, 
  PenTool
} from "lucide-react";
import { useSiteData } from "../context/SiteContext";

export default function About() {
  const { data } = useSiteData();
  const pageData = data.pages['About'];

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
      <section className="relative h-screen w-full flex items-end pb-24 px-6 md:px-12 overflow-hidden border-b border-divider-subtle">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" as const }}
            alt="About Cover"
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

      {/* Our Story Section */}
      <section className="max-w-[1440px] mx-auto px-12 py-32 editorial-grid gap-24">
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-center">
          <motion.h2 {...fadeIn} className="text-6xl font-black italic mb-12 text-primary leading-[0.9]">
            Our Story.
          </motion.h2>
          <motion.div {...fadeIn} className="space-y-8 text-lg font-light text-text-secondary leading-relaxed italic">
            <p>
              Wood Street Collective was built for people who need more than just a room. We created a space where professionals, creatives, and teams can stay, work, and connect - without the compromise of choosing between comfort and productivity.
            </p>
            <p className="text-base text-text-muted not-italic">
              Located in the heart of Manchester, we offer six private rooms with shared kitchen, roof terrace, and a top-floor workspace. Guests check out at 10am but keep access to the workspace until 5pm - because a productive day shouldn't end at checkout.
            </p>
          </motion.div>
        </div>
        
        <div className="col-span-12 lg:col-span-6 relative h-[600px] overflow-hidden border border-divider-subtle group rounded-2xl">
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            alt="WSC Interior" 
            className="w-full h-full object-cover transition-all duration-1000" 
            src={pageData.featureImage || pageData.coverImage}
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
            <motion.div variants={fadeIn} className="glass-card p-12 border border-divider-subtle group hover:border-primary/30 transition-all duration-500 rounded-2xl">
              <Users className="text-primary mb-8" size={40} />
              <h3 className="text-3xl font-bold italic mb-4">Community</h3>
              <p className="text-text-secondary leading-relaxed font-light italic">
                Curating a network of driven individuals. We foster connections that spark collaboration and lifelong relationships.
              </p>
            </motion.div>

            {/* Value 2 */}
            <motion.div variants={fadeIn} className="glass-card p-12 border border-divider-subtle group hover:border-primary/30 transition-all duration-500 md:scale-105 bg-background-dark/40 rounded-2xl">
              <Target className="text-primary mb-8" size={40} />
              <h3 className="text-3xl font-bold italic mb-4">Focus</h3>
              <p className="text-text-secondary leading-relaxed font-light italic">
                Hot desks, monitors, and fast Wi-Fi on the top floor - everything you need to do your best work.
              </p>
            </motion.div>

            {/* Value 3 */}
            <motion.div variants={fadeIn} className="glass-card p-12 border border-divider-subtle group hover:border-primary/30 transition-all duration-500 rounded-2xl">
              <PenTool className="text-primary mb-8" size={40} />
              <h3 className="text-3xl font-bold italic mb-4">Craft</h3>
              <p className="text-text-secondary leading-relaxed font-light italic">
                An unwavering commitment to quality. From architectural design to the coffee we serve, excellence is in our details.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>


    </main>
  );
}
