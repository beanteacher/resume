'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectKeys } from './query-key'
import { projectApi } from './api'

export function useProjectQuery(id: number | null) {
  return useQuery({
    queryKey: projectKeys.detail(id!),
    queryFn: () => projectApi.getById(id!),
    enabled: id !== null,
  })
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: () => projectApi.getAll(),
    placeholderData: (prev) => prev,
  })
}

export function useCreateProjectMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: projectApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useUpdateProjectMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: projectApi.update,
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(projectKeys.detail(variables.id), updated)
      queryClient.invalidateQueries({ queryKey: projectKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: projectApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  })
}
