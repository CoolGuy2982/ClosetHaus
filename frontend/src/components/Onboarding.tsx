import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    title: 'Welcome to ClosetHaus!',
    description: 'Let\'s get your digital closet set up. First, what are some of your favorite styles?',
    key: 'styles',
    type: 'tags',
    options: ['Minimalist', 'Vintage', 'Streetwear', 'Bohemian', 'Classic', 'Y2K', 'Grunge', 'Athleisure'],
  },
  {
    title: 'What\'s Your Goal?',
    description: 'How do you plan to use ClosetHaus?',
    key: 'goal',
    type: 'choice',
    options: ['Archive my collection', 'Discover new outfits', 'Plan my looks', 'All of the above'],
  },
  {
    title: 'You\'re All Set!',
    description: 'Your ClosetHaus is ready. Let\'s start by adding your first few items.',
    key: 'final',
    type: 'final',
  },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<any>({
    styles: [],
    goal: '',
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleTagClick = (option: string) => {
    setOnboardingData((prev: any) => {
      const newStyles = prev.styles.includes(option)
        ? prev.styles.filter((s: string) => s !== option)
        : [...prev.styles, option];
      return { ...prev, styles: newStyles };
    });
  };

  const handleChoiceClick = (option: string) => {
    setOnboardingData((prev: any) => ({ ...prev, goal: option }));
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    switch (step.type) {
      case 'tags':
        return (
          <div className="flex flex-wrap gap-3">
            {step.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleTagClick(option)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  onboardingData.styles.includes(option)
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case 'choice':
        return (
          <div className="flex flex-col gap-3">
            {step.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleChoiceClick(option)}
                className={`w-full p-4 rounded-lg text-left font-medium transition-all ${
                  onboardingData.goal === option
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case 'final':
        return <p className="text-gray-600">You can now explore your closet and start adding items.</p>;
      default:
        return null;
    }
  };

  const step = steps[currentStep];

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{step.title}</h2>
        <p className="text-gray-600 mb-8">{step.description}</p>
        
        <div className="min-h-[150px]">
          {renderStepContent()}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200 ease-in-out mt-8"
        >
          {currentStep === steps.length - 1 ? 'Go to Closet' : 'Continue'}
        </button>

        <div className="flex gap-2 mt-8 justify-center">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full transition-all ${
                index <= currentStep ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};