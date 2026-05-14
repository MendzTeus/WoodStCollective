import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Always scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-700 border-b ${
          isScrolled 
            ? "h-20 bg-background-dark/95 backdrop-blur-xl border-divider-subtle" 
            : "h-24 bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-12 h-full flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-black text-primary tracking-tighter uppercase italic">
            Wood Street
          </Link>
          
          <div className="hidden md:flex gap-12">
            <Link to="/coliving" className={`nav-link ${location.pathname === "/coliving" ? "!text-primary" : ""}`}>Co-living</Link>
            <Link to="/coworking" className={`nav-link ${location.pathname === "/coworking" ? "!text-primary" : ""}`}>Co-working</Link>
            <Link to="/amenities" className={`nav-link ${location.pathname === "/amenities" ? "!text-primary" : ""}`}>Amenities</Link>
            <Link to="/about" className={`nav-link ${location.pathname === "/about" ? "!text-primary" : ""}`}>About</Link>
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden lg:block border border-primary text-primary label-caps px-8 py-3 rounded-none hover:bg-primary hover:text-on-primary transition-all duration-500">
              Airbnb
            </button>
            <button className="md:hidden text-text-primary">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer className="border-t border-divider-subtle py-32 px-12 bg-background-dark relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start mb-32">
            <div className="md:col-span-6">
              <span className="font-display text-[8vw] font-black italic text-primary tracking-tighter leading-none block mb-8">
                Wood Street
              </span>
              <p className="text-text-muted max-w-sm text-lg leading-relaxed italic">Redefining professional excellence through architectural clarity and community.</p>
            </div>
            
            <div className="md:col-span-3">
              <h4 className="label-caps mb-10">Navigation</h4>
              <ul className="space-y-6">
                <li><Link to="/" className="nav-link">Home</Link></li>
                <li><Link to="/coliving" className="nav-link">Co-living</Link></li>
                <li><Link to="/coworking" className="nav-link">Co-working</Link></li>
                <li><Link to="/amenities" className="nav-link">Amenities</Link></li>
                <li><Link to="/about" className="nav-link">About Us</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="label-caps mb-10">Connect</h4>
              <ul className="space-y-6">
                <li><a href="#" className="nav-link">Instagram</a></li>
                <li><a href="#" className="nav-link">LinkedIn</a></li>
                <li><a href="#" className="nav-link">Twitter / X</a></li>
                <li><a href="#" className="nav-link">Email Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-20 border-t border-divider-subtle gap-12">
            <div className="label-caps text-[10px] opacity-40">© 2024 Wood Street Collective. All Rights Reserved.</div>
            <div className="flex gap-16">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                <span className="label-caps text-[10px]">Space Available / Suite 402</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
