import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useAuthentication } from '../contexts/AuthenticationContext'

export function Plant() {
  const [plant, setPlant] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams()

  const { useApi } = useAuthentication()

  if (id === undefined) {
    return <Navigate to='/plants' />
  }

  useEffect(() => {
    useApi('/plants/' + id, {
      method: 'POST',
    })
      .then((res) => {
        if (!res.ok) {
          res
            .json()
            .then((data) => setError(data?.detail ?? data?.message ?? 'Error'))
          return
        }
        return res.json()
      })
      .then((data) => setPlant(data))
  }, [])

  return (
    <>
      {id}
      <hr />
      {error != null ? (
        <>{error}</>
      ) : (
        <>{JSON.stringify(plant, undefined, 2)}</>
      )}
    </>
  )
}
