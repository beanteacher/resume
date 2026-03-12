export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all] as const,
  detail: (id: number) => [...projectKeys.all, id] as const,
}
