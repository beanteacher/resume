'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { educationKeys } from './query-key'
import { educationApi } from './api'
import type { EducationDto } from './type'

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
    onSuccess: (created) => {
      queryClient.setQueryData<EducationDto[]>(educationKeys.list(), (old = []) => [...old, created])
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
      queryClient.setQueryData<EducationDto[]>(educationKeys.list(), (old = []) =>
        old.map(e => e.id === variables.id ? updated : e)
      )
      queryClient.invalidateQueries({ queryKey: educationKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useDeleteEducationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: educationApi.delete,
    onSuccess: (_, id) => {
      queryClient.setQueryData<EducationDto[]>(educationKeys.list(), (old = []) =>
        old.filter(e => e.id !== id)
      )
      queryClient.invalidateQueries({ queryKey: educationKeys.all })
    },
  })
}
