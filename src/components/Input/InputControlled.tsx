import { cn } from '@/libs/utils'
import {
  Controller,
  type FieldErrors,
  type FieldValues
} from 'react-hook-form'
import { MyInput } from './InputExtend'

interface InputProps {
  type: string
  name: string
  label?: string
  disabled?: boolean
  isRequired: boolean
  control: any
  size?: 'sm' | 'md' | 'lg'
  variant?: 'flat' | 'bordered' | 'underlined' | 'faded'
  endContent?: React.ReactNode
  errors: FieldErrors<FieldValues>
  className?: string
  classNamesInput?: string[]
}

/* ➡ Componente del input controlado customizable */
export const InputControlled = (
  { type, name, label, disabled, isRequired, control, size, variant, endContent, errors, className, classNamesInput }: InputProps
) => {
  return (
    <>
      <div className='relative overflow-hidden p-[1px] rounded-xl w-full'>
        <Controller
          render={({ field }) => (
            <MyInput
              {...field}
              type={type}
              label={label}
              variant={variant}
              size={size}
              radius='sm'
              endContent={endContent}
              isDisabled={disabled}
              isRequired={isRequired}
              className={cn(
                'z-10',
                className
              )}
              classNames={{
                input: [...(classNamesInput ?? []), 'disabled:text-zinc-400 disabled:dark:text-zinc-500'],
                label: ['disabled:text-zinc-400 dark:disabled:text-zinc-500']
              }}
              color={variant !== 'underlined' ? 'stone' : 'default'}
            />
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
