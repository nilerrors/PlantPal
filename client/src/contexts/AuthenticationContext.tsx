import { createContext, useState, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useStorage'
import jwtDecode from 'jwt-decode'

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
  const [loggedin, setLoggedin] = useState(loggedIn())

  function login(access_token: string) {
    console.log(access_token)
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

    return await fetch(baseURL + url, {
      method: options?.method,
      headers,
      body: JSON.stringify(options?.body),
    })
  }

  useEffect(() => {
    setLoggedin(loggedIn())
  }, [token])

  const user = {
    token,
    login,
    logout,
    loggedin,
    useApi,
  }

  return (
    <AuthenticationContext.Provider value={user}>
      {props.children}
    </AuthenticationContext.Provider>
  )
}
