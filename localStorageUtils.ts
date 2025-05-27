
// localStorageUtils.ts

const APP_PREFIX = 'fitlife_ai_';

const getStorageKey = (baseKey: string, userId?: string): string => {
  // Se não houver userId (ex: usuário não logado ou dados globais), usa uma chave genérica.
  const userSpecificPrefix = userId ? `${userId}_` : 'guest_';
  return `${APP_PREFIX}${userSpecificPrefix}${baseKey}`;
};

export const loadFromLocalStorage = <T>(key: string, userId?: string): T | null => {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('LocalStorage is not available.');
    return null;
  }
  try {
    const item = localStorage.getItem(getStorageKey(key, userId));
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}” for user "${userId || 'guest'}":`, error);
    return null;
  }
};

export const saveToLocalStorage = <T>(key: string, value: T, userId?: string): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('LocalStorage is not available. Cannot save.');
    return;
  }
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(getStorageKey(key, userId), serializedValue);
  } catch (error) {
    console.warn(`Error writing to localStorage key “${key}” for user "${userId || 'guest'}":`, error);
  }
};

export const removeFromLocalStorage = (key: string, userId?: string): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('LocalStorage is not available. Cannot remove.');
    return;
  }
  try {
    localStorage.removeItem(getStorageKey(key, userId));
  } catch (error) {
    console.warn(`Error removing localStorage key “${key}” for user "${userId || 'guest'}":`, error);
  }
};
