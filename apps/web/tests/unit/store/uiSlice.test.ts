import uiReducer, {
  toggleSidebar,
  setSidebarOpen,
  toggleModal,
  setModalOpen,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
} from '@/store/slices/uiSlice';

describe('uiSlice', () => {
  const initialState = {
    sidebarOpen: false,
    modalOpen: false,
    theme: 'light' as const,
    notifications: [],
  };

  it('should return initial state', () => {
    expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('sidebar actions', () => {
    it('should toggle sidebar', () => {
      const state = uiReducer(initialState, toggleSidebar());
      expect(state.sidebarOpen).toBe(true);
      
      const stateToggled = uiReducer(state, toggleSidebar());
      expect(stateToggled.sidebarOpen).toBe(false);
    });

    it('should set sidebar open', () => {
      const state = uiReducer(initialState, setSidebarOpen(true));
      expect(state.sidebarOpen).toBe(true);
    });

    it('should set sidebar closed', () => {
      const openState = { ...initialState, sidebarOpen: true };
      const state = uiReducer(openState, setSidebarOpen(false));
      expect(state.sidebarOpen).toBe(false);
    });
  });

  describe('modal actions', () => {
    it('should toggle modal', () => {
      const state = uiReducer(initialState, toggleModal());
      expect(state.modalOpen).toBe(true);
      
      const stateToggled = uiReducer(state, toggleModal());
      expect(stateToggled.modalOpen).toBe(false);
    });

    it('should set modal open', () => {
      const state = uiReducer(initialState, setModalOpen(true));
      expect(state.modalOpen).toBe(true);
    });

    it('should set modal closed', () => {
      const openState = { ...initialState, modalOpen: true };
      const state = uiReducer(openState, setModalOpen(false));
      expect(state.modalOpen).toBe(false);
    });
  });

  describe('theme actions', () => {
    it('should set theme to dark', () => {
      const state = uiReducer(initialState, setTheme('dark'));
      expect(state.theme).toBe('dark');
    });

    it('should set theme to light', () => {
      const darkState = { ...initialState, theme: 'dark' as const };
      const state = uiReducer(darkState, setTheme('light'));
      expect(state.theme).toBe('light');
    });
  });

  describe('notification actions', () => {
    it('should add notification', () => {
      const state = uiReducer(
        initialState,
        addNotification({ message: 'Test message', type: 'success' })
      );
      
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0]).toMatchObject({
        message: 'Test message',
        type: 'success',
      });
      expect(state.notifications[0]).toHaveProperty('id');
      expect(state.notifications[0]).toHaveProperty('timestamp');
    });

    it('should add multiple notifications', () => {
      let state = uiReducer(
        initialState,
        addNotification({ message: 'First', type: 'success' })
      );
      state = uiReducer(
        state,
        addNotification({ message: 'Second', type: 'error' })
      );
      
      expect(state.notifications).toHaveLength(2);
      expect(state.notifications[0].message).toBe('First');
      expect(state.notifications[1].message).toBe('Second');
    });

    it('should remove notification by id', () => {
      let state = uiReducer(
        initialState,
        addNotification({ message: 'Test', type: 'info' })
      );
      
      const notificationId = state.notifications[0].id;
      state = uiReducer(state, removeNotification(notificationId));
      
      expect(state.notifications).toHaveLength(0);
    });

    it('should clear all notifications', () => {
      let state = uiReducer(
        initialState,
        addNotification({ message: 'First', type: 'success' })
      );
      state = uiReducer(
        state,
        addNotification({ message: 'Second', type: 'error' })
      );
      state = uiReducer(
        state,
        addNotification({ message: 'Third', type: 'warning' })
      );
      
      expect(state.notifications).toHaveLength(3);
      
      state = uiReducer(state, clearNotifications());
      expect(state.notifications).toHaveLength(0);
    });
  });
});

