import React from 'react';
import { AppPage } from '../types';

export interface StepperProps {
  steps: { id: AppPage; name: string }[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
            {stepIdx <= currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${stepIdx < currentStep ? 'bg-sky-600' : 'bg-gray-600'}`}></div>
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-sky-600">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                  </svg>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-600"></div>
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-600 bg-gray-800">
                  <span className="text-gray-400">{`0${stepIdx + 1}`}</span>
                </div>
              </>
            )}
             <span className={`absolute top-10 left-1/2 -translate-x-1/2 text-center text-xs sm:text-sm font-medium ${stepIdx <= currentStep ? 'text-sky-400' : 'text-gray-500'}`}>{step.name}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper;
