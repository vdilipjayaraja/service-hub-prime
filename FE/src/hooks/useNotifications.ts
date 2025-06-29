
import { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'assignment';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Request Assigned',
      message: 'Service request #TKT-2024-001 has been assigned to you',
      type: 'assignment',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      read: false,
      actionUrl: '/service-requests'
    },
    {
      id: '2',
      title: 'New Service Request',
      message: 'Service request #TKT-2024-004 has been submitted',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
    },
    {
      id: '3',
      title: 'System Update',
      message: 'System maintenance scheduled for tonight at 2 AM',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
    },
    {
      id: '4',
      title: 'Request Completed',
      message: 'Service request #TKT-2024-002 has been completed',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addAssignmentNotification = (requestId: string, technicianName: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: 'Request Assigned',
      message: `Service request #${requestId} has been assigned to ${technicianName}`,
      type: 'assignment',
      timestamp: new Date(),
      read: false,
      actionUrl: '/service-requests'
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addAssignmentNotification,
  };
};
