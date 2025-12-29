import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: string
    matricNumber: string
    fullName: string
    status: string
    role: string
    hasVoted: boolean
}

interface AuthState {
    user: User | null
    token: string | null
    setAuth: (user: User, token: string) => void
    clearAuth: () => void
    isAuthenticated: () => boolean
    isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,

            setAuth: (user, token) => {
                set({ user, token })
                // Also save to localStorage for API calls
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_token', token)
                    localStorage.setItem('user', JSON.stringify(user))
                }
            },

            clearAuth: () => {
                set({ user: null, token: null })
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_token')
                    localStorage.removeItem('user')
                    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
                }
            },

            isAuthenticated: () => {
                return !!get().token
            },

            isAdmin: () => {
                return get().user?.role === 'ADMIN'
            },
        }),
        {
            name: 'auth-storage',
        }
    )
)
