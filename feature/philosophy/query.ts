'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { philosophyKeys } from './query-key'
import { philosophyApi } from './api'

export function usePhilosophyQuery(id: number | null) {
  return useQuery({
    queryKey: philosophyKeys.detail(id!),
    queryFn: () => philosophyApi.getById(id!),
    enabled: id !== null,
  })
}

export function usePhilosophiesQuery() {
  return useQuery({
    queryKey: philosophyKeys.list(),
    queryFn: () => philosophyApi.getAll(),
    placeholderData: (prev) => prev,
  })
}

export function useCreatePhilosophyMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: philosophyApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: philosophyKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useUpdatePhilosophyMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: philosophyApi.update,
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(philosophyKeys.detail(variables.id), updated)
      queryClient.invalidateQueries({ queryKey: philosophyKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useDeletePhilosophyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: philosophyApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: philosophyKeys.all }),
  })
}
