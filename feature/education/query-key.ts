export const educationKeys = {
  all: ['education'] as const,
  list: () => [...educationKeys.all] as const,
  detail: (id: number) => [...educationKeys.all, id] as const,
}
