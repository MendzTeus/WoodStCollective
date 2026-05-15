import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { useSiteData, Room, Review } from "../context/SiteContext";

export default function Spaces() {
  const { data } = useSiteData();
  const pageData = data.pages['Spaces'];
  const rooms: Room[] = Object.values(data.rooms);
  const allReviews: Review[] = Object.values(data.reviews);
  const reviews = allReviews.filter(r => r.approved);

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
          <h1 className="font-display text-[clamp(64px,10vw,140px)] font-black italic leading-[0.85] text-primary mb-12 whitespace-pre-line">
            {pageData.title}
          </h1>
          <p className="font-sans text-xl text-text-secondary max-w-2xl leading-relaxed font-light italic">
            {pageData.description}
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
              <Link
                to={`/coliving/${room.id}`}
                className="aspect-[3/4] overflow-hidden border border-divider-subtle mb-10 relative rounded-2xl block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`View ${room.name}`}
              >
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6">
                  <span className="label-caps bg-background-dark/80 backdrop-blur-md px-4 py-2 text-[10px] rounded-lg">
                    {room.type}
                  </span>
                </div>
              </Link>
              
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
      <section className="py-48 px-12 border-t border-divider-subtle bg-surface-container/30 rounded-t-[80px]">
        <div className="max-w-4xl mx-auto text-center mb-32">
          <div className="label-caps mb-12">The Wood Street Ethos</div>
          <h2 className="text-5xl md:text-8xl font-black italic mb-12 leading-[0.9]">
            A higher standard of residency.
          </h2>
          <p className="text-xl text-text-secondary leading-relaxed font-light italic max-w-2xl mx-auto">
            We don't just provide rooms; we provide the foundation for your most productive and peaceful self. Architectural integrity is at the heart of everything we do.
          </p>
        </div>
        
        {/* REVIEWS BLOCK */}
        {reviews.length > 0 && (
          <div className="max-w-[1440px] mx-auto mt-24">
            <div className="label-caps mb-12 text-center text-primary">Resident Testimonials</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review, i) => (
                <motion.div 
                  key={review.id}
                  {...fadeIn}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="bg-background-dark p-10 border border-divider-subtle rounded-3xl"
                >
                  <div className="flex gap-1 text-primary mb-8">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-primary" : "text-divider-subtle"} />
                    ))}
                  </div>
                  <p className="text-lg text-text-primary leading-relaxed italic mb-8 font-serif">
                    "{review.comment}"
                  </p>
                  <div>
                    <div className="font-bold text-sm tracking-wide text-primary">{review.reviewerName}</div>
                    <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">{review.reviewerRole}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
