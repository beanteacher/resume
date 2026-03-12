'use client'

import { useMutation } from '@tanstack/react-query'
import { authApi } from './api'

export function useLoginMutation(options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}

export function useLogoutMutation(options?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: options?.onSuccess,
  })
}
