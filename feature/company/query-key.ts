export const companyKeys = {
  all: ['companies'] as const,
  list: () => [...companyKeys.all] as const,
  detail: (id: number) => [...companyKeys.all, id] as const,
}
