import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  Shield,
  Users,
  Code2,
  FileCheck2,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Header */}
        <PageHeader
          title="About FoodBridge"
          description="A coordinated platform built to address surplus food recovery, ensure food safety compliance, and maintain a verifiable chain-of-custody."
        />

        {/* Mission & Problem Statement */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-forest">
              Our Purpose
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-main">
              Preventing food waste through verified coordination
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Every day, wholesome, prepared meals and packaged foods from restaurants, corporate cafeterias, and catered events are discarded simply because coordinating prompt, safe transport to community centers is logistically challenging.
            </p>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              FoodBridge solves this operational bottleneck by connecting donors with pre-verified local NGOs who maintain recipient directories and dispatch volunteers for punctual pickup and delivery.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-card space-y-4">
            <h3 className="font-heading font-bold text-lg text-main flex items-center gap-2">
              <Shield className="w-5 h-5 text-forest" aria-hidden="true" />
              Core Architecture Principles
            </h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-status-success shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong className="text-main">Role-based Access Control:</strong> Distinct workflows for Donors, NGOs, Volunteers, and Admins enforced beyond the frontend.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-status-success shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong className="text-main">Admin-Verified NGOs:</strong> Non-profit organizations must undergo credential review before accessing distribution tools.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-status-success shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong className="text-main">Chain-of-Custody Tracking:</strong> Real-time status history from submission, through review, assignment, collection, and confirmed delivery.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-status-success shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong className="text-main">Data Integrity &amp; Auditability:</strong> Sensitive state transitions are audited with timestamps, actors, and reasons.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Academic Context */}
        <section className="bg-white border border-border-subtle rounded-2xl p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-sage flex items-center justify-center text-forest">
              <Code2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-forest tracking-wider">
                Academic Project Context
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-main">
                Bachelor of Computer Applications (BCA) Capstone
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
            FoodBridge was conceived and developed as a final-year BCA project. The project demonstrates full-stack software engineering principles, reactive user interface architecture, strict TypeScript typing, declarative state machines for donation lifecycles, and Cloud Firestore security rules.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border-subtle">
            <div>
              <div className="text-xs font-semibold text-main uppercase">Frontend Stack</div>
              <div className="text-sm text-muted mt-1">React, TypeScript, Vite, Tailwind CSS</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-main uppercase">Backend &amp; Security</div>
              <div className="text-sm text-muted mt-1">Firebase Auth, Cloud Firestore, Storage Rules</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-main uppercase">Quality Assurance</div>
              <div className="text-sm text-muted mt-1">Vitest, React Testing Library, ESLint</div>
            </div>
          </div>
        </section>

        {/* Operational Standards */}
        <section id="standards" className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-forest">
              Operational Integrity
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-main">
              Platform Standards &amp; Ethical Commitments
            </h2>
            <p className="text-sm sm:text-base text-muted max-w-2xl">
              We hold the platform to rigorous operational standards to ensure community trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-border-subtle space-y-3">
              <FileCheck2 className="w-6 h-6 text-forest" aria-hidden="true" />
              <h3 className="font-heading font-semibold text-main text-base">
                Verifiable Documentation
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                NGO registrations require valid tax exemption or registration certificates reviewed manually by platform administrators before activation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-subtle space-y-3">
              <Users className="w-6 h-6 text-forest" aria-hidden="true" />
              <h3 className="font-heading font-semibold text-main text-base">
                Dignified Distribution
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Surplus food is treated with the highest care and routed exclusively to certified shelters and community centers with verified capacity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-subtle space-y-3">
              <HeartHandshake className="w-6 h-6 text-forest" aria-hidden="true" />
              <h3 className="font-heading font-semibold text-main text-base">
                Zero Commercial Exploitation
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                FoodBridge is strictly non-commercial. Food donations cannot be resold, exchanged for remuneration, or diverted from intended recipient facilities.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="p-8 rounded-2xl bg-sage/40 border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading font-bold text-xl text-main">
              Want to get involved?
            </h3>
            <p className="text-sm text-muted mt-1">
              Join as a donor, volunteer, or partner organization today.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-forest hover:bg-forest-hover rounded-lg transition-colors shrink-0 shadow-subtle"
          >
            <span>Explore Registration</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
};
