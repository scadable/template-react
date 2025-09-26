// Session management
import { useSessionStore } from './sessionStore'

// App state management
import { useAppStore } from './appStore'

// Re-export types for convenience
import type { User, SessionState } from './sessionStore'
import type { AppState, Notification } from './appStore'

export type { User, SessionState, AppState, Notification }

// Utility functions
export const createNotification = (
  type: 'success' | 'error' | 'warning' | 'info',
  title: string,
  message?: string,
  duration?: number
) => ({
  type,
  title,
  message,
  duration,
})

// Common store actions
export const useStoreActions = () => {
  const { login, logout, updateUser } = useSessionStore()
  const {
    setLoading,
    addNotification,
    toggleDarkMode,
    toggleSidebar,
    setCachedData,
    getCachedData,
    clearCachedData
  } = useAppStore()

  return {
    // Session actions
    login,
    logout,
    updateUser,

    // App actions
    setLoading,
    addNotification,
    toggleDarkMode,
    toggleSidebar,

    // Data management
    setCachedData,
    getCachedData,
    clearCachedData,

    // Utility functions
    showSuccess: (title: string, message?: string) =>
      addNotification(createNotification('success', title, message)),

    showError: (title: string, message?: string) =>
      addNotification(createNotification('error', title, message)),

    showWarning: (title: string, message?: string) =>
      addNotification(createNotification('warning', title, message)),

    showInfo: (title: string, message?: string) =>
      addNotification(createNotification('info', title, message)),
  }
}