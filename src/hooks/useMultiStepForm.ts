import { ReactElement, useState } from 'react';

const useMultiStepForm = (steps: ReactElement[]) => {
  /**
   * hook states
   */
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  /**
   * hook functions
   */
  const next = () =>
    setCurrentStepIndex((index) => {
      if (index >= steps.length - 1) return index;
      return index + 1;
    });

  const back = () =>
    setCurrentStepIndex((index) => {
      if (index <= 0) return index;
      return index - 1;
    });

  const goTo = (index: number) => setCurrentStepIndex(index);

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    goTo,
    next,
    back,
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
  };
};

export default useMultiStepForm;
