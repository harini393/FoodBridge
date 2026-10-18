import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ShieldCheck, HelpCircle, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-border-subtle mt-auto">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 text-forest font-heading font-bold text-xl"
              aria-label="FoodBridge Home"
            >
              <div className="w-8 h-8 rounded-lg bg-forest text-cream flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4 text-cream" aria-hidden="true" />
              </div>
              <span>
                Food<span className="text-harvest">Bridge</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              A transparent, coordinated platform connecting food donors, verified NGOs, and volunteers to distribute surplus food to communities in need safely and efficiently.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sage text-xs font-medium text-forest">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                Verified NGO Coordination
              </span>
            </div>
          </div>

          {/* Platform Workflows */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-main mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/#how-it-works"
                  className="text-muted hover:text-forest transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/#participants"
                  className="text-muted hover:text-forest transition-colors"
                >
                  Participant Roles
                </Link>
              </li>
              <li>
                <Link
                  to="/#safety"
                  className="text-muted hover:text-forest transition-colors"
                >
                  Food Safety Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/#faqs"
                  className="text-muted hover:text-forest transition-colors"
                >
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Access & Registration */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-main mb-4">
              Access
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/login"
                  className="text-muted hover:text-forest transition-colors"
                >
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-muted hover:text-forest transition-colors"
                >
                  Register as Donor / Volunteer
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted hover:text-forest transition-colors"
                >
                  About the Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic & Legal Context */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-main mb-4">
              Information & Guidelines
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/privacy-terms"
                  className="text-muted hover:text-forest transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
                  Privacy & Safety Terms
                </Link>
              </li>
              <li>
                <Link
                  to="/about#standards"
                  className="text-muted hover:text-forest transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
                  Operational Standards
                </Link>
              </li>
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-cream border border-border-subtle text-xs text-muted leading-relaxed">
              Developed as a final-year Bachelor of Computer Applications (BCA) project demonstrating secure, role-based food redistribution architecture.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} FoodBridge Project. Built with React, TypeScript & Cloud Firestore.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-terms" className="hover:text-forest transition-colors">
              Privacy & Data Policy
            </Link>
            <span aria-hidden="true" className="text-border-subtle">•</span>
            <Link to="/about" className="hover:text-forest transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
