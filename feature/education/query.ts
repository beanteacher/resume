'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { educationKeys } from './query-key'
import { educationApi } from './api'

export function useEducationQuery(id: number | null) {
  return useQuery({
    queryKey: educationKeys.detail(id!),
    queryFn: () => educationApi.getById(id!),
    enabled: id !== null,
  })
}

export function useEducationsQuery() {
  return useQuery({
    queryKey: educationKeys.list(),
    queryFn: () => educationApi.getAll(),
    placeholderData: (prev) => prev,
  })
}

export function useCreateEducationMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: educationApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: educationKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useUpdateEducationMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: educationApi.update,
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(educationKeys.detail(variables.id), updated)
      queryClient.invalidateQueries({ queryKey: educationKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useDeleteEducationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: educationApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: educationKeys.all }),
  })
}
