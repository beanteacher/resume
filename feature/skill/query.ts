'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { skillKeys } from './query-key'
import { skillApi } from './api'

export function useSkillQuery(id: number | null) {
  return useQuery({
    queryKey: skillKeys.detail(id!),
    queryFn: () => skillApi.getById(id!),
    enabled: id !== null,
  })
}

export function useSkillsQuery() {
  return useQuery({
    queryKey: skillKeys.list(),
    queryFn: () => skillApi.getAll(),
    placeholderData: (prev) => prev,
  })
}

export function useCreateSkillMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: skillApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useUpdateSkillMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: skillApi.update,
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(skillKeys.detail(variables.id), updated)
      queryClient.invalidateQueries({ queryKey: skillKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useDeleteSkillMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: skillApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: skillKeys.all }),
  })
}

export function useReorderSkillsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: skillApi.reorder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: skillKeys.list() }),
  })
}
