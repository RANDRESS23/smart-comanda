import { cn } from '@/libs/utils'

interface ButtonProps {
  type: 'button' | 'submit' | 'reset'
  text: string
  disabled: boolean
  onClick?: () => void
}

/* ➡ Componente del boton customizable */
export const Button = ({ type, text, disabled, onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="w-full relative inline-flex overflow-hidden rounded p-[1px]"
    >
      <span className={cn(
        'inline-flex h-full w-full cursor-pointer items-center justify-center rounded bg-bg-color-pink-primary-gradient-light dark:bg-bg-color-pink-primary-gradient-dark px-3 py-3 text-md backdrop-blur-3xl transition-all text-white dark:hover:bg-color-secondary uppercase font-semibold hover:bg-bg-color-hover dark:hover:bg-bg-color-hover',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      >
        {text}
      </span>
    </button>
  )
}
