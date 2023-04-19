import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export function Home() {
  document.title = 'PlantPal'

  return (
    <Container className='bg-dark text-align-center'>
      <Link to='/tutorial'>
        <h2>Setup Tutorial</h2>
      </Link>
    </Container>
  )
}
