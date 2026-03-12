'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileKeys } from './query-key'
import { profileApi } from './api'

export function useProfileQuery() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: profileApi.get,
  })
}

export function useUpdateProfileMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: profileApi.update,
    onSuccess: (updated) => {
      queryClient.setQueryData(profileKeys.detail(), updated)
      options?.onSuccess?.()
    },
  })
}
