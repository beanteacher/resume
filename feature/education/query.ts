'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { educationKeys } from './query-key'
import { educationApi } from './api'
import type { EducationDto, EducationWithProjects } from './type'

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
      queryClient.setQueryData<EducationWithProjects[]>(educationKeys.list(), (old = []) => [...old, { ...created, projects: [] }])
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
      queryClient.setQueryData<EducationWithProjects[]>(educationKeys.list(), (old = []) =>
        old.map(e => e.id === variables.id ? { ...updated, projects: e.projects } : e)
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
      queryClient.setQueryData<EducationWithProjects[]>(educationKeys.list(), (old = []) =>
        old.filter(e => e.id !== id)
      )
      queryClient.invalidateQueries({ queryKey: educationKeys.all })
    },
  })
}
