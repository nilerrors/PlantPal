import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useAuthentication } from '../../contexts/AuthenticationContext'
import SVG from 'react-inlinesvg'

type Props = {
  plant_id: string
}

export function MoisturePercentageGraph({ plant_id }: Props) {
  const [graph, setGraph] = useState<string | null>()
  const [noData, setNoData] = useState(true)

  const { useApi } = useAuthentication()

  useEffect(() => {
    useApi(`/plants/${plant_id}/moisture_percentage_graph.svg`)
      .then(({ res }) => {
        if (!res.ok) return
        return res.text()
      })
      .then((data) => {
        setGraph(data)
        setNoData(false)
      })
  }, [])

  return (
    <>
      {noData ? null : (
        <Container>
          {graph != null ? (
            <>
              <SVG src={graph} style={{ maxWidth: '100vw' }} />
            </>
          ) : null}
        </Container>
      )}
    </>
  )
}
