import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSiteData } from "../context/SiteContext";
import { toExternalUrl, toMailto } from "../lib/url";
import { trackEvent } from "../lib/analytics";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { data, loadError } = useSiteData();
  const instagramUrl = toExternalUrl(data.settings.instagramUrl);
  const emailUrl = toMailto(data.settings.email);
  const airbnbUrl = toExternalUrl(data.settings.airbnbUrl);

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
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (location.pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background-dark overflow-x-hidden">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-700 border-b ${
          isScrolled 
            ? "h-20 bg-background-dark/95 backdrop-blur-xl border-divider-subtle" 
            : "h-24 bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          <Link to="/" className="font-display text-[clamp(28px,9vw,32px)] font-black text-primary tracking-tighter uppercase italic">
            Wood Street
          </Link>
          
          <div className="hidden md:flex gap-12">
            <Link to="/coliving" className={`nav-link ${location.pathname.startsWith("/coliving") ? "!text-primary" : ""}`}>Co-living</Link>
            <Link to="/coworking" className={`nav-link ${location.pathname.startsWith("/coworking") ? "!text-primary" : ""}`}>Co-working</Link>
            <Link to="/amenities" className={`nav-link ${location.pathname.startsWith("/amenities") ? "!text-primary" : ""}`}>Amenities</Link>
            <Link to="/about" className={`nav-link ${location.pathname.startsWith("/about") ? "!text-primary" : ""}`}>About</Link>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={airbnbUrl || "/coliving"}
              target={airbnbUrl ? "_blank" : undefined}
              rel={airbnbUrl ? "noopener noreferrer" : undefined}
              onClick={() => trackEvent("click_airbnb_top", { link_url: airbnbUrl || "/coliving" })}
              className="hidden lg:block border border-primary text-primary label-caps px-8 py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-all duration-500"
            >
              Airbnb
            </a>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-text-primary p-2"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[60] md:hidden transition ${isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-background-dark/70 backdrop-blur-sm transition-opacity ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside id="mobile-navigation" className={`absolute right-0 top-0 h-full w-[82vw] max-w-sm bg-surface-container border-l border-divider-subtle p-8 transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between mb-14">
            <span className="font-display text-2xl font-black text-primary tracking-tighter uppercase italic">Wood Street</span>
            <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-text-primary" aria-label="Close navigation menu">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col gap-7">
            <Link to="/coliving" className="nav-link text-base">Co-living</Link>
            <Link to="/coworking" className="nav-link text-base">Co-working</Link>
            <Link to="/amenities" className="nav-link text-base">Amenities</Link>
            <Link to="/about" className="nav-link text-base">About</Link>
            <a
              href={airbnbUrl || "/coliving"}
              target={airbnbUrl ? "_blank" : undefined}
              rel={airbnbUrl ? "noopener noreferrer" : undefined}
              onClick={() => trackEvent("click_airbnb_top", { link_url: airbnbUrl || "/coliving" })}
              className="mt-6 border border-primary text-primary label-caps px-6 py-4 rounded-lg text-center"
            >
              Airbnb
            </a>
          </nav>
        </aside>
      </div>

      {loadError && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-red-950/95 border-y border-red-400/30 px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-red-100">
          {loadError}
        </div>
      )}

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
                <li><a href={instagramUrl || "#"} target={instagramUrl ? "_blank" : undefined} rel="noopener noreferrer" onClick={() => trackEvent("click_instagram_footer", { link_url: instagramUrl || "#" })} className="nav-link">Instagram</a></li>
                <li><a href={emailUrl || "#"} onClick={() => trackEvent("click_email_footer")} className="nav-link">Email Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-20 border-t border-divider-subtle gap-12">
            <div className="label-caps text-[10px] opacity-40">© {new Date().getFullYear()} Wood Street Collective. All Rights Reserved.</div>
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
