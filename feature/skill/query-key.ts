export const skillKeys = {
  all: ['skills'] as const,
  list: () => [...skillKeys.all] as const,
  detail: (id: number) => [...skillKeys.all, id] as const,
}
