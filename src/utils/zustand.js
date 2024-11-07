import { create } from 'zustand'

export const userStore = create((set) => ({
  token: localStorage.getItem('ttToken'),
  language: 'ru',
  userName: 'Common operator',
  setToken: (newToken) =>
    set((state) => {
      localStorage.setItem('ttToken', newToken)
      return {
        ...state,
        token: newToken,
      }
    }),
  setAdmin: (userName) =>
    set((state) => {
      return {
        ...state,
        userName: userName,
      }
    }),
  removeToken: () => set((state) => ({ token: '' })),
}))
