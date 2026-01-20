import React, { useState } from 'react';
import { Briefcase, User, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AccountType } from '../types';
import { APP_COPY } from '../lib/copy';

interface OnboardingProps {
  onComplete: (types: AccountType[]) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [selectedTypes, setSelectedTypes] = useState<AccountType[]>([]);

  const toggleType = (type: AccountType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{APP_COPY.onboarding.title}</h1>
          <p className="mt-3 text-zinc-500">
            {APP_COPY.onboarding.subtitle}
          </p>
        </div>

        <div className="grid gap-4 mt-8">
          <button
            onClick={() => toggleType('personal')}
            className={`relative flex items-center p-6 rounded-2xl border-2 transition-all duration-200 ${
              selectedTypes.includes('personal')
                ? 'border-brand-400 bg-brand-50'
                : 'border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-md'
            }`}
          >
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              selectedTypes.includes('personal') ? 'bg-brand-200 text-brand-900' : 'bg-zinc-100 text-zinc-500'
            }`}>
              <User className="h-6 w-6" />
            </div>
            <div className="ml-4 text-left flex-1">
              <h3 className="font-semibold text-zinc-900">{APP_COPY.onboarding.personalTitle}</h3>
              <p className="text-sm text-zinc-500">{APP_COPY.onboarding.personalDesc}</p>
            </div>
            {selectedTypes.includes('personal') && (
              <CheckCircle2 className="h-6 w-6 text-brand-500 absolute top-6 right-6" />
            )}
          </button>

          <button
            onClick={() => toggleType('business')}
            className={`relative flex items-center p-6 rounded-2xl border-2 transition-all duration-200 ${
              selectedTypes.includes('business')
                ? 'border-brand-400 bg-brand-50'
                : 'border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-md'
            }`}
          >
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              selectedTypes.includes('business') ? 'bg-brand-200 text-brand-900' : 'bg-zinc-100 text-zinc-500'
            }`}>
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="ml-4 text-left flex-1">
              <h3 className="font-semibold text-zinc-900">{APP_COPY.onboarding.businessTitle}</h3>
              <p className="text-sm text-zinc-500">{APP_COPY.onboarding.businessDesc}</p>
            </div>
            {selectedTypes.includes('business') && (
              <CheckCircle2 className="h-6 w-6 text-brand-500 absolute top-6 right-6" />
            )}
          </button>
        </div>

        <div className="pt-8">
          <Button 
            size="lg" 
            className="w-full" 
            onClick={() => onComplete(selectedTypes)}
            disabled={selectedTypes.length === 0}
          >
            {APP_COPY.onboarding.continueButton}
          </Button>
          <p className="mt-4 text-xs text-zinc-400">
            {APP_COPY.onboarding.footerNote}
          </p>
        </div>
      </div>
    </div>
  );
};