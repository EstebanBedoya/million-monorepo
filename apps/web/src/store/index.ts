import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from './slices/propertySlice';
import uiReducer from './slices/uiSlice';
import { propertyMiddleware } from './middleware/propertyMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { persistenceMiddleware } from './middleware/persistenceMiddleware';

// Configure Redux store
export const store = configureStore({
  reducer: {
    properties: propertyReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(
      propertyMiddleware,
      loggerMiddleware,
      persistenceMiddleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
