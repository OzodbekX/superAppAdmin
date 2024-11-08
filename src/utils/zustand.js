import { create } from 'zustand'

export const userStore = create((set) => ({
    token: localStorage.getItem('ttToken'),
    language: 'ru',
    userName: localStorage.getItem('ttUserName'),
    setToken: (newToken) =>
        set((state) => {
            newToken?.length > 0
                ? localStorage.setItem('ttToken', newToken)
                : localStorage.removeItem('ttToken')
            return {
                ...state,
                token: newToken,
            }
        }),
    setUserName: (userName) =>
        set((state) => {
            userName?.length > 0
                ? localStorage.setItem('ttUserName', userName)
                : localStorage.removeItem('ttUserName')

            return {
                ...state,
                userName: userName,
            }
        }),
}))
