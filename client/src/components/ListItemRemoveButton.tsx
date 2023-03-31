import { Button, InputGroup, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Plant } from '../types'

type Props = {
  id: string
  to?: string
  name: string
  nameAddition?: string
  isPrimary?: boolean
  type: string
  onRemove: () => void | Promise<void>
}

export function ListItemRemoveButton({
  id,
  to,
  name,
  nameAddition,
  isPrimary,
  type,
  onRemove,
}: Props) {
  return (
    <InputGroup className={`${isPrimary ? '' : 'mt-3'} input-group-btn`}>
      {to != undefined ? (
        <Link to={to} className='form-control text-underline-hover p-0'>
          <ListGroup.Item
            variant={isPrimary ? 'primary' : 'secondary'}
            style={{
              fontSize: isPrimary ? 'large' : undefined,
            }}
          >
            {name} {nameAddition != undefined ? <>({nameAddition})</> : null}
          </ListGroup.Item>
        </Link>
      ) : (
        <span className='form-control p-0'>
          <ListGroup.Item
            variant={isPrimary ? 'primary' : 'secondary'}
            style={{
              fontSize: isPrimary ? 'large' : undefined,
            }}
          >
            {name} {nameAddition != undefined ? <>({nameAddition})</> : null}
          </ListGroup.Item>
        </span>
      )}
      {!isPrimary ? (
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
      ) : null}
    </InputGroup>
  )
}
