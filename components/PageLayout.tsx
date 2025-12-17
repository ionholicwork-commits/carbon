
import React from 'react';
import Stepper, { StepperProps } from './Stepper';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  showStepper?: boolean;
  stepperProps?: StepperProps;
  fullWidth?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  children, 
  showStepper = false, 
  stepperProps,
  fullWidth = false,
}) => {
  // Optimize for 16:9 PC screens (1920x1080). 
  // Expanded max-width based on user feedback to utilize more screen real estate.
  // fullWidth pages now go up to 1800px (approx 94% of 1920px), providing a spacious dashboard feel.
  // Standard pages now go up to 7xl (approx 1280px) for better readability on wide screens.
  const maxWidthClass = fullWidth 
    ? 'max-w-[1800px] w-[98%] lg:w-[96%]' 
    : 'max-w-7xl w-[95%] md:w-[90%]';

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-slate-900 to-black text-gray-100">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sky-900/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-900/20 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className={`relative z-10 ${maxWidthClass} bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-2xl p-6 sm:p-8 lg:p-10 transition-all duration-300`}>
        <header className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 drop-shadow-sm tracking-tight">
            {title}
          </h1>
          {showStepper && stepperProps && (
            <div className="mt-8 max-w-4xl mx-auto">
              <Stepper {...stepperProps} />
            </div>
          )}
        </header>

        <main className="animate-fade-in">
          {children}
        </main>
      </div>

      <footer className="relative z-10 mt-12 text-center text-gray-500 text-xs sm:text-sm font-medium">
        <p>&copy; {new Date().getFullYear()} Carbon Crisis Scenario Generator. Powered by Gemini API.</p>
      </footer>
    </div>
  );
};

export default PageLayout;
