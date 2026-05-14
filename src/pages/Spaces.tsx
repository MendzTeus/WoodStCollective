import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { rooms } from "../data/rooms";

export default function Spaces() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <main className="bg-background-dark">
      {/* Page Header */}
      <section className="pt-48 pb-24 px-12 max-w-[1440px] mx-auto border-b border-divider-subtle">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl"
        >
          <div className="label-caps mb-8">The Residences</div>
          <h1 className="font-display text-[clamp(64px,10vw,140px)] font-black italic leading-[0.85] text-primary mb-12">
            Rooms &<br />Suites.
          </h1>
          <p className="font-sans text-xl text-text-secondary max-w-2xl leading-relaxed font-light italic">
            Discover our curated selection of private living environments. From minimalist en-suites to expansive signature penthouses, each space is a sanctuary of architectural clarity.
          </p>
        </motion.div>
      </section>

      {/* Rooms Editorial Grid */}
      <section className="py-24 px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="aspect-[3/4] overflow-hidden border border-divider-subtle mb-10 relative">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6">
                  <span className="label-caps bg-background-dark/80 backdrop-blur-md px-4 py-2 text-[10px]">
                    {room.type}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold italic mb-2 group-hover:text-primary transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-sm text-text-muted italic">{room.details}</p>
                </div>
              </div>
              
              <p className="text-text-secondary font-light leading-relaxed mb-10 min-h-[4rem]">
                {room.description}
              </p>

              <Link 
                to={`/coliving/${room.id}`}
                className="inline-flex items-center gap-4 py-4 border-b border-primary/30 group-hover:border-primary transition-colors label-caps text-xs group-hover:gap-6 duration-300"
              >
                View Residence
                <ArrowRight size={16} className="text-primary" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy Break */}
      <section className="py-48 px-12 border-t border-divider-subtle bg-surface-container/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="label-caps mb-12">The Wood Street Ethos</div>
          <h2 className="text-5xl md:text-8xl font-black italic mb-12 leading-[0.9]">
            A higher standard of residency.
          </h2>
          <p className="text-xl text-text-secondary leading-relaxed font-light italic max-w-2xl mx-auto">
            We don't just provide rooms; we provide the foundation for your most productive and peaceful self. Architectural integrity is at the heart of everything we do.
          </p>
        </div>
      </section>
    </main>
  );
}
