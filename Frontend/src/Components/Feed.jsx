import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import { Base_Url } from '../utils/Constants';
import UserCard from './userCard';

const Feed = () => {
  const feed = useSelector((store) => store.feed || []);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const getFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${Base_Url}/user/feed`, { withCredentials: true });
      console.log('API Response:', res.data);
      const feedData = Array.isArray(res.data.data)
        ? res.data.data.filter((user) => user && user._id)
        : [];
      console.log('Filtered feedData:', feedData);
      dispatch(addFeed(feedData));
      setCurrentUserIndex(0); // Reset to first user when new feed is loaded
    } catch (error) {
      console.error('Error fetching feed:', error.response?.data || error.message);
      setError('Failed to load feed. Please try again later.');
      dispatch(addFeed([]));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, [dispatch]);

  // Listen for changes in feed to reset index if feed is updated
  useEffect(() => {
    if (Array.isArray(feed) && feed.length === 0) {
      setCurrentUserIndex(0);
    }
  }, [feed]);

  console.log('Current feed state:', feed, 'Type:', typeof feed, 'Is Array:', Array.isArray(feed));
  console.log('Current user index:', currentUserIndex);

  if (isLoading) {
    return (
      <div className="alert alert-info text-center flex items-center justify-center my-40 w-100 m-auto">
        Loading feed...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error text-center flex items-center justify-center my-40 w-100 m-auto">
        {error}
      </div>
    );
  }

  if (!Array.isArray(feed) || feed.length === 0) {
    console.log('Feed empty or not an array:', feed);
    return (
      <div className="alert alert-warning text-center flex items-center justify-center my-40 w-100 m-auto">
        No feed data available
      </div>
    );
  }

  const validUsers = feed.filter((user) => {
    const isValid = user && user._id;
    if (!isValid) console.log('Invalid user in feed:', user);
    return isValid;
  });
  console.log('Valid users for rendering:', validUsers);

  if (validUsers.length === 0 || currentUserIndex >= validUsers.length) {
    console.log('No valid users or all users processed:', validUsers, currentUserIndex);
    return (
      <div className="alert alert-warning text-center flex items-center justify-center my-40 w-full m-auto">
        No more users to display
      </div>
    );
  }

  const currentUser = validUsers[currentUserIndex];

  return (
    <div className="flex justify-center my-10 px-10">
      <UserCard
        key={currentUser._id}
        user={currentUser}
      />
    </div>
  );
};

export default Feed;