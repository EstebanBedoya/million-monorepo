import { configureStore, combineReducers } from '@reduxjs/toolkit';
import propertyReducer from './slices/propertySlice';
import uiReducer from './slices/uiSlice';
import { propertyMiddleware } from './middleware/propertyMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { persistenceMiddleware } from './middleware/persistenceMiddleware';

// Define the root reducer
const rootReducer = combineReducers({
  properties: propertyReducer,
  ui: uiReducer,
});

// Define RootState type before store configuration
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof configureStore>['dispatch'];

// Configure Redux store
export const store = configureStore({
  reducer: rootReducer,
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
