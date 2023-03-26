import { createContext, useContext, useEffect, useState } from 'react'
import { useAuthentication } from './AuthenticationContext'
import { PlantsCollection } from '../types'

type PlantsCollections = {
  collections: PlantsCollection[]
  count: number
  refetch: () => Promise<number>
  add: (collection: PlantsCollection) => void
  remove: (collection_id: string) => void
}

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
  const [collections, setCollections] = useState<PlantsCollection[]>([])
  const [count, setCount] = useState<number>(0)

  const { useApi } = useAuthentication()

  async function refetch() {
    const res = await useApi('/plants_collection/')
    const data = await res.json()
    setCollections(data)
    setCount(collections.length)

    return count
  }

  function add(collection: PlantsCollection) {
    setCollections([...collections, collection])
  }

  function remove(collection_id: string) {
    useApi(`/plants_collection/${collection_id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((data) => {
        setCollections(collections.filter((c) => c.id !== collection_id))
        refetch()
        alert(data?.message ?? data?.detail ?? '')
      })
  }

  useEffect(() => {
    refetch()
  }, [])

  const plantsCollections: PlantsCollections = {
    collections,
    count,
    refetch,
    add,
    remove,
  }

  return (
    <PlantsCollectionsContext.Provider value={plantsCollections}>
      {props.children}
    </PlantsCollectionsContext.Provider>
  )
}
