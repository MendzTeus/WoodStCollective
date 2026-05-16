import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { motion } from "motion/react";
import { 
  Clock, 
  Monitor, 
  Coffee, 
  Wifi, 
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteData, Room } from "../context/SiteContext";
import { openMailEnquiry } from "../lib/enquiry";

export default function Home() {
  const { data } = useSiteData();
  const pageData = data.pages['Home'];
  const rooms: Room[] = Object.values(data.rooms);
  const featuredReviews = useMemo(() => {
    const seenComments = new Set<string>();

    return Object.values(data.reviews)
      .map((review, index) => ({ review, index }))
      .filter(({ review }) => review.approved && review.rating >= 4)
      .filter(({ review }) => {
        const key = review.comment.trim().toLowerCase();
        if (!key || seenComments.has(key)) return false;
        seenComments.add(key);
        return true;
      })
      .sort((a, b) => Number(b.review.showOnHome) - Number(a.review.showOnHome) || a.index - b.index)
      .map(({ review }) => review)
      .slice(0, 18);
  }, [data.reviews]);
  const [reviewSlideIndex, setReviewSlideIndex] = useState(0);
  const visibleReviews = useMemo(() => {
    if (featuredReviews.length <= 3) return featuredReviews;

    return Array.from({ length: 3 }, (_, index) => (
      featuredReviews[(reviewSlideIndex + index) % featuredReviews.length]
    ));
  }, [featuredReviews, reviewSlideIndex]);

  useEffect(() => {
    setReviewSlideIndex(0);
  }, [featuredReviews.length]);

  useEffect(() => {
    if (featuredReviews.length <= 3) return;

    const interval = window.setInterval(() => {
      setReviewSlideIndex((current) => (current + 1) % featuredReviews.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [featuredReviews.length]);

  const handleResidencyEnquiry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get('website')) return;

    openMailEnquiry('Wood Street residency enquiry', {
      'Given name': formData.get('givenName') || '',
      'Surname': formData.get('surname') || '',
      'Email': formData.get('email') || '',
      'Interest': 'Co-living residency',
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
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden border-b border-divider-subtle">
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

        <div className="relative z-10 min-h-screen max-w-[1440px] mx-auto px-12 pt-48 pb-24 flex items-center">
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-[clamp(64px,10vw,140px)] font-black italic leading-[0.85] text-primary mb-12 whitespace-pre-line"
            >
              {pageData.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl text-text-secondary max-w-xl leading-relaxed font-light italic mb-12"
            >
              {pageData.description}
            </motion.p>
            <Link to="/coliving">
              <button className="bg-primary text-on-primary px-10 py-5 label-caps text-xs font-bold hover:bg-white transition-colors duration-500 rounded-lg">
                Take a look
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-divider-subtle">
        {/* Bottom Rail - Editorial Stats/Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          <Link to="/coliving" className="bottom-rail-item group cursor-pointer hover:bg-primary/5 transition-colors">
            <div>
              <h4 className="label-caps text-xs mb-2">Co-Living Rooms</h4>
              <p className="text-sm text-text-secondary leading-relaxed">Six private en-suite rooms designed for rest, focus, and flexibility.</p>
            </div>
          </Link>
          <Link to="/coworking" className="bottom-rail-item group cursor-pointer border-x border-divider-subtle hover:bg-primary/5 transition-colors">
            <div>
              <h4 className="label-caps text-xs mb-2">Co-Working Space</h4>
              <p className="text-sm text-text-secondary leading-relaxed">Rooftop hot desks, fast Wi-Fi, and monitors - included with every stay.</p>
            </div>
          </Link>
          <Link to="/amenities" className="bottom-rail-item group cursor-pointer hover:bg-primary/5 transition-colors">
            <div>
              <h4 className="label-caps text-xs mb-2">Roof Terrace</h4>
              <p className="text-sm text-text-secondary leading-relaxed">Outdoor seating above the city - to work, eat, or just breathe.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Residences Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-divider-subtle">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <motion.h2 {...fadeIn} className="text-5xl md:text-6xl font-black italic leading-none text-primary">
            The<br />Rooms.
          </motion.h2>
          <Link to="/coliving">
            <motion.div {...fadeIn} className="label-caps border-b border-primary pb-2 flex items-center gap-4 hover:gap-6 transition-all duration-300">
              View All Rooms <ArrowRight size={14} />
            </motion.div>
          </Link>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16"
        >
          {rooms.map((room) => (
            <motion.div 
              key={room.id}
              variants={fadeIn}
              className="group cursor-pointer"
            >
              <Link to={`/coliving/${room.id}`}>
            <div className="relative aspect-[3/4] overflow-hidden mb-6 border border-divider-subtle rounded-2xl">
                  <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                src={room.image} 
                    alt={room.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute top-6 left-6 label-caps text-[10px] bg-background-dark/80 backdrop-blur-md px-4 py-2 border border-divider-subtle rounded-lg">
                    {room.type}
                  </div>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="min-w-0">
                    <h3 className="text-3xl font-bold italic mb-2 text-primary font-display whitespace-nowrap overflow-hidden text-ellipsis">{room.name}</h3>
                    <p className="text-text-muted text-sm italic leading-relaxed">{room.details}</p>
                    <p className="text-primary text-xs mt-3 font-bold">★ {room.rating} ({room.reviewsCount} reviews)</p>
                  </div>
                  <div className="w-10 h-10 border border-divider-subtle flex shrink-0 items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                      <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <motion.h2 {...fadeIn} className="text-5xl md:text-7xl font-black italic max-w-xl leading-none text-primary">
            Everything Included.
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
            { icon: <Clock size={40} />, title: "24/7 Access", desc: "Secure, round-the-clock access for all guests." },
            { icon: <Monitor size={40} />, title: "Workspace Included", desc: "Rooftop hot desks with monitors and fast Wi-Fi - use it as long as you need." },
            { icon: <Coffee size={40} />, title: "Shared Kitchen", desc: "Fully equipped kitchen with appliances, utensils, and dining area on the second floor." }
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
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
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
            <div className="label-caps mb-6">Stay. Plug in. Work better.</div>
            <h2 className="text-5xl md:text-8xl font-black italic drop-shadow-2xl text-primary">More than accommodation - a smarter way to be in Manchester.</h2>
          </motion.div>
        </div>
      </section>

      {featuredReviews.length > 0 && (
        <section className="py-24 md:py-32 px-6 md:px-12 max-w-[1440px] mx-auto border-t border-divider-subtle">
          <div className="label-caps mb-12 text-center text-primary">Resident Testimonials</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleReviews.map((review, i) => (
              <motion.div
                key={`${review.id}-${reviewSlideIndex}`}
                {...fadeIn}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="bg-surface-container p-10 border border-divider-subtle rounded-2xl min-h-[420px]"
              >
                <div className="flex gap-1 text-primary mb-8">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className={index < review.rating ? "text-primary" : "text-divider-subtle"}>★</span>
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
          {featuredReviews.length > 3 && (
            <div className="mt-10 flex justify-center gap-2" aria-hidden="true">
              {featuredReviews.slice(0, 6).map((review, index) => (
                <span
                  key={review.id}
                  className={`h-1.5 rounded-full transition-all duration-500 ${index === reviewSlideIndex % 6 ? 'w-8 bg-primary' : 'w-1.5 bg-divider-subtle'}`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Enquiry Form */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-4xl mx-auto gap-y-24 border-t border-divider-subtle">
        <div>
          <h2 className="text-5xl md:text-6xl font-black italic mb-8 leading-[0.9] text-primary">Book Your Stay.</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-12 max-w-md italic">Get in touch to check availability - we'll get back to you directly.</p>
          
          <form className="space-y-10" onSubmit={handleResidencyEnquiry}>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label htmlFor="home-given-name" className="label-caps text-[10px]">Given Name</label>
                <input id="home-given-name" name="givenName" type="text" required className="w-full bg-transparent border-b border-divider-subtle py-4 focus:border-primary transition-colors outline-none" />
              </div>
              <div className="space-y-3">
                <label htmlFor="home-surname" className="label-caps text-[10px]">Surname</label>
                <input id="home-surname" name="surname" type="text" required className="w-full bg-transparent border-b border-divider-subtle py-4 focus:border-primary transition-colors outline-none" />
              </div>
            </div>
            <div className="space-y-3">
              <label htmlFor="home-email" className="label-caps text-[10px]">Email Address</label>
              <input id="home-email" name="email" type="email" required className="w-full bg-transparent border-b border-divider-subtle py-4 focus:border-primary transition-colors outline-none" />
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
