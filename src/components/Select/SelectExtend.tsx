import { extendVariants, Select } from '@nextui-org/react'

export const MySelect = extendVariants(Select, {
  variants: {
    color: {
      stone: {
        trigger: [
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
        ],
        value: [
          'text-zinc-900',
          'placeholder:text-zinc-600',
          // dark theme
          'dark:text-zinc-100',
          'dark:placeholder:text-zinc-600'
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
        selectorIcon: [
          'text-zinc-400 dark:text-zinc-500'
        ],
        value: [
          'text-zinc-400 dark:text-zinc-500'
        ]
      }
    }
  }
})
