import { createContext, useContext } from "react"

interface User {
  id: string
  email: string
  name: string
  image?: string
  roles: { name: string }[]
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  isLoaded: boolean
  isSignedIn: boolean
  isAuthenticated: boolean
  isLoading: boolean
  setSession: (accessToken: string, user: User) => void
  clearSession: () => void
  login: (accessToken: string, user: User) => void
  logout: (redirectTo?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export type { AuthContextType, User }
export { AuthContext, useAuth }
