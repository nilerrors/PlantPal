import { useState, Dispatch, SetStateAction } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }
  return [storedValue, setValue] as const
}

// export function useStorage<T>(
//   key: string,
//   defaultValue: T,
//   storage = localStorage
// ): [T, Dispatch<SetStateAction<T>>] {
//   const initialValue = storage.getItem(key)
//     ? (JSON.parse(storage.getItem(key) ?? '') as T)
//     : defaultValue

//   const [value, setValue] = useState<T>(initialValue)

//   const setValueAndStore = ((arg) => {
//     const v = setValue(arg)
//     storage.setItem(key, JSON.stringify(v))
//     return v
//   }) as typeof setValue

//   return [value, setValueAndStore]
// }
