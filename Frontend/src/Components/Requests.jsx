import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Base_Url } from '../utils/Constants';
import { addRequests, removeRequests } from '../utils/Requestjs';

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${Base_Url}/user/requests/recieved`, {
        withCredentials: true,
      });
      console.log('Full API Response:', res.data);
      console.log('Extracted Data for Dispatch:', res.data.data);
      const requestData = Array.isArray(res.data.data) ? res.data.data : [];
      dispatch(addRequests(requestData));
    } catch (error) {
      console.error('Error fetching requests:', error.response?.data || error.message);
      dispatch(addRequests([]));
    } finally {
      setLoading(false);
    }
  };

  const reviewRequest = async (status, requestId) => {
    try {
      console.log('Reviewing request:', { status, requestId, url: `${Base_Url}/request/review/${status}/${requestId}` });
      const res = await axios.post(
        `${Base_Url}/request/review/${status}/${requestId}`,
        { status },
        { withCredentials: true }
      );
      console.log('Review API Response:', res.data);
      dispatch(removeRequests(requestId));
      await fetchRequests(); // Refresh after review
    } catch (error) {
      console.error('Error reviewing request:', error.response?.data || error.message);
      alert('Failed to review request: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  useEffect(() => {
    console.log('useEffect triggered');
    fetchRequests();
  }, []);

  console.log('Current Requests State:', requests);
  console.log('Full Store State:', useSelector((store) => store));

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen sm:min-h-[50vh]'>
        <h1 className='font-bold text-2xl sm:text-3xl'>Loading...</h1>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen sm:min-h-[50vh]'>
        <h1 className='font-bold text-2xl sm:text-3xl'>No Requests found</h1>
        
      </div>
    );
  }

  return (
    <div className='text-center my-4 sm:my-8'>
      <h1 className='font-bold text-4xl sm:text-5xl mb-6 my-17'>Requests</h1>
      <div className='flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6'>
        {requests.map((request) => {
          const { _id, name = 'Unknown', photo_url = 'https://via.placeholder.com/80', age, gender, about = 'No description' } = request.fromUserId || {};
          return (
            <div key={request._id} className='flex flex-col sm:flex-row items-center p-2 sm:p-4 rounded-lg bg-base-300 w-full sm:w-[45%] md:w-[40%] lg:w-1/2 mx-auto justify-between shadow-md'>
              <div className='mb-2 sm:mb-0'>
                <img
                  alt='photo'
                  className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover'
                  src={photo_url}
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/80')}
                />
              </div>
              <div className='text-left mx-2 sm:mx-4 flex-1'>
                <h2 className='font-bold text-lg sm:text-xl'>{name}</h2>
                {age && gender ? <p className='text-sm sm:text-base'>{`${age}, ${gender}`}</p> : <p className='text-sm sm:text-base'>No age/gender provided</p>}
                <p className='text-sm sm:text-base'>{about}</p>
              </div>
              <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-0'>
                <button
                  className='btn btn-primary w-full sm:w-auto px-4 py-1 sm:px-6 sm:py-2 text-sm sm:text-base'
                  onClick={() => reviewRequest('rejected', request._id)}
                >
                  Reject
                </button>
                <button
                  className='btn btn-secondary w-full sm:w-auto px-4 py-1 sm:px-6 sm:py-2 text-sm sm:text-base'
                  onClick={() => reviewRequest('accepted', request._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;