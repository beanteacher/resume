export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
  standalone: () => [...projectKeys.all, 'standalone'] as const,
  detail: (id: number) => [...projectKeys.all, id] as const,
}
