import React from 'react';
import Stepper, { StepperProps } from './Stepper'; // Import Stepper and its props

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
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-br from-gray-900 to-slate-800">
      <div className={`w-full ${maxWidthClass} bg-gray-800 shadow-2xl rounded-xl p-6 sm:p-8`}>
        <h1 className="text-3xl sm:text-4xl font-bold text-sky-400 mb-6 sm:mb-8 text-center">{title}</h1>
        
        {showStepper && stepperProps && (
          <div className="mb-8">
            <Stepper {...stepperProps} />
          </div>
        )}

        {children}
      </div>
      <footer className="mt-8 text-center text-gray-500 text-sm py-4">
        <p>&copy; {new Date().getFullYear()} 탄소 위기 시나리오 생성기. Gemini API 활용.</p>
      </footer>
    </div>
  );
};

export default PageLayout;