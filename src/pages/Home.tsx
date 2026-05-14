import { motion } from "motion/react";
import { 
  Clock, 
  Monitor, 
  Coffee, 
  Wifi, 
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { rooms } from "../data/rooms";

export default function Home() {
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
    <main>
      {/* Hero Section - Split Editorial Layout */}
      <section className="relative min-h-screen w-full editorial-grid border-b border-divider-subtle">
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center px-12 pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="font-display text-[clamp(80px,12vw,140px)] font-black leading-[0.85] italic mb-10 text-primary">
              The<br />Collective<br />Spirit.
            </h1>
            <p className="font-sans text-xl text-text-secondary max-w-lg leading-relaxed font-light mb-12">
              A curated sanctuary for deep work and creative expansion. Designed for those who seek architectural clarity and professional excellence in the heart of the city.
            </p>
            <Link to="/coliving">
            <button className="bg-primary text-on-primary px-10 py-5 label-caps text-xs font-bold hover:bg-white transition-colors duration-500 rounded-lg">
                Take a look
              </button>
            </Link>
          </motion.div>
        </div>
        
        <div className="hidden lg:block col-span-5 relative border-l border-divider-subtle overflow-hidden">
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            alt="Workspace Hero" 
            className="w-full h-full object-cover brightness-75" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNSlwUHEAhil8a_suo2jgS9N0oAFm8HOoUmYjzw_fvSWEgk7W0CCxIerUCtXpIdo3m10Z8Nhq8zbz_JPuhRobZrzP9Pu6h70u5gEKKT5h-fG0PHwZtk8IdJ70zfvz8qMqcNLacfXY6GYSgdLNCdt-xWNOj946Fk9ugOi0PSj0_3rCnnipubiOxHGErTTKiueVgZll2bk3TKjKTCartvpEwZKATdF11QHz9NDDg--FwiWszyJoMtT5OTalEAKYbr4MphTlN1xKI3-U" 
          />
          <div className="absolute bottom-12 -left-12 rotate-[-90deg] origin-bottom-left">
            <span className="label-caps tracking-[0.5em] text-[10px] bg-background-dark px-6 py-2">Workspace / Suite 402</span>
          </div>
        </div>

        {/* Bottom Rail - Editorial Stats/Categories */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 border-t border-divider-subtle">
          <Link to="/coliving" className="bottom-rail-item group cursor-pointer hover:bg-primary/5 transition-colors">
            <div className="font-display text-4xl italic text-primary opacity-50 group-hover:opacity-100 transition-opacity mb-4">01</div>
            <div>
              <h4 className="label-caps text-xs mb-2">Co-Living Suites</h4>
              <p className="text-sm text-text-secondary leading-relaxed">Sophisticated residential design meeting high-performance living environments.</p>
            </div>
          </Link>
          <div className="bottom-rail-item group cursor-pointer border-x border-divider-subtle hover:bg-primary/5 transition-colors">
            <div className="font-display text-4xl italic text-primary opacity-50 group-hover:opacity-100 transition-opacity mb-4">02</div>
            <div>
              <h4 className="label-caps text-xs mb-2">Private Studios</h4>
              <p className="text-sm text-text-secondary leading-relaxed">Dedicated environments for focused concentration and high-stakes team collaboration.</p>
            </div>
          </div>
          <div className="bottom-rail-item group cursor-pointer hover:bg-primary/5 transition-colors">
            <div className="font-display text-4xl italic text-primary opacity-50 group-hover:opacity-100 transition-opacity mb-4">03</div>
            <div>
              <h4 className="label-caps text-xs mb-2">Cultural Lounge</h4>
              <p className="text-sm text-text-secondary leading-relaxed">Curated events and artisan refreshments in an immersive, hospitality-focused setting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Residences Section */}
      <section className="py-32 px-12 max-w-[1440px] mx-auto border-b border-divider-subtle">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <motion.h2 {...fadeIn} className="text-6xl font-black italic leading-none text-primary">
            Curated<br />Residences.
          </motion.h2>
          <Link to="/coliving">
            <motion.div {...fadeIn} className="label-caps border-b border-primary pb-2 flex items-center gap-4 hover:gap-6 transition-all duration-300">
              View All Suites <ArrowRight size={14} />
            </motion.div>
          </Link>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24"
        >
          {rooms.map((room) => (
            <motion.div 
              key={room.id}
              variants={fadeIn}
              className="group cursor-pointer"
            >
              <Link to={`/coliving/${room.id}`}>
            <div className="relative aspect-[4/5] overflow-hidden mb-8 border border-divider-subtle rounded-2xl">
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute top-6 left-6 label-caps text-[10px] bg-background-dark/80 backdrop-blur-md px-4 py-2 border border-divider-subtle rounded-lg">
                    {room.type}
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-bold italic mb-2 text-primary font-display">{room.name}</h3>
                    <p className="text-text-muted text-sm italic">{room.details}</p>
                  </div>
                  <div className="text-right">
                    <div className="w-10 h-10 border border-divider-subtle flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <motion.h2 {...fadeIn} className="text-6xl md:text-7xl font-black italic max-w-xl leading-none text-primary">
            The Architecture of Focus.
          </motion.h2>
          <motion.div {...fadeIn} className="label-caps border-b border-primary pb-2 max-w-fit">
            Workspace Amenities
          </motion.div>
        </div>
        
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12"
        >
          {[
            { icon: <Clock size={40} />, title: "24/7 Access", desc: "Round-the-clock entry for members, secured via biometric verification." },
            { icon: <Monitor size={40} />, title: "Ergonomics", desc: "High-end standing desks and Herman Miller seating as standard." },
            { icon: <Coffee size={40} />, title: "Refreshments", desc: "Artisan coffee program featuring seasonal single-origin roasts." }
          ].map((f, i) => (
            <motion.div key={i} variants={fadeIn} className="border-t border-divider-subtle pt-10 group">
              <div className="text-primary mb-8 transform group-hover:scale-110 transition-transform duration-500">{f.icon}</div>
              <h3 className="text-3xl font-bold mb-4 text-primary font-display italic">{f.title}</h3>
              <p className="text-text-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Immersive Image Break */}
      <section className="h-[60vh] relative overflow-hidden border-y border-divider-subtle">
         <img 
          className="w-full h-full object-cover fixed opacity-40 top-0 left-0 -z-10 pointer-events-none"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlxIi4pc4yO9LdWc-7DvCz-iJNPBXLr-mwXRvKa5TUyOSX4kYbzNbnwY4TfO1F77oS8lx1d6yRy7fu6AgJucS03JbavcHIb8cTK3c8XYxKD80PKY63X09oYLU_MLjDI6dxs0uXkxAx8-8ZrK7iDGYGZD8-W8ni2teVJwgr9xnFi9q-MbuYrTmuS3xb-zSuYdQd0Dn9QJ6mqiF6ok4QVwxMqKWwTR8qrhEQDEr_khol1scDsd8GjSlz3sMiNSQV2b301toGJRv4Fmk" 
          alt="Atmospheric" 
        />
        <div className="absolute inset-0 flex items-center justify-center bg-background-dark/20 backdrop-blur-[2px]">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center px-6"
          >
            <div className="label-caps mb-6">Designed for Expansion</div>
            <h2 className="text-5xl md:text-8xl font-black italic drop-shadow-2xl text-primary">Excellence in every detail.</h2>
          </motion.div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-32 px-12 max-w-7xl mx-auto editorial-grid gap-y-24">
        <div className="col-span-12 lg:col-span-6 pr-0 lg:pr-12">
          <h2 className="text-6xl font-black italic mb-8 leading-[0.9] text-primary">Start Your Residency.</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-12 max-w-md italic">Enquire about our curated membership tiers and join the Wood Street community.</p>
          
          <form className="space-y-10">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="label-caps text-[10px]">Given Name</label>
                <input type="text" className="w-full bg-transparent border-b border-divider-subtle py-4 focus:border-primary transition-colors outline-none" />
              </div>
              <div className="space-y-3">
                <label className="label-caps text-[10px]">Surname</label>
                <input type="text" className="w-full bg-transparent border-b border-divider-subtle py-4 focus:border-primary transition-colors outline-none" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="label-caps text-[10px]">Email Address</label>
              <input type="email" className="w-full bg-transparent border-b border-divider-subtle py-4 focus:border-primary transition-colors outline-none" />
            </div>
            <button className="w-full py-6 bg-primary text-on-primary label-caps text-xs font-bold hover:bg-white transition-colors duration-500 rounded-lg">
              Submit Enquiry
            </button>
          </form>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:border-l lg:border-divider-subtle lg:pl-12 flex flex-col justify-between">
          <div>
            <h3 className="text-4xl font-bold mb-12 italic text-primary">Meeting Spaces</h3>
            <div className="space-y-12">
              {[
                { name: "The Boardroom", details: "10 Seats • Full VC Suite" },
                { name: "Podcast Studio", details: "Studio Grade • Soundproofed" },
                { name: "Huddle Alpha", details: "4 Seats • Smart Board" }
              ].map((room, i) => (
                <div key={i} className="flex justify-between items-end border-b border-divider-subtle pb-6 group cursor-pointer">
                  <div>
                    <h4 className="text-2xl font-bold group-hover:text-primary transition-colors text-primary font-display">{room.name}</h4>
                    <p className="text-sm text-text-muted mt-1">{room.details}</p>
                  </div>
                  <div className="text-right">
                    <div className="w-10 h-10 border border-divider-subtle flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-24 pt-12 border-t border-divider-subtle">
            <p className="text-xl italic text-text-secondary leading-relaxed">"A truly unparalleled work environment that inspires intellectual and professional growth."</p>
            <div className="label-caps mt-4">— Architectural Digest</div>
          </div>
        </div>
      </section>
    </main>
  );
}
