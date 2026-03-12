export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all] as const,
}
