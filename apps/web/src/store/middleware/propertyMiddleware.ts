import { Middleware } from '@reduxjs/toolkit';
import { addNotification } from '../slices/uiSlice';

// Type guard for actions with type property
const isActionWithType = (action: unknown): action is { type: string; error?: { message?: string } } => {
  return (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    typeof (action as Record<string, unknown>).type === 'string'
  );
};

// Custom middleware for property operations
export const propertyMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  const result = next(action);

  // Handle property operation notifications
  if (isActionWithType(action) && action.type.startsWith('properties/')) {
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
