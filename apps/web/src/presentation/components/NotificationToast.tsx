'use client';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeNotification } from '../../store/slices/uiSlice';
import { useEffect } from 'react';

export function NotificationToast() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.ui.notifications);

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    notifications.forEach(notification => {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 5000);
      
      return () => clearTimeout(timer);
    });
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : notification.type === 'error'
              ? 'bg-red-100 border border-red-400 text-red-700'
              : notification.type === 'warning'
              ? 'bg-yellow-100 border border-yellow-400 text-yellow-700'
              : 'bg-blue-100 border border-blue-400 text-blue-700'
          }`}
        >
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => dispatch(removeNotification(notification.id))}
              className="ml-2 text-lg leading-none hover:opacity-75"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
