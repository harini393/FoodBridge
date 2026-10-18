import React from 'react';
import { AlertTriangle, KeyRound } from 'lucide-react';
import { getMissingFirebaseKeys } from '@/services/firebase/config';

export const FirebaseConfigNotice: React.FC = () => {
  const missingKeys = getMissingFirebaseKeys();

  if (missingKeys.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      className="p-4 rounded-xl bg-[#FEF7EC] border border-[#F8DCA6] text-sm text-[#946200] space-y-2 mb-6"
    >
      <div className="flex items-center gap-2 font-heading font-semibold text-base text-[#946200]">
        <AlertTriangle className="w-5 h-5 text-harvest shrink-0" aria-hidden="true" />
        <span>Firebase Configuration Pending</span>
      </div>
      <p className="text-xs sm:text-sm text-main/80 leading-relaxed">
        Authentication requires your Firebase project keys. To connect a live Firebase project, create a{' '}
        <code className="px-1.5 py-0.5 rounded bg-white font-mono text-xs border border-[#F8DCA6]">
          .env.local
        </code>{' '}
        file in your workspace root based on{' '}
        <code className="px-1.5 py-0.5 rounded bg-white font-mono text-xs border border-[#F8DCA6]">
          .env.example
        </code>
        .
      </p>
      <div className="pt-1">
        <span className="text-xs font-semibold text-main flex items-center gap-1.5 mb-1">
          <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
          Missing / Placeholder Keys:
        </span>
        <ul className="list-disc list-inside text-xs font-mono text-muted space-y-0.5 pl-1">
          {missingKeys.map((key) => (
            <li key={key}>{key}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
