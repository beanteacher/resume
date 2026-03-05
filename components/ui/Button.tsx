interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-[var(--radius-md)] transition-all duration-[var(--transition-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-purple)] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-gradient-to-r from-[var(--color-brand-purple)] to-[var(--color-brand-blue)] text-white hover:brightness-110 shadow-[var(--shadow-glow)]',
    secondary: 'bg-[var(--elevated)] text-[var(--text)] border border-[var(--border-color)] hover:bg-[var(--surface)]',
    ghost: 'text-[var(--color-brand-purple)] hover:bg-[var(--elevated)] border border-transparent',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-[var(--font-size-caption)]',
    md: 'px-5 py-2.5 text-[var(--font-size-body2)]',
    lg: 'px-8 py-3.5 text-[var(--font-size-body1)]',
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
