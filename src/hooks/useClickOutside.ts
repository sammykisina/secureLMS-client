import { type MutableRefObject, useEffect } from 'react';

const useClickOutside = (
  ref: MutableRefObject<Element | null>,
  handle: () => void
) => {
  /**
   * hook functions
   */
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);

    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (!ref.current?.contains(event.target as Node)) handle();
  };
};

export default useClickOutside;
