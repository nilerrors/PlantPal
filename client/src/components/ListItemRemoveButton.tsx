import { InputGroup, ListGroup } from 'react-bootstrap'
import { Button } from '../components/Button'
import { Link } from 'react-router-dom'

type Props = {
  id: string
  to?: string
  name: string
  nameAddition?: string
  type: string
  onRemove: () => void | Promise<void>
}

export function ListItemRemoveButton({
  id,
  to,
  name,
  nameAddition,
  type,
  onRemove,
}: Props) {
  return (
    <InputGroup className='input-group-btn mb-2'>
      {to != undefined ? (
        <Link to={to} className='form-control text-underline-hover p-0'>
          <ListGroup.Item variant='secondary'>
            {name} {nameAddition != undefined ? <>({nameAddition})</> : null}
          </ListGroup.Item>
        </Link>
      ) : (
        <span className='form-control p-0'>
          <ListGroup.Item variant='secondary'>
            {name} {nameAddition != undefined ? <>({nameAddition})</> : null}
          </ListGroup.Item>
        </span>
      )}
      <Button
        onClick={async () => {
          if (confirm(`Are you sure you want to remove ${type} '${name}'?`)) {
            onRemove()
          }
        }}
        variant='danger'
        style={{ float: 'right', display: 'inline' }}
      >
        Remove
      </Button>
    </InputGroup>
  )
}
