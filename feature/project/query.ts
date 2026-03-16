'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectKeys } from './query-key'
import { projectApi } from './api'
import type { ProjectDto } from './type'

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

export function useStandaloneProjectsQuery() {
  return useQuery({
    queryKey: projectKeys.standalone(),
    queryFn: () => projectApi.getStandalone(),
    placeholderData: (prev) => prev,
  })
}

export function useCreateProjectMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: projectApi.create,
    onSuccess: (created) => {
      queryClient.setQueryData<ProjectDto[]>(projectKeys.list(), (old = []) => [...old, created])
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
      queryClient.setQueryData<ProjectDto[]>(projectKeys.list(), (old = []) =>
        old.map(p => p.id === variables.id ? updated : p)
      )
      queryClient.invalidateQueries({ queryKey: projectKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: projectApi.delete,
    onSuccess: (_, id) => {
      queryClient.setQueryData<ProjectDto[]>(projectKeys.list(), (old = []) =>
        old.filter(p => p.id !== id)
      )
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}
