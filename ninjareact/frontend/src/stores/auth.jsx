import {create} from "zustand"

const useAuthStore = create((set) => ({
    isAuthenticated: false,
    username: '',

    login: (username) => set(() => ({
        isAuthenticated: true,
        username
    })),

    logout: () => set({
        isAuthenticated: false
    }),
}))

export default useAuthStore;