import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice';
import feedReducer from './feedSlice';
import connectionsReducer from './ConnectionsSlice';
import requestsReducer from './Requestjs';
export default configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionsReducer,
    requests:requestsReducer,
  }
})