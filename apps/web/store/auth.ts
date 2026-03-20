// ═══════════════════════════════════════════════════════════════
//  IAI Web — Auth Store (Zustand)
// ═══════════════════════════════════════════════════════════════

'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

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
      logout:  ()           => set({ token: null, user: null, isAuth: false }),
    }),
    { name: 'iai-auth' }
  )
)
