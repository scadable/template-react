import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AppState {
  // UI state
  isLoading: boolean
  isSidebarOpen: boolean
  isDarkMode: boolean
  notifications: Notification[]

  // Data cache
  cachedData: Record<string, any>
  lastDataFetch: Record<string, number>

  // Actions
  setLoading: (loading: boolean) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleDarkMode: () => void
  setDarkMode: (darkMode: boolean) => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void

  // Data management
  setCachedData: (key: string, data: any) => void
  getCachedData: (key: string) => any
  clearCachedData: (key?: string) => void
  isDataStale: (key: string, maxAge?: number) => boolean
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  timestamp: number
  duration?: number
}

const DEFAULT_CACHE_MAX_AGE = 5 * 60 * 1000 // 5 minutes

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isLoading: false,
      isSidebarOpen: true,
      isDarkMode: false,
      notifications: [],
      cachedData: {},
      lastDataFetch: {},

      // Actions
      setLoading: (loading: boolean) => {
        set({ isLoading: loading }, false, 'setLoading')
      },

      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }), false, 'toggleSidebar')
      },

      setSidebarOpen: (open: boolean) => {
        set({ isSidebarOpen: open }, false, 'setSidebarOpen')
      },

      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.isDarkMode
          // Update document class for Tailwind dark mode
          if (newDarkMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { isDarkMode: newDarkMode }
        }, false, 'toggleDarkMode')
      },

      setDarkMode: (darkMode: boolean) => {
        set({ isDarkMode: darkMode }, false, 'setDarkMode')
        if (darkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      addNotification: (notification) => {
        const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newNotification: Notification = {
          id,
          timestamp: Date.now(),
          duration: 5000, // Default 5 seconds
          ...notification,
        }

        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }), false, 'addNotification')

        // Auto-remove notification after duration
        if (newNotification.duration && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id)
          }, newNotification.duration)
        }
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }), false, 'removeNotification')
      },

      clearNotifications: () => {
        set({ notifications: [] }, false, 'clearNotifications')
      },

      // Data management
      setCachedData: (key: string, data: any) => {
        set((state) => ({
          cachedData: { ...state.cachedData, [key]: data },
          lastDataFetch: { ...state.lastDataFetch, [key]: Date.now() }
        }), false, 'setCachedData')
      },

      getCachedData: (key: string) => {
        return get().cachedData[key]
      },

      clearCachedData: (key?: string) => {
        if (key) {
          set((state) => {
            const newCachedData = { ...state.cachedData }
            const newLastDataFetch = { ...state.lastDataFetch }
            delete newCachedData[key]
            delete newLastDataFetch[key]
            return { cachedData: newCachedData, lastDataFetch: newLastDataFetch }
          }, false, 'clearCachedData')
        } else {
          set({ cachedData: {}, lastDataFetch: {} }, false, 'clearAllCachedData')
        }
      },

      isDataStale: (key: string, maxAge = DEFAULT_CACHE_MAX_AGE) => {
        const lastFetch = get().lastDataFetch[key]
        if (!lastFetch) return true
        return Date.now() - lastFetch > maxAge
      },
    }),
    { name: 'app-store' }
  )
)