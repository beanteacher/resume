'use client'

import React, { useEffect, useId, useMemo, useRef, useState } from 'react'

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  error?: string
  options: Array<{ value: string | number; label: string }>
}

const fieldClass = (error?: string, hasValue = false, extra = '') =>
  [
    'w-full rounded-[var(--radius-sm)] border border-[var(--border-color)]',
    'bg-[var(--elevated)] px-4 py-2 pr-10 text-left',
    hasValue ? 'text-[var(--text)]' : 'text-[var(--text-muted)]',
    'transition-colors duration-[var(--transition-fast)]',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-purple)]',
    'focus:border-transparent',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    error ? 'border-red-500 ring-1 ring-red-500' : '',
    extra,
  ]
    .filter(Boolean)
    .join(' ')

export function Select({ label, error, options, className = '', id, value, defaultValue, onChange, disabled, name, required, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const wrapperRef = useRef<HTMLDivElement>(null)
  const hiddenSelectRef = useRef<HTMLSelectElement>(null)
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(() => (defaultValue !== undefined ? String(defaultValue) : ''))
  const [open, setOpen] = useState(false)

  const selectedValue = isControlled ? String(value ?? '') : internalValue

  const normalizedOptions = useMemo(
    () => [{ value: '', label: '선택하세요' }, ...options.map((option) => ({ ...option, value: String(option.value) }))],
    [options]
  )

  const selectedOption = normalizedOptions.find((option) => option.value === selectedValue)
  const hasValue = selectedValue.length > 0

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [])

  const commitValue = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }

    const element = hiddenSelectRef.current
    if (element) {
      element.value = nextValue
      element.dispatchEvent(new Event('change', { bubbles: true }))
    }

    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[var(--text)]">
          {label}
        </label>
      )}

      <div ref={wrapperRef} className="relative">
        <select
          {...props}
          id={selectId}
          ref={hiddenSelectRef}
          name={name}
          value={selectedValue}
          defaultValue={undefined}
          onChange={onChange}
          disabled={disabled}
          required={required}
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        >
          {normalizedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${selectId}-listbox`}
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className={fieldClass(error, hasValue, className)}
        >
          <span className="block truncate pr-4">{selectedOption?.label ?? '선택하세요'}</span>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              className={`h-4 w-4 text-[var(--text-muted)] transition-transform duration-[var(--transition-fast)] ${open ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {open && !disabled && (
          <div
            id={`${selectId}-listbox`}
            role="listbox"
            className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-[var(--elevated)] shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
          >
            {normalizedOptions.map((option) => {
              const isSelected = option.value === selectedValue

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => commitValue(option.value)}
                  className={[
                    'flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors duration-[var(--transition-fast)]',
                    isSelected
                      ? 'bg-[color:color-mix(in_srgb,var(--color-brand-purple)_18%,var(--elevated))] text-[var(--text)]'
                      : 'text-[var(--text)] hover:bg-[var(--surface)]',
                    option.value === '' ? 'text-[var(--text-muted)]' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span>{option.label}</span>
                  {isSelected && option.value !== '' && <span className="text-xs text-[var(--text-muted)]">선택됨</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}
