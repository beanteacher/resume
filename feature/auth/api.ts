export const authApi = {
  login: async (password: string): Promise<void> => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!res.ok) {
      const json = (await res.json()) as { error?: string }
      throw new Error(json.error ?? '로그인에 실패했습니다.')
    }
  },

  logout: async (): Promise<void> => {
    await fetch('/api/admin/logout', { method: 'POST' })
  },
}
