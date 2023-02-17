import { useState } from 'react'

export const useForm = <T extends object>(callback: any, initialState: T) => {
  const [values, setValues] = useState<T>(initialState)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.name, event.target.value)

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
    await callback()
  }

  return {
    onChange,
    onSubmit,
    values,
  }
}
