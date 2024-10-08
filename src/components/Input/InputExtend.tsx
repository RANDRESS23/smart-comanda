import { extendVariants, Input } from '@nextui-org/react'

export const MyInput = extendVariants(Input, {
  variants: {
    color: {
      stone: {
        inputWrapper: [
          'bg-[#fdfdfd]',
          'border',
          'shadow',
          'transition-colors',
          'focus-within:bg-white',
          'data-[hover=true]:border-transparent',
          'data-[hover=true]:bg-white',
          'group-data-[focus=true]:border-transparent',
          'group-data-[focus=true]:bg-white',
          // dark theme
          'dark:bg-[#1b1b1d]',
          'dark:border-[#1b1b1d]',
          'dark:data-[hover=true]:bg-[#1f1f20]',
          'dark:focus-within:bg-zinc-900',
          'dark:group-data-[focus=true]:bg-[#151516]'
        ]
      }
    },
    isDisabled: {
      true: {
        base: [
          'opacity-1'
        ],
        label: [
          'text-zinc-400 dark:text-zinc-500'
        ],
        input: [
          'text-zinc-400 dark:text-zinc-500'
        ]
      }
    }
  }
})
