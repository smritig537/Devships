import { createSlice } from '@reduxjs/toolkit';

const requestsSlice = createSlice({
  name: 'requests',
  initialState: [],
  reducers: {
    addRequests: (state, action) => {
      return action.payload;
    },
    removeRequests: (state, action) => {
      console.log('removeRequests action:', action.payload); // Debug
      return state.filter((request) => request._id !== action.payload); // Use request._id
    },
  },
});

export const { addRequests, removeRequests } = requestsSlice.actions;
export default requestsSlice.reducer; 