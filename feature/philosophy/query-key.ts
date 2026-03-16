export const philosophyKeys = {
  all: ['philosophy'] as const,
  list: () => [...philosophyKeys.all] as const,
  detail: (id: number) => [...philosophyKeys.all, id] as const,
}
