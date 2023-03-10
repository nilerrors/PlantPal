import { useState } from 'react'

export const useForm = <T>(callback: any, initialState: T) => {
  const [values, setValues] = useState<T>(initialState)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const onSelectChange = (): React.ChangeEventHandler<HTMLSelectElement> => {
    return () => onChange
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await callback()
  }

  const set = (_values: T) => {
    setValues(_values)
  }

  return {
    onChange,
    onSelectChange,
    onSubmit,
    set,
    values,
  }
}
