import { SelectItem } from '@nextui-org/react'
import {
  Controller,
  type FieldErrors,
  type FieldValues
} from 'react-hook-form'
import { MySelect } from './SelectExtend'

interface SelectProps {
  label: string
  isRequired: boolean
  name: string
  control: any
  value: Set<any>
  options: Array<{ label: string, value: string }>
  disabled?: boolean
  errors: FieldErrors<FieldValues>
  setValue: (keys: any) => any
}

/* ➡ Componente que renderiza el select controlado customizable */
export const SelectControlled = (
  { label, isRequired, name, control, value, options, disabled, errors, setValue }: SelectProps
) => {
  if (options.length === 0) return null

  return (
    <>
      <div className='relative overflow-hidden p-[1px] rounded-xl'>
        <Controller
          render={({ field }) => (
            <MySelect
              {...field}
              label={label}
              isRequired={isRequired}
              isDisabled={disabled}
              selectedKeys={value}
              onSelectionChange={setValue}
              color='stone'
            >
              {
                options.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))
              }
            </MySelect>
          )}
          name={name}
          rules={{ required: isRequired }}
          control={control}
          disabled={disabled}
        />

      </div>
      {
        errors[name]?.message !== undefined && (
          <p className='text-color-pink-primary-accent-light -mt-3 text-sm z-10'>{String(errors[name]?.message)}</p>
        )
      }
    </>
  )
}
