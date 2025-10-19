import { configureStore, combineReducers, ThunkAction, Action } from '@reduxjs/toolkit';
import propertyReducer from './slices/propertySlice';
import uiReducer from './slices/uiSlice';
import { propertyMiddleware } from './middleware/propertyMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { persistenceMiddleware, loadStateFromStorage } from './middleware/persistenceMiddleware';
import { migrateLegacyTheme } from '../utils/themeMigration';

// Define the root reducer
const rootReducer = combineReducers({
  properties: propertyReducer,
  ui: uiReducer,
});

// Load initial state from localStorage and migrate legacy theme
const preloadedState = loadStateFromStorage();

// Migrate legacy theme if it exists
if (typeof window !== 'undefined') {
  const legacyTheme = migrateLegacyTheme();
  if (legacyTheme && preloadedState?.ui) {
    preloadedState.ui.theme = legacyTheme as 'light' | 'dark';
  }
}

// Configure Redux store
export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
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

// Define types after store configuration
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
