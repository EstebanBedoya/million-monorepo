import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Persistence middleware for localStorage
export const persistenceMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  // Save to localStorage on specific actions
  if (action.type.startsWith('properties/') || action.type.startsWith('ui/')) {
    try {
      const state = store.getState();
      localStorage.setItem('redux-state', JSON.stringify({
        properties: state.properties,
        ui: state.ui,
      }));
    } catch (error) {
      console.warn('Failed to persist state to localStorage:', error);
    }
  }
  
  return result;
};

// Load state from localStorage
export const loadStateFromStorage = (): Partial<RootState> | undefined => {
  try {
    const serializedState = localStorage.getItem('redux-state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
    return undefined;
  }
};
