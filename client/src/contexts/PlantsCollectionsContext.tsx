import { createContext, useContext } from 'react'

type PlantsCollections = {}

export const PlantsCollectionsContext = createContext<PlantsCollections>(
  {} as PlantsCollections
)

export function usePlantsCollections() {
  const context = useContext(PlantsCollectionsContext)
  if (context === undefined) {
    throw new Error('PlantsCollections Context used outside of provider')
  }
  return context
}

export function PlantsCollectionsContextProvider(props: {
  children: JSX.Element[] | JSX.Element
}) {
  const plantsCollections: PlantsCollections = {}

  return (
    <PlantsCollectionsContext.Provider value={plantsCollections}>
      {props.children}
    </PlantsCollectionsContext.Provider>
  )
}
