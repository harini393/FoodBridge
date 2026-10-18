import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, HeartHandshake, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Handle Escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'How It Works', to: '/#how-it-works' },
    { label: 'Who Can Join', to: '/#participants' },
    { label: 'Food Safety', to: '/#safety' },
    { label: 'About', to: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border-subtle">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brandmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-forest font-heading font-bold text-xl tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-md px-1 py-0.5"
            aria-label="FoodBridge Home"
          >
            <div className="w-9 h-9 rounded-lg bg-forest text-cream flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5 text-cream" aria-hidden="true" />
            </div>
            <span className="text-xl font-extrabold text-forest">
              Food<span className="text-harvest">Bridge</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 lg:gap-8"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-forest ${
                    isActive && !link.to.includes('#')
                      ? 'text-forest font-semibold'
                      : 'text-muted'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-3.5 py-2 text-sm font-medium text-main hover:text-forest transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-forest hover:bg-forest-hover active:bg-forest-dark rounded-lg transition-colors shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-main hover:text-forest hover:bg-sage/50 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Panel */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-main/50 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        id="mobile-navigation"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs bg-white border-l border-border-subtle p-6 flex flex-col justify-between shadow-card transform transition-transform duration-200 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-forest text-cream flex items-center justify-center">
                <HeartHandshake className="w-4 h-4 text-cream" aria-hidden="true" />
              </div>
              <span className="font-heading font-bold text-lg text-forest">
                Food<span className="text-harvest">Bridge</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-muted hover:text-main rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile menu links" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive && !link.to.includes('#')
                      ? 'bg-sage text-forest font-semibold'
                      : 'text-main hover:bg-sage/40 hover:text-forest'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-border-subtle flex flex-col gap-2.5">
          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-2.5 px-4 text-sm font-medium text-main hover:bg-sage/40 rounded-lg transition-colors border border-border-subtle"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-2.5 px-4 text-sm font-semibold text-white bg-forest hover:bg-forest-hover active:bg-forest-dark rounded-lg transition-colors shadow-subtle"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};
