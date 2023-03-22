import { PlantsCollection } from '../../types'
import { Link } from 'react-router-dom'
import {
  Button,
  Card,
  Collapse,
  Container,
  Form,
  InputGroup,
  ListGroup,
} from 'react-bootstrap'

type Props = {
  collections: PlantsCollection[]
}

export function PlantsCollectionsOverview({ collections }: Props) {
  return (
    <ListGroup className='list-group-flush'>
      {collections.map((p) => (
        <InputGroup key={p.id} className='input-group-btn'>
          <Link to={`/plants/${p.id}`} className='form-control p-0'>
            <ListGroup.Item
              variant={p.name == '$Plants' ? 'primary' : 'secondary'}
              style={{
                fontSize: p.name == '$Plants' ? 'large' : undefined,
              }}
            >
              {p.name}
            </ListGroup.Item>
          </Link>
          {p.name != '$Plants' ? (
            <Button
              onClick={async () => {
                if (
                  confirm(
                    `Are you sure you want to remove plant collection '${p.name}'?`
                  )
                ) {
                } else {
                }
              }}
              variant='danger'
              style={{ float: 'right', display: 'inline' }}
            >
              Remove
            </Button>
          ) : null}
        </InputGroup>
      ))}
    </ListGroup>
  )
}
