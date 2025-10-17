import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Logger middleware for development
export const loggerMiddleware: Middleware<object, RootState> = (store) => (next) => (action: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`Redux Action: ${(action as { type: string }).type}`);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);
    
    const result = next(action);
    
    console.log('Next State:', store.getState());
    console.groupEnd();
    
    return result;
  }
  
  return next(action);
};
