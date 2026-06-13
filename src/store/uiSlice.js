import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeModal: null,
    toasts: [],
    theme: 'dark',
  },
  reducers: {
    openModal: (state, action) => { state.activeModal = action.payload },
    closeModal: (state) => { state.activeModal = null },
    addToast: (state, action) => {
      state.toasts.push({ id: Date.now(), ...action.payload })
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload)
    },
  },
})

export const { openModal, closeModal, addToast, removeToast } = uiSlice.actions
export default uiSlice.reducer
