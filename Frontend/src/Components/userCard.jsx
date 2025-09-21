import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';
import { Base_Url } from '../utils/Constants';

const UserCard = ({ user }) => {
  const defaultImage = 'https://placehold.co/150x150';
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  // Destructure user with fallback values
  const { _id, name = 'Unknown User', photo_url, age, gender, about, Skills } = user || {};

  const handleSendRequest = async (status, userId) => {
    if (!userId || requestSent) {
      setError('Invalid user ID or request already sent');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log('Sending request:', { status, userId, url: `${Base_Url}/request/send/interested/${userId}` });
      const res = await axios.post(
        `${Base_Url}/request/send/interested/${userId}`,
        { status },
        { withCredentials: true }
      );
      console.log('API Response:', res.data);
      dispatch(removeUserFromFeed(userId.toString()));
      setRequestSent(true);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Unknown error';
      setError(errorMessage);
      console.error('Error sending request:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // If no user data is provided, show a fallback message
  if (!user) {
    console.log('UserCard: No user data', { user });
    return <div className="alert alert-warning">No user data available</div>;
  }

  return (
    <div className="card bg-base-100 w-96 shadow-sm my-10">
      <figure>
        <img
          src={photo_url || defaultImage}
          alt={`${name} Photo`}
          className="w-full h-100 object-cover"
          onError={(e) => {
            e.target.src = defaultImage;
            console.error('Image failed to load:', photo_url);
          }}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        {age && gender ? <p>{`${age}, ${gender}`}</p> : <p>No age/gender provided</p>}
        <p>{about || 'No description provided'}</p>
      
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="card-actions justify-center my-4">
          <button
            className="btn btn-primary"
            onClick={() => handleSendRequest('ignored', _id)}
            
          >
            {isLoading ? 'Processing...' : requestSent ? 'Request Sent' : 'Ignore'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSendRequest('interested', _id)}
            
          >
            {isLoading ? 'Processing...' : requestSent ? 'Request Sent' : 'Interested'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;