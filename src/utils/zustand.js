import { create } from 'zustand'

export const userStore = create((set) => ({
    token: "",
    setToken: (newToken) => set((state) => {
        localStorage.setItem('token', newToken)
        return ({
            token: newToken
        })
    }),
    removeToken: () => set((state) => ({ token:"" })),
}))
