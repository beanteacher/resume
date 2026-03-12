'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companyKeys } from './query-key'
import { companyApi } from './api'

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

export function useCreateCompanyMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: companyApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useUpdateCompanyMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: companyApi.update,
    onSuccess: (updatedCompany, variables) => {
      queryClient.setQueryData(companyKeys.detail(variables.id), updatedCompany)
      queryClient.invalidateQueries({ queryKey: companyKeys.list() })
      options?.onSuccess?.()
    },
  })
}

export function useDeleteCompanyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: companyApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: companyKeys.all }),
  })
}
