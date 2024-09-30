import { cn } from '@/libs/utils'
import type {
  FieldErrors,
  FieldValues,
  UseFormRegister
} from 'react-hook-form'
import { MyInput } from './InputExtend'
import '../../app/globals.css'

interface InputProps {
  type: string
  label?: string
  isRequired: boolean
  name: string
  size?: 'sm' | 'md' | 'lg'
  value?: string
  variant?: 'flat' | 'bordered' | 'underlined' | 'faded'
  disabled?: boolean
  endContent?: React.ReactNode
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  className?: string
  classNamesInput?: string[]
  previousInputName?: string
  nextInputName?: string
  keyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  keyUp?: (event: React.KeyboardEvent<HTMLInputElement>, nextInputName?: string, previousInputName?: string) => void
}

/* ➡ Componente del Input customizable */
export const Input = (
  { type, label, isRequired, name, size, value, variant, disabled, endContent, register, errors, className, classNamesInput, previousInputName, nextInputName, keyDown, keyUp }: InputProps
) => {
  return (
    <div className='relative w-full'>
      <div className='relative overflow-hidden p-[1px] rounded w-full'>
        <MyInput
          type={type}
          label={label}
          isRequired={isRequired}
          variant={variant}
          isDisabled={disabled}
          size={size}
          defaultValue={value}
          {...register(name)}
          endContent={endContent}
          isInvalid={false}
          radius='sm'
          className={cn(
            'z-10',
            className
          )}
          classNames={{
            input: [...(classNamesInput ?? []), cn(
              errors[name]?.message !== undefined ? 'text-color-secondary placeholder:text-color-secondary' : 'text-zinc-900 placeholder:text-zinc-600 dark:text-zinc-100 dark:placeholder:text-zinc-600'
            )],
            errorMessage: ['bg-white dark:bg-black py-2 px-2 rounded']
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (keyDown !== undefined) keyDown(e)
          }}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (keyUp !== undefined) keyUp(e, nextInputName, previousInputName)
          }}
          color={variant !== 'underlined' ? 'stone' : 'default'}
        />

      </div>
      {
        errors[name]?.message !== undefined && (
          <p className='text-color-pink-primary-accent-light mt-1 text-sm z-10'>{String(errors[name]?.message)}</p>
        )
      }
    </div>
  )
}
