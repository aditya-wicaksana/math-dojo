import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-400 hover:bg-primary-500 active:bg-primary-600 text-white shadow-md hover:shadow-lg',
  secondary:
    'bg-secondary-400 hover:bg-secondary-500 active:bg-secondary-600 text-white shadow-md hover:shadow-lg',
  ghost:
    'bg-white/80 hover:bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700',
  danger:
    'bg-red-400 hover:bg-red-500 active:bg-red-600 text-white shadow-md hover:shadow-lg',
  success:
    'bg-green-400 hover:bg-green-500 active:bg-green-600 text-white shadow-md hover:shadow-lg',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-xl min-h-[36px]',
  md: 'px-5 py-2.5 text-base rounded-2xl min-h-[44px]',
  lg: 'px-7 py-3 text-lg rounded-2xl min-h-[52px]',
  xl: 'px-8 py-4 text-xl rounded-3xl min-h-[60px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        {...props}
        disabled={disabled}
        className={[
          'font-nunito font-bold transition-all duration-150 active:scale-95',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300',
          'select-none cursor-pointer',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          disabled ? 'opacity-50 pointer-events-none' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
