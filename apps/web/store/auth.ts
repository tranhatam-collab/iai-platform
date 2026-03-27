// ═══════════════════════════════════════════════════════════════
//  IAI Web — Auth Store (Zustand)
//  Token in localStorage (Zustand persist) + .iai.one cookie (set by API)
//  Cookie allows all *.iai.one subdomains to share the session
// ═══════════════════════════════════════════════════════════════

'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.iai.one'

type AuthState = {
  token:   string | null
  user:    User | null
  isAuth:  boolean
  setAuth: (token: string, user: User) => void
  logout:  () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token:  null,
      user:   null,
      isAuth: false,
      setAuth: (token, user) => set({ token, user, isAuth: true }),
      logout: () => {
        set({ token: null, user: null, isAuth: false })
        // Clear the .iai.one cookie via API
        fetch(`${API}/v1/users/logout`, { method: 'POST', credentials: 'include' })
          .catch(() => {/* ignore */})
      },
    }),
    { name: 'iai-auth' }
  )
)
