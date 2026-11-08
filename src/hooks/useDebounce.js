import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce value updates.
 * Prevents hitting the API on every keystroke.
 * 
 * @param {any} value - Immediate value to debounce
 * @param {number} delay - Inactivity delay in ms (defaults to 500ms)
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel timeout if value changes (user continues typing) or component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
