'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { skillKeys } from './query-key'
import { skillApi } from './api'
import type { SkillsByCategory } from './type'

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
    onSuccess: (created) => {
      queryClient.setQueryData<SkillsByCategory>(skillKeys.list(), (old = {}) => ({
        ...old,
        [created.category]: [...(old[created.category] ?? []), created],
      }))
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
      queryClient.setQueryData<SkillsByCategory>(skillKeys.list(), (old = {}) => {
        const next: SkillsByCategory = {}
        for (const [cat, skills] of Object.entries(old)) {
          const filtered = skills.filter(s => s.id !== updated.id)
          if (filtered.length > 0) next[cat] = filtered
        }
        next[updated.category] = [...(next[updated.category] ?? []), updated]
        return next
      })
      queryClient.invalidateQueries({ queryKey: skillKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useDeleteSkillMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: skillApi.delete,
    onSuccess: (_, id) => {
      queryClient.setQueryData<SkillsByCategory>(skillKeys.list(), (old = {}) => {
        const next: SkillsByCategory = {}
        for (const [cat, skills] of Object.entries(old)) {
          const filtered = skills.filter(s => s.id !== id)
          if (filtered.length > 0) next[cat] = filtered
        }
        return next
      })
      queryClient.invalidateQueries({ queryKey: skillKeys.all })
    },
  })
}

export function useReorderSkillsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: skillApi.reorder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: skillKeys.list() }),
  })
}
