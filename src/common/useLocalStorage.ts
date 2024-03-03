import { useCallback, useState } from "react";

export function getLocalStorage<T = unknown>(key: string): T | undefined;
export function getLocalStorage<T = unknown>(key: string, defaultValue: T): T;

/**
 * Get and parse a JSON value from local storage.
 *
 * @param key - The key to use for the local storage item.
 * @param defaultValue - The default value to use if the local storage item is not set.
 * @returns - The parsed local stroge value, or `defaultValue` if the local storage item is not set.
 */
export function getLocalStorage<T = unknown>(key: string, defaultValue?: T): T | undefined {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(err);
    return defaultValue;
  }
}

/**
 * Set a JSON value in local storage.
 *
 * @param key - The key to use for the local storage item.
 * @param value - The value to set.
 */
export function setLocalStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Similar to React.useState, but the value is initialized and stored in local storage.
 *
 * @param key - The key to use for the local storage item.
 * @param defaultValue - The default value to use if the local storage item is not set.
 * @returns - A tuple containing the value and a function to set the value.
 */
export function useLocalStorage<T = undefined>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => getLocalStorage(key, defaultValue));
  const setValueAndLocalStorage = useCallback(
    (value: T) => {
      setLocalStorage(key, value);
      setValue(value);
    },
    [key],
  );
  return [value, setValueAndLocalStorage];
}
