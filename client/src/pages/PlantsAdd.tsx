import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useForm } from '../hooks/useForm'

export function PlantsAdd() {
  const navigate = useNavigate()

  const form = useForm(() => {}, {
    id: '',
    name: '',
  })

  const handleGoBack = () => {
    navigate('/plants')
  }

  return (
    <>
      <Button onClick={handleGoBack}>Go Back</Button>
      <Form onSubmit={form.onSubmit}>
        <Form.Text>Add Plant</Form.Text>
        <Button type='submit'></Button>
      </Form>
    </>
  )
}
