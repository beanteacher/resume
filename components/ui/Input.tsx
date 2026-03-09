import React from 'react'

interface BaseProps {
  label?: string
  error?: string
  helperText?: string
  className?: string
}

interface InputProps extends BaseProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'as'> {
  as?: 'input'
}

interface TextareaProps extends BaseProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'as'> {
  as: 'textarea'
}

type Props = InputProps | TextareaProps

const fieldClass = (error?: string, extra = '') =>
  [
    'w-full px-4 py-2 rounded-[var(--radius-sm)]',
    'bg-[var(--elevated)] text-[var(--text)]',
    'border border-[var(--border-color)]',
    'placeholder:text-[var(--text-secondary)]',
    'transition-colors duration-[var(--transition-fast)]',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-purple)]',
    'focus:border-transparent',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    error ? 'border-red-500 ring-1 ring-red-500' : '',
    extra,
  ]
    .filter(Boolean)
    .join(' ')

export function Input(props: Props) {
  if (props.as === 'textarea') {
    const { label, error, helperText, as: _as, className = '', ...rest } = props
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[var(--text)]">{label}</label>
        )}
        <textarea
          className={fieldClass(error, `resize-none ${className}`)}
          {...rest}
        />
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-[var(--text-secondary)]">{helperText}</p>
        )}
      </div>
    )
  }

  const { label, error, helperText, as: _as, className = '', ...rest } = props as InputProps
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={rest.id} className="text-sm font-medium text-[var(--text)]">
          {label}
        </label>
      )}
      <input
        className={fieldClass(error, className)}
        {...rest}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-[var(--text-secondary)]">{helperText}</p>
      )}
    </div>
  )
}
