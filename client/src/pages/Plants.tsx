import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthentication } from '../contexts/AuthenticationContext'

export function Plants() {
  const [plants, setPlants] = useState({})

  const { useApi } = useAuthentication()

  useEffect(() => {
    useApi('/plants/')
      .then((res) => res.json())
      .then((data) => {
        setPlants(data?.plants)
      })
  }, [])

  return (
    <>
      <Link to='/plants/add'>Add Plant</Link>
      <hr />
      {JSON.stringify(plants, undefined, 2)}
    </>
  )
}
