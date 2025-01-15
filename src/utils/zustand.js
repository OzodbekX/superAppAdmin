import { create } from 'zustand'

export const userStore = create((set) => ({
  token: localStorage.getItem('ttToken'),
  language: 'ru',
  chatServer: undefined,
  staffId: localStorage.getItem('ttStaffId'),
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
  setStaffId: (staffId) =>
    set((state) => {
      staffId?.length > 0
        ? localStorage.setItem('ttStaffId', staffId)
        : localStorage.removeItem('ttStaffId')
      return {
        ...state,
        staffId: staffId,
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
  setChatServer: (userName) =>
    set((state) => {
      return {
        ...state,
        chatServer: userName,
      }
    }),
}))
