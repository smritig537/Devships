import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import { Base_Url } from '../utils/Constants';
import UserCard from './userCard';

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

 const getFeed = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const res = await axios.get(`${Base_Url}/user/feed`, { withCredentials: true });
    console.log('API Response:', res.data);

    // Extract the array of users from res.data.data
    const feedData = Array.isArray(res.data.data) ? res.data.data : [];

    dispatch(addFeed(feedData));
  } catch (error) {
    console.error('Error fetching feed:', error.response?.data, error.message);
    setError('Failed to load feed. Please try again later.');
    dispatch(addFeed([])); // Fallback to empty array on error
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    getFeed();
  }, []);

  
  console.log('Current feed state:', feed, 'Type:', typeof feed, 'Is Array:', Array.isArray(feed));

  if (isLoading) {
    return <div className="alert alert-info text-center flex items-center justify-center my-40 w-100 m-auto">Loading feed...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-error text-center flex items-center justify-center my-40 w-100 m-auto">
        {error}
       
      </div>
    );
  }

  if (!feed || !Array.isArray(feed) || feed.length === 0) {
    return <div className="alert alert-warning text-center flex items-center justify-center my-40 w-100 m-auto">No feed data available</div>;
  }

  return (
  feed &&(  <div className="flex flex-wrap justify-center my-10 px-10 gap-4">
    {/*feed.map((user, index) => (
      <UserCard key={index} user={user} />
    ))*/}
    <UserCard user={feed[1]} />
    </div>)
  );
};

export default Feed;