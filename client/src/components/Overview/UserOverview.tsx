import { User } from '../../types'

type Props = {
  user: User
}

export function UserOverview({ user }: Props) {
  return (
    <div style={{ display: 'flex' }}>
      <div>
        <h4>Email: {user.email}</h4>
        <h4>First Name: {user.first_name}</h4>
        <h4>Last Name: {user.last_name}</h4>
        <h4>Created At: {new Date(user.created_at).toLocaleString()}</h4>
        {user.created_at != user.updated_at ? (
          <h4>Updated At: {new Date(user.updated_at).toLocaleString()}</h4>
        ) : null}
      </div>
    </div>
  )
}
