import { createContext, useContext, useState } from 'react'
import { DEFAULT_LOCATION } from '../data/locations'

const LocationContext = createContext(null)

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(DEFAULT_LOCATION)

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useLocation must be inside LocationProvider')
  return ctx
}
