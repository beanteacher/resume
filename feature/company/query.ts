'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companyKeys } from './query-key'
import { companyApi } from './api'
import type { CompanyDto, CompanyWithProjects } from './type'

export function useCompanyQuery(id: number | null) {
  return useQuery({
    queryKey: companyKeys.detail(id!),
    queryFn: () => companyApi.getById(id!),
    enabled: id !== null,
  })
}

export function useCompaniesQuery() {
  return useQuery({
    queryKey: companyKeys.list(),
    queryFn: () => companyApi.getAll(),
    placeholderData: (prev) => prev,
  })
}

export function useCompaniesWithProjectsQuery() {
  return useQuery<CompanyWithProjects[]>({
    queryKey: [...companyKeys.list(), 'with-projects'],
    queryFn: () => companyApi.getAllWithProjects(),
    placeholderData: (prev) => prev,
  })
}

export function useCreateCompanyMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: companyApi.create,
    onSuccess: (created) => {
      queryClient.setQueryData<CompanyDto[]>(companyKeys.list(), (old = []) => [...old, created])
      queryClient.invalidateQueries({ queryKey: companyKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useUpdateCompanyMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: companyApi.update,
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(companyKeys.detail(variables.id), updated)
      queryClient.setQueryData<CompanyDto[]>(companyKeys.list(), (old = []) =>
        old.map(c => c.id === variables.id ? updated : c)
      )
      queryClient.invalidateQueries({ queryKey: companyKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useDeleteCompanyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: companyApi.delete,
    onSuccess: (_, id) => {
      queryClient.setQueryData<CompanyDto[]>(companyKeys.list(), (old = []) =>
        old.filter(c => c.id !== id)
      )
      queryClient.invalidateQueries({ queryKey: companyKeys.all })
    },
  })
}
