import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../../src/store/hooks';
import uiReducer from '../../../src/store/slices/uiSlice';
import propertyReducer from '../../../src/store/slices/propertySlice';

describe('Redux hooks', () => {
  const createTestStore = () => {
    return configureStore({
      reducer: {
        ui: uiReducer,
        properties: propertyReducer,
      },
    });
  };

  it('useAppDispatch should return dispatch function', () => {
    const store = createTestStore();
    const { result } = renderHook(() => useAppDispatch(), {
      wrapper: ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>,
    });

    expect(typeof result.current).toBe('function');
  });

  it('useAppSelector should select state', () => {
    const store = createTestStore();
    const { result } = renderHook(
      () => useAppSelector((state) => state.ui.theme),
      {
        wrapper: ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>,
      }
    );

    expect(result.current).toBe('light');
  });

  it('useAppSelector should update when state changes', () => {
    const store = createTestStore();
    const { result } = renderHook(
      () => ({
        theme: useAppSelector((state) => state.ui.theme),
        dispatch: useAppDispatch(),
      }),
      {
        wrapper: ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>,
      }
    );

    expect(result.current.theme).toBe('light');
  });
});

