import { SelectItem } from '@nextui-org/react'
import type {
  FieldErrors,
  FieldValues,
  UseFormRegister
} from 'react-hook-form'
import { MySelect } from './SelectExtend'

interface SelectProps {
  label: string
  isRequired: boolean
  name: string
  options: Array<{ label: string, value: string }>
  disabled?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
}

/* ➡ Componente que renderiza el select customizable */
export const Select = (
  { label, isRequired, name, options, disabled, register, errors }: SelectProps
) => {
  if (options.length === 0) return null

  return (
    <>
      <div className='relative overflow-hidden p-[1px] rounded-xl'>
      <MySelect
        label={label}
        isRequired={isRequired}
        isDisabled={disabled}
        color='stone'
        {...register(name)}
      >
        {
          options.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))
        }
      </MySelect>

      </div>
      {
        errors[name]?.message !== undefined && (
          <p className='text-color-pink-primary-accent-light -mt-3 text-sm z-10'>{String(errors[name]?.message)}</p>
        )
      }
    </>
  )
}
