import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  ShieldCheck,
  Truck,
  Building2,
  Users,
  ChevronDown,
  Clock,
  PackageCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How does someone donate food on FoodBridge?',
    answer:
      'Any registered food donor (such as a restaurant, bakery, corporate cafeteria, or event organizer) logs in and completes a structured donation form. You provide details including food type (cooked or packaged), portion count, total weight, preparation timestamp, allergen disclosure, packaging status, pickup location, and a food photograph. Once submitted, your donation is routed to verified NGOs in your service area.',
  },
  {
    question: 'What specific food safety information is required?',
    answer:
      'To uphold food safety, donors must declare the exact preparation time, storage method (e.g., chilled, ambient, hot-held), packaging condition, and potential allergens (or explicitly select Unknown). Donors also set a collection deadline so food is not picked up after safe handling thresholds have elapsed.',
  },
  {
    question: 'How does NGO registration and verification work?',
    answer:
      'NGOs register by providing official organizational documentation and registration credentials. For safety and accountability, NGO accounts cannot coordinate donations immediately upon signup. An authorized FoodBridge Administrator reviews the application, verifies legitimacy, and approves the NGO before any donation management features are unlocked.',
  },
  {
    question: 'What is the role of delivery volunteers?',
    answer:
      'Volunteers are community members who accept transit assignments created by approved NGOs. When assigned a task, a volunteer reviews the pickup window, donor address, and recipient facility. They confirm the pickup, transport the food safely in insulated carriers or clean containers, and log delivery completion with the recipient receiver name.',
  },
  {
    question: 'How is a food donation reviewed and approved?',
    answer:
      'When a donation is submitted, authorized NGO officers review the food photos, preparation time, and quantities. If the donation meets safety criteria and current community capacity, the NGO approves it, selects an active recipient organization from their directory, and assigns an available volunteer. If rejected, a specific reason is provided to the donor.',
  },
  {
    question: 'Can donors cancel a donation after submitting?',
    answer:
      'Yes. Before food is collected by a volunteer, a donor may submit a cancellation request with a stated reason (e.g., unforeseen spoilage or change in pickup availability). The assigned NGO reviews the request to coordinate safely with any volunteers already en route.',
  },
];

export const HomePage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative bg-cream py-12 sm:py-16 lg:py-20 border-b border-border-subtle">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage text-forest text-xs sm:text-sm font-semibold tracking-wide">
                <HeartHandshake className="w-4 h-4 text-forest shrink-0" aria-hidden="true" />
                <span>Verified Surplus Food Redistribution</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-main leading-[1.15] tracking-tight">
                Bridging surplus food to communities in need, safely and reliably.
              </h1>

              <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
                FoodBridge connects restaurants, caterers, and food donors with verified NGOs and volunteer couriers. Coordinate surplus meals with verified safety details, structured reviews, and transparent delivery confirmation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-forest hover:bg-forest-hover active:bg-forest-dark rounded-lg shadow-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
                >
                  <span>Get Started with FoodBridge</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-main bg-white hover:bg-sage-light active:bg-sage border border-border-subtle rounded-lg shadow-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                >
                  How Coordination Works
                </a>
              </div>

              {/* Truthful Core Pillars */}
              <div className="pt-4 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-status-success shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-medium text-main">
                    Verified NGO Partners
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-status-success shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-medium text-main">
                    Mandatory Safety Disclosures
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-status-success shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-medium text-main">
                    Chain-of-Custody Tracking
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-border-subtle bg-white shadow-card">
                <img
                  src="/images/hero-foodbridge.jpg"
                  alt="Volunteers and coordinators packing boxes of fresh wholesome produce and surplus food at a clean community food distribution hub"
                  className="w-full h-auto aspect-[4/3] object-cover"
                  width="800"
                  height="600"
                  loading="eager"
                />
                <div className="p-4 bg-white border-t border-border-subtle flex items-center justify-between text-xs text-muted">
                  <span className="font-medium text-main">Community Food Distribution</span>
                  <span className="flex items-center gap-1 text-forest font-semibold">
                    <ShieldCheck className="w-4 h-4 text-forest" aria-hidden="true" />
                    Verified Distribution
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white border-b border-border-subtle">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-forest">
              Coordinated Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-main mt-2 tracking-tight">
              Three transparent steps from donor to community
            </h2>
            <p className="text-sm sm:text-base text-muted mt-3">
              FoodBridge coordinates every donation through verified organizational reviews to ensure safe transit and direct impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col bg-cream/70 border border-border-subtle rounded-xl p-6 sm:p-8 relative">
              <div className="flex items-center justify-between mb-5">
                <span className="w-10 h-10 rounded-full bg-forest text-white font-heading font-bold text-base flex items-center justify-center shrink-0">
                  1
                </span>
                <PackageCheck className="w-6 h-6 text-forest shrink-0" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-heading font-bold text-main mb-2">
                Donor Submits Surplus Food
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                The food donor enters food details, preparation timestamps, storage conditions, packaging integrity, allergen alerts, and a food photo. A pickup time window and location are specified.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col bg-cream/70 border border-border-subtle rounded-xl p-6 sm:p-8 relative">
              <div className="flex items-center justify-between mb-5">
                <span className="w-10 h-10 rounded-full bg-forest text-white font-heading font-bold text-base flex items-center justify-center shrink-0">
                  2
                </span>
                <Building2 className="w-6 h-6 text-forest shrink-0" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-heading font-bold text-main mb-2">
                NGO Reviews &amp; Plans Recipient
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                An authorized NGO evaluates the food details and safety standards. Upon approval, they select a verified recipient facility from their directory, set an expected delivery deadline, and assign an available volunteer.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col bg-cream/70 border border-border-subtle rounded-xl p-6 sm:p-8 relative">
              <div className="flex items-center justify-between mb-5">
                <span className="w-10 h-10 rounded-full bg-forest text-white font-heading font-bold text-base flex items-center justify-center shrink-0">
                  3
                </span>
                <Truck className="w-6 h-6 text-forest shrink-0" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-heading font-bold text-main mb-2">
                Volunteer Collects &amp; Delivers
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                The assigned volunteer accepts the mission, collects the food from the donor, records collection notes, and safely transports it to the recipient shelter. Successful delivery is logged with recipient confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Who Can Participate Section */}
      <section id="participants" className="py-16 sm:py-20 bg-cream border-b border-border-subtle">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-forest">
              Roles &amp; Collaboration
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-main mt-2 tracking-tight">
              Designed for each participant in the food rescue network
            </h2>
            <p className="text-sm sm:text-base text-muted mt-3">
              FoodBridge separates responsibilities into distinct, secure roles to ensure accountability at every stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Donors Card */}
            <div className="bg-white border border-border-subtle rounded-xl p-6 sm:p-8 flex flex-col justify-between shadow-subtle">
              <div>
                <div className="w-12 h-12 rounded-lg bg-sage flex items-center justify-center text-forest mb-5">
                  <PackageCheck className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-heading font-bold text-main mb-2">
                  Food Donors
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  Restaurants, caterers, bakeries, campus dining halls, and individuals with safe surplus food. Donors record detailed descriptions, upload food photos, and track review status in real time.
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-main">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0" />
                    Structured 4-step donation submission
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0" />
                    Real-time status history tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0" />
                    Pre-collection cancellation requests
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-border-subtle">
                <Link
                  to="/register"
                  className="text-sm font-semibold text-forest hover:text-forest-hover flex items-center gap-1.5"
                >
                  <span>Register as Donor</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* NGOs Card */}
            <div className="bg-white border border-border-subtle rounded-xl p-6 sm:p-8 flex flex-col justify-between shadow-subtle">
              <div>
                <div className="w-12 h-12 rounded-lg bg-sage flex items-center justify-center text-forest mb-5">
                  <Building2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-heading font-bold text-main mb-2">
                  Verified NGOs
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  Non-profit organizations, community kitchens, and shelters. Following Admin verification, NGO officers review donations, maintain an active recipient directory, and assign volunteer drivers.
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-main">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0" />
                    Admin-reviewed organizational credentialing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0" />
                    Recipient directory and capacity planning
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0" />
                    Volunteer assignment and task reassignment
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-border-subtle">
                <Link
                  to="/register"
                  className="text-sm font-semibold text-forest hover:text-forest-hover flex items-center gap-1.5"
                >
                  <span>Apply as NGO</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Volunteers Card */}
            <div className="bg-white border border-border-subtle rounded-xl p-6 sm:p-8 flex flex-col justify-between shadow-subtle">
              <div>
                <div className="w-12 h-12 rounded-lg bg-sage flex items-center justify-center text-forest mb-5">
                  <Users className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-heading font-bold text-main mb-2">
                  Volunteer Couriers
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  Dedicated individuals who provide on-the-ground transport. Volunteers accept tasks from NGOs, log collection timestamps, and confirm deliveries with the receiving shelter staff.
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-main">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0" />
                    Permitted task details &amp; pickup route
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0" />
                    Accept / decline assignment response
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0" />
                    Verified receiver name delivery confirmation
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-border-subtle">
                <Link
                  to="/register"
                  className="text-sm font-semibold text-forest hover:text-forest-hover flex items-center gap-1.5"
                >
                  <span>Join as Volunteer</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Food Safety & Responsibility Section */}
      <section id="safety" className="py-16 sm:py-20 bg-white border-b border-border-subtle">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-sage/40 border border-border-subtle rounded-2xl p-6 sm:p-10 lg:p-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border-subtle text-forest text-xs font-semibold mb-4">
                <ShieldCheck className="w-4 h-4 text-forest" aria-hidden="true" />
                <span>Food Safety &amp; Responsibility</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-main tracking-tight">
                Safety standards without compromise
              </h2>
              <p className="text-sm sm:text-base text-muted mt-3 leading-relaxed">
                FoodBridge is a coordination platform designed to empower responsible food sharing. Donors and participating NGOs are mutually responsible for upholding hygienic standards, accurate declarations, and timely transit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 sm:mt-10">
              {/* Item 1 */}
              <div className="bg-white p-5 rounded-xl border border-border-subtle">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center text-forest shrink-0">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading font-semibold text-main text-base">
                    Strict Time Windows
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Cooked food donations require clear preparation times and explicit collection deadlines to ensure food is consumed within safe microbiological timeframes.
                </p>
              </div>

              {/* Item 2 */}
              <div className="bg-white p-5 rounded-xl border border-border-subtle">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center text-forest shrink-0">
                    <PackageCheck className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading font-semibold text-main text-base">
                    Packaging Integrity
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  All donated items must be packaged in clean, food-grade, sealable containers or original manufacturer packaging to prevent cross-contamination during transit.
                </p>
              </div>

              {/* Item 3 */}
              <div className="bg-white p-5 rounded-xl border border-border-subtle">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center text-forest shrink-0">
                    <AlertTriangle className="w-4 h-4 text-harvest shrink-0" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading font-semibold text-main text-base">
                    Allergen Declarations
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Donors must disclose major allergens (such as gluten, dairy, nuts, or shellfish). If ingredient composition cannot be verified, an explicit Unknown warning is required.
                </p>
              </div>
            </div>

            {/* Note banner */}
            <div className="mt-8 p-4 rounded-xl bg-white border border-border-subtle flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                <strong className="text-main font-semibold">Coordination Boundary:</strong> FoodBridge provides digital coordination and chain-of-custody tracking. FoodBridge does not independently inspect food items or certify legal compliance; participating organizations agree to abide by municipal food hygiene regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQs Section */}
      <section id="faqs" className="py-16 sm:py-20 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-forest">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-main mt-2 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-muted mt-2">
              Everything you need to know about the FoodBridge donation lifecycle.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              const buttonId = `faq-btn-${index}`;
              const panelId = `faq-panel-${index}`;

              return (
                <div
                  key={faq.question}
                  className="bg-white border border-border-subtle rounded-xl overflow-hidden shadow-subtle transition-colors"
                >
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 font-heading font-semibold text-main text-base sm:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-muted shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-forest' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="px-5 sm:px-6 pb-5 pt-1 text-sm text-muted leading-relaxed border-t border-border-subtle/60"
                    >
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Call To Action Footer Banner */}
      <section className="bg-forest text-white py-12 sm:py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold tracking-tight text-white">
            Ready to help bridge surplus food to where it matters?
          </h2>
          <p className="text-base sm:text-lg text-cream/90 max-w-2xl mx-auto leading-relaxed">
            Join as a food donor, apply as an NGO partner, or register as a volunteer courier. Clean coordination, real accountability.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-forest bg-white hover:bg-cream active:bg-sage rounded-lg transition-colors shadow-subtle"
            >
              Register for an Account
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-white border border-white/30 hover:bg-white/10 rounded-lg transition-colors"
            >
              Learn More About FoodBridge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
