import { store, RootState, AppDispatch } from '@/store/index';
import { setTheme } from '@/store/slices/uiSlice';

describe('Redux Store', () => {
  it('should create store with initial state', () => {
    const state = store.getState();
    expect(state).toHaveProperty('ui');
    expect(state).toHaveProperty('properties');
  });

  it('should have ui slice with default values', () => {
    const state = store.getState();
    expect(state.ui).toHaveProperty('theme');
    expect(state.ui).toHaveProperty('sidebarOpen');
    expect(state.ui).toHaveProperty('modalOpen');
    expect(state.ui).toHaveProperty('notifications');
  });

  it('should have properties slice', () => {
    const state = store.getState();
    expect(state.properties).toBeDefined();
  });

  it('should allow dispatching actions', () => {
    store.dispatch(setTheme('dark'));
    const state = store.getState();
    expect(state.ui.theme).toBe('dark');
    
    // Reset to light for other tests
    store.dispatch(setTheme('light'));
  });

  it('should have correct type exports', () => {
    const state: RootState = store.getState();
    const dispatch: AppDispatch = store.dispatch;
    
    expect(state).toBeDefined();
    expect(dispatch).toBeDefined();
  });
});

