import { useState } from 'react'

export const useForm = <T>(callback: CallableFunction, initialState: T) => {
  const [values, setValues] = useState<T>(initialState)
  const [loading, setLoading] = useState(false)

  const onChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (values == null) return

    if (!Object.keys(values).includes(event.target.name)) {
      throw Error(
        `'${event.target.name}' does not match any key of form values`
      )
    }
    let value: any = event.target.value
    if (typeof values[event.target.name as keyof T] == 'boolean') {
      if (value === 'on') value = !values[event.target.name as keyof T]
    }
    setValues({ ...values, [event.target.name]: value })
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    await callback()
    setLoading(false)
  }

  const set = (_values: T) => {
    setValues(_values)
  }

  return {
    onChange,
    onSubmit,
    set,
    values,
    loading,
  }
}
