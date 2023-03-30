import { createContext, useState, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useStorage'
import jwtDecode from 'jwt-decode'
import { User } from '../types'

const baseURL = import.meta.env.VITE_API_BASE_URL

type TokenType = {
  sub?: string
  iat?: number
  nbf?: number
  jti?: string
  exp?: number
  type?: string
  fresh?: boolean
}

type Authentication = {
  token: string
  user: User | null
  login: (access_token: string) => void
  logout: () => void
  loggedin: boolean
  useApi: (
    url: string,
    options?: {
      body?: any
      method?: string
      initHeaders?: any
    }
  ) => Promise<Response>
  getCurrentUser: () => Promise<void>
}

export const AuthenticationContext = createContext<Authentication>(
  {} as Authentication
)

export function useAuthentication() {
  const context = useContext(AuthenticationContext)

  if (context === undefined) {
    throw new Error('Authentication Context used outside of provider')
  }

  return context
}

export function AuthenticationContextProvider(props: {
  children: JSX.Element[] | JSX.Element
}) {
  const [token, setAndStoreToken] = useLocalStorage('managementAuthToken', '')
  const [user, setUser] = useState<null | User>(null)
  const [lastCheck, setLastCheck] = useState<Date | null>()
  const [loggedin, setLoggedin] = useState(loggedIn())

  function login(access_token: string) {
    if (access_token != undefined) setAndStoreToken(access_token)
  }

  function logout() {
    setAndStoreToken('')
  }

  function loggedIn(): boolean {
    if (token == '') return false

    try {
      const decoded = jwtDecode<TokenType>(token)
      if (decoded?.exp == undefined) {
        return true
      } else if (new Date().getMilliseconds() - decoded?.exp < 0) {
        return true
      }
      return false
    } catch {
      return false
    }
  }

  async function useApi(
    url: string,
    options: { body?: any; method?: string; initHeaders?: any } = {
      body: undefined,
      method: 'GET',
    }
  ) {
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.initHeaders,
    }
    if (token != '') {
      headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(baseURL + url, {
      method: options?.method,
      headers,
      body: JSON.stringify(options?.body),
    })
    if (
      res.status === 422 &&
      (await res.json())?.detail == 'Signature has expired'
    ) {
      logout()
    }
    return res
  }

  async function checkCurrentUser() {
    useApi('/auth/user/current')
      .then((res) => {
        if (res.ok) return res.json()
        else logout()
      })
      .then((data) => {
        const email = jwtDecode<TokenType>(token).sub
        if (email == undefined || data?.current_user !== email) logout()
      })
    setLastCheck(new Date())
  }

  async function getCurrentUser() {
    useApi('/auth/user')
      .then((res) => {
        if (res.ok) return res.json()
        else logout()
      })
      .then((data) => {
        setUser(data)
      })
    setLastCheck(new Date())
  }

  useEffect(() => {
    if (!loggedin) return
    getCurrentUser()
  }, [])

  useEffect(() => {
    setInterval(() => {
      if (!loggedin) return
      checkCurrentUser()
    }, 60_000)
  }, [])

  useEffect(() => {
    setLoggedin(loggedIn())
    getCurrentUser()
  }, [token])

  return (
    <AuthenticationContext.Provider
      value={{
        token,
        login,
        logout,
        getCurrentUser,
        user,
        loggedin,
        useApi,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  )
}
