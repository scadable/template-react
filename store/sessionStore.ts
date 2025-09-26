import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useEffect } from "react";

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

export interface SessionState {
  // User state
  user: User | null
  isAuthenticated: boolean
  authToken: string | null

  // Session data
  sessionId: string | null
  lastActivity: number | null

  // Actions
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  setAuthToken: (token: string) => void
  updateLastActivity: () => void
  setSessionId: (sessionId: string) => void

  // Getters
  isSessionValid: () => boolean
  getTimeUntilExpiry: () => number
}

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      authToken: null,
      sessionId: null,
      lastActivity: null,

      // Actions
      login: (user: User, token: string) => {
        const now = Date.now()
        set({
          user,
          authToken: token,
          isAuthenticated: true,
          lastActivity: now,
          sessionId: `session_${now}_${Math.random().toString(36).substr(2, 9)}`,
        })
        localStorage.setItem('authToken', token)
      },

      logout: () => {
        set({
          user: null,
          authToken: null,
          isAuthenticated: false,
          sessionId: null,
          lastActivity: null,
        })
        localStorage.removeItem('authToken')
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }))
      },

      setAuthToken: (token: string) => {
        set({ authToken: token })
        localStorage.setItem('authToken', token)
      },

      updateLastActivity: () => {
        set({ lastActivity: Date.now() })
      },

      setSessionId: (sessionId: string) => {
        set({ sessionId })
      },

      // Getters
      isSessionValid: () => {
        const state = get()
        if (!state.lastActivity || !state.isAuthenticated) return false

        const now = Date.now()
        const timeSinceLastActivity = now - state.lastActivity
        return timeSinceLastActivity < SESSION_TIMEOUT
      },

      getTimeUntilExpiry: () => {
        const state = get()
        if (!state.lastActivity) return 0

        const now = Date.now()
        const timeSinceLastActivity = now - state.lastActivity
        const timeRemaining = SESSION_TIMEOUT - timeSinceLastActivity
        return Math.max(0, timeRemaining)
      },
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        authToken: state.authToken,
        isAuthenticated: state.isAuthenticated,
        sessionId: state.sessionId,
        lastActivity: state.lastActivity,
      }),
    }
  )
)

// Custom hook for session management with automatic cleanup
export const useSession = () => {
  const sessionStore = useSessionStore()

  // Check if session is still valid on hook usage
  useEffect(() => {
    if (sessionStore.isAuthenticated && !sessionStore.isSessionValid()) {
      sessionStore.logout()
    }
  }, [sessionStore])

  return sessionStore
}
