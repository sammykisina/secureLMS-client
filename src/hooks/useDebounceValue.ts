import { useEffect, useState } from 'react';

const useDebounceValue = (value: string | number, time = 250) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, time);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, time]);

  return debounceValue;
};

export default useDebounceValue;
