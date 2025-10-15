import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { addNotification } from '../slices/uiSlice';

// Custom middleware for property operations
export const propertyMiddleware: Middleware<object, RootState> = (store) => (next) => (action) => {
  const result = next(action);

  // Handle property operation notifications
  if (action.type.startsWith('properties/')) {
    const state = store.getState();
    
    // Success notifications
    if (action.type.endsWith('/fulfilled')) {
      if (action.type.includes('fetchProperties')) {
        store.dispatch(addNotification({
          message: `Loaded ${state.properties.properties.length} properties`,
          type: 'success'
        }));
      } else if (action.type.includes('createProperty')) {
        store.dispatch(addNotification({
          message: 'Property created successfully',
          type: 'success'
        }));
      }
    }
    
    // Error notifications
    if (action.type.endsWith('/rejected')) {
      store.dispatch(addNotification({
        message: action.error?.message || 'An error occurred',
        type: 'error'
      }));
    }
  }

  return result;
};
