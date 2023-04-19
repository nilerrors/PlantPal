import { Button as BSButton } from 'react-bootstrap'

type Props = typeof BSButton.propTypes

export function Button(props: Props) {
  return (
    <BSButton {...props} size={window.innerWidth < 600 ? 'sm' : undefined} />
  )
}
