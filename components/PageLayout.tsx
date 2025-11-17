import React from 'react';
import Stepper, { StepperProps } from './Stepper'; // Import Stepper and its props
import SkipLink from './SkipLink';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  showStepper?: boolean;
  stepperProps?: StepperProps;
  fullWidth?: boolean; // To accommodate the full scenario page
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  children, 
  showStepper = false, 
  stepperProps,
  fullWidth = false,
}) => {
  const maxWidthClass = fullWidth ? 'max-w-5xl' : 'max-w-7xl'; // Use a wider max-width for 2-column layout

  return (
    <>
      <SkipLink />
      <div className="min-h-screen flex flex-col items-center justify-start p-6 sm:p-8 bg-gradient-to-br from-gray-900 via-gray-900 to-slate-800">
        <div className={`w-full ${maxWidthClass} bg-gray-800 shadow-2xl rounded-xl p-8 sm:p-12 border border-gray-700`}>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-sky-400 mb-8 sm:mb-10 text-center leading-tight">{title}</h1>

          {showStepper && stepperProps && (
            <div className="mb-10">
              <Stepper {...stepperProps} />
            </div>
          )}

          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
        </div>
        <footer className="mt-12 text-center text-gray-500 text-sm py-4">
          <p>&copy; {new Date().getFullYear()} 탄소 위기 시나리오 생성기. Gemini API 활용.</p>
        </footer>
      </div>
    </>
  );
};

export default PageLayout;