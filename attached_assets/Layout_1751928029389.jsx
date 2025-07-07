

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/contexts/AuthContext";
import {
  Home,
  BookOpen,
  Heart,
  User as UserIcon,
  Mail,
  Leaf,
  Instagram,
  MessageCircle,
  Youtube,
  Settings,
  X,
  Menu,
  Moon,
  Sun,
  Search,
  Trophy,
  Crown,
  LayoutGrid,
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

import { AuthProvider } from "@/components/contexts/AuthContext";
import RouteManager from "@/components/routing/RouteManager"; // Changed this line
import GlobalSearch from "./components/shared/GlobalSearch";
import ChatbotWidget from "./components/shared/ChatbotWidget";
import SystemStatus from "./components/system/SystemStatus";
import ErrorBoundary from "./components/system/ErrorBoundary";
import OptimizedImage from "./components/shared/OptimizedImage";

const navigationItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Insights", path: "/blog", icon: BookOpen },
  { name: "Our Picks", path: "/wellness-picks", icon: Heart },
  { name: "Premium", path: "/premium", icon: Crown },
  { name: "Challenges", path: "/challenges", icon: Trophy },
  { name: "Meal Planner", path: "/meal-planner", icon: UtensilsCrossed },
  { name: "Meditation", path: "/meditation-timer", icon: Timer },
  { name: "About", path: "/about", icon: UserIcon },
  { name: "Contact", path: "/contact", icon: Mail }
];

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/pure.living.pro/", icon: Instagram },
  { name: "TikTok", href: "https://www.tiktok.com/@pure.living.pro", icon: Youtube },
  { name: "X / Twitter", href: "https://x.com/pure_living_pro", icon: MessageCircle },
  { name: "Medium", href: "https://medium.com/@cvchaudhary", icon: BookOpen },
  { name: "Threads", href: "https://www.threads.com/@pure.living.pro", icon: MessageCircle },
  { name: "Pinterest", href: "https://uk.pinterest.com/cvchaudhary/", icon: LayoutGrid }
];

// Helper function to detect development mode
const isDevelopmentMode = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('dev') ||
         window.location.port !== '';
};

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const enhancedNavItems = [
    ...navigationItems,
    ...(isAuthenticated ? [{ name: "My Hub", path: "/dashboard", icon: LayoutDashboard }] : []),
    ...(isAuthenticated ? [{ name: "My Plan", path: "/wellness-plan", icon: ClipboardList }] : []),
    ...(currentUser?.role === 'admin' ? [{ name: "Admin", path: "/admin", icon: Settings }] : [])
  ].filter((item, index, self) => index === self.findIndex((t) => t.path === item.path));

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <style>
          {`
            @layer base {
              :root {
                --background: 220 20% 99%; /* Softer off-white */
                --foreground: 220 10% 20%; /* Softer black */
                
                --card: 220 20% 100%;
                --card-foreground: 220 10% 20%;
                
                --popover: 220 20% 100%;
                --popover-foreground: 220 10% 20%;
                
                --primary: 95 30% 40%; /* Sage Green */
                --primary-foreground: 220 20% 99%;
                
                --secondary: 45 50% 95%; /* Cream */
                --secondary-foreground: 95 30% 40%;
                
                --muted: 220 15% 95%;
                --muted-foreground: 220 10% 45%;
                
                --accent: 40 90% 65%; /* Gold Accent */
                --accent-foreground: 220 10% 20%;

                --destructive: 0 84.2% 60.2%;
                --destructive-foreground: 0 0% 98%;

                --border: 220 15% 90%;
                --input: 220 15% 92%;
                --ring: 40 90% 55%;

                --radius: 0.75rem; /* Slightly more rounded */
              }

              .dark {
                --background: 220 10% 12%;
                --foreground: 220 15% 90%;
                
                --card: 220 10% 15%;
                --card-foreground: 220 15% 90%;
                
                --popover: 220 10% 15%;
                --popover-foreground: 220 15% 90%;
                
                --primary: 95 30% 50%;
                --primary-foreground: 220 10% 12%;
                
                --secondary: 45 30% 20%;
                --secondary-foreground: 45 50% 90%;

                --muted: 220 10% 20%;
                --muted-foreground: 220 10% 55%;

                --accent: 40 80% 60%;
                --accent-foreground: 220 10% 12%;

                --destructive: 0 62.8% 30.6%;
                --destructive-foreground: 0 0% 98%;

                --border: 220 10% 25%;
                --input: 220 10% 22%;
                --ring: 40 80% 55%;
              }
            }
            
            .premium-shadow {
              box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06);
            }
            
            .organic-border {
              border-radius: var(--radius);
            }

            .logo-container {
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(10px);
              border-radius: 1rem;
              padding: 0.5rem 1rem;
              border: 1px solid rgba(255, 255, 255, 0.2);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }

            .dark .logo-container {
              background: rgba(31, 35, 31, 0.95);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }

            @media (prefers-reduced-motion: reduce) {
              *,
              *::before,
              *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
              }
            }
            
            @layer utilities {
              .perspective-1000 {
                perspective: 1000px;
              }
            }
          `}
        </style>

        <nav className={`bg-background/80 backdrop-blur-lg sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''} border-b border-border`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 md:h-20">
              <Link to="/" className="flex items-center">
                <div className="logo-container">
                  <OptimizedImage
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7922d7bf4_LogoFinal.jpg"
                    alt="Pure Living Pro - Holistic Wellness & Natural Living"
                    className="h-10 w-auto"
                    width={120}
                    height={40}
                    crop="fit"
                    gravity="center"
                    loading="eager"
                    quality="auto:best"
                    sizes="120px"
                    enableModernFormats={true}
                  />
                </div>
              </Link>

              <div className="hidden md:flex items-center space-x-1">
                {enhancedNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted ${
                        isActive 
                          ? "text-primary-foreground bg-primary/90" 
                          : "text-foreground/70 hover:text-foreground/90"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="text-foreground/70 hover:text-foreground/90 hover:bg-muted"
                >
                  <Search className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="text-foreground/70 hover:text-foreground/90 hover:bg-muted"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>

                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMobileMenu}
                    className="text-foreground/70"
                  >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </Button>
                </div>
              </div>
            </div>

            {isMobileMenuOpen && (
              <div className="md:hidden border-t border-border py-4">
                <div className="flex flex-col space-y-2">
                  {enhancedNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive 
                            ? "text-primary-foreground bg-primary/90" 
                            : "text-foreground/70 hover:text-foreground/90 hover:bg-muted"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        <main className="flex-1">
          <RouteManager />
        </main>

        <footer className="bg-secondary/50 border-t border-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="mb-6">
                  <div className="logo-container inline-block">
                    <OptimizedImage
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7922d7bf4_LogoFinal.jpg"
                      alt="Pure Living Pro - Holistic Wellness & Natural Living"
                      className="h-12 w-auto"
                      width={140}
                      height={48}
                      crop="fit"
                      gravity="center"
                      loading="lazy"
                      quality="auto:good"
                      sizes="140px"
                      enableModernFormats={true}
                    />
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Empowering your wellness journey with evidence-based insights, natural remedies, 
                  and carefully curated products for holistic health.
                </p>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a 
                      key={social.name}
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label={`Follow us on ${social.name}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {navigationItems.slice(0, 4).map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Affiliate Disclosure
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border text-center">
              <p className="text-muted-foreground text-sm">
                © 2025 Pure Living Pro. All rights reserved. | Empowering wellness through natural living.
              </p>
            </div>
          </div>
        </footer>

        <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <ChatbotWidget />
        
        {isDevelopmentMode() && (
          <SystemStatus isVisible={true} />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <AuthProvider>
      <LayoutContent children={children} currentPageName={currentPageName} />
    </AuthProvider>
  );
}

