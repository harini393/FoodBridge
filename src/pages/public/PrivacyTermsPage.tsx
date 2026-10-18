import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Shield, Lock, FileText, AlertCircle } from 'lucide-react';

export const PrivacyTermsPage: React.FC = () => {
  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <PageHeader
          title="Privacy Policy &amp; Terms of Coordination"
          description="Clear and transparent guidelines governing food coordination, safety responsibilities, and data handling on the FoodBridge platform."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-border-subtle shadow-subtle">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-heading font-bold text-main flex items-center gap-2">
                <FileText className="w-5 h-5 text-forest" aria-hidden="true" />
                1. Purpose and Operational Scope
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                FoodBridge is a software platform developed as a final-year Bachelor of Computer Applications (BCA) capstone project. Its objective is to coordinate the recovery and distribution of surplus food between registered food donors, verified non-governmental organizations (NGOs), and community volunteer couriers.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                FoodBridge operates strictly as a digital coordination tool and does not purchase, resell, or directly package food products.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl font-heading font-bold text-main flex items-center gap-2">
                <Shield className="w-5 h-5 text-forest" aria-hidden="true" />
                2. Food Safety &amp; Donor Responsibility
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Food donors are solely responsible for ensuring that donated items are safe, wholesome, unadulterated, and handled under hygienic conditions prior to volunteer pickup. Donors must provide truthful and accurate information regarding:
              </p>
              <ul className="list-disc list-inside text-sm text-muted space-y-1.5 pl-2">
                <li>Exact preparation date and time for cooked meals.</li>
                <li>Appropriate holding temperature and storage method.</li>
                <li>Packaging integrity (sealed, food-grade containers).</li>
                <li>Presence of major allergens or explicit declaration of unknown ingredients.</li>
                <li>Reasonable pickup windows to prevent temperature abuse or spoilage.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-heading font-bold text-main flex items-center gap-2">
                <Lock className="w-5 h-5 text-forest" aria-hidden="true" />
                3. User Data &amp; Privacy Protection
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                We respect your personal privacy. Data collected during registration and operational workflows (such as donor pickup addresses and volunteer contact numbers) is shared only between authorized parties directly involved in that specific donation's chain-of-custody.
              </p>
              <ul className="list-disc list-inside text-sm text-muted space-y-1.5 pl-2">
                <li>We do not sell, rent, or monetize user data.</li>
                <li>Admin operations and state changes are recorded in audit logs to prevent misuse.</li>
                <li>User passwords and authentication tokens are secured via Firebase Authentication.</li>
                <li>Uploaded documents are protected through strict Firebase Storage security rules.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-heading font-bold text-main flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-forest" aria-hidden="true" />
                4. Disclaimer of Warranties
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                The FoodBridge coordination software is provided on an &ldquo;as-is&rdquo; basis for educational and non-profit community coordination purposes. While best practices and safety declarations are enforced through the user interface and security rules, the platform developers do not conduct physical laboratory food testing or on-site inspections.
              </p>
            </section>
          </div>

          {/* Quick Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-sage/40 border border-border-subtle rounded-xl p-5 space-y-3">
              <h3 className="font-heading font-bold text-forest text-base">
                Key Points Summary
              </h3>
              <ul className="space-y-2.5 text-xs text-muted">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                  <span>No commercial resale of donated food is permitted.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                  <span>Allergen disclosure is mandatory on all donations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                  <span>NGOs must be verified by an Administrator before coordinating food.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                  <span>Personal contact info is restricted to authorized coordinators.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-border-subtle rounded-xl p-5 text-xs text-muted space-y-2">
              <div className="font-semibold text-main">Questions or Inquiries?</div>
              <p>
                For questions regarding this academic implementation or architecture documentation, consult the project repository and developer README.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
