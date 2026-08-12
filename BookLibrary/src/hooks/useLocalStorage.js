import { useCallback, useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  }, [key, value]);

  const updateValue = useCallback((nextValue) => {
    setValue((current) =>
      typeof nextValue === "function" ? nextValue(current) : nextValue,
    );
  }, []);

  return [value, updateValue];
}
