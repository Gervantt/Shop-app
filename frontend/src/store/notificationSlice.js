import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  type: 'info', // 'success', 'error', 'info', 'warning'
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type || 'info';
    },
    clearNotification: (state) => {
      state.message = null;
      state.type = 'info';
    },
  },
});

export const { showNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
