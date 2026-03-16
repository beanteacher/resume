'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { philosophyKeys } from './query-key'
import { philosophyApi } from './api'
import type { PhilosophyDto } from './type'

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
    onSuccess: (created) => {
      queryClient.setQueryData<PhilosophyDto[]>(philosophyKeys.list(), (old = []) => [...old, created])
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
      queryClient.setQueryData<PhilosophyDto[]>(philosophyKeys.list(), (old = []) =>
        old.map(p => p.id === variables.id ? updated : p)
      )
      queryClient.invalidateQueries({ queryKey: philosophyKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useDeletePhilosophyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: philosophyApi.delete,
    onSuccess: (_, id) => {
      queryClient.setQueryData<PhilosophyDto[]>(philosophyKeys.list(), (old = []) =>
        old.filter(p => p.id !== id)
      )
      queryClient.invalidateQueries({ queryKey: philosophyKeys.all })
    },
  })
}
