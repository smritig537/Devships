import axios from 'axios';
import React, { useEffect } from 'react';
import { Base_Url } from '../utils/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../utils/ConnectionsSlice';

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  console.log('Connections state:', connections);
  console.log('Logged-in user:', user);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(Base_Url + '/user/connections', {
        withCredentials: true,
      });
      console.log('Full API response:', res.data);
      dispatch(addConnections(res.data.data));
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const filteredConnections = connections.filter((connection) => {
    const userId = user?._id || user;
    const fromUserId = connection.fromUserId?._id || connection.fromUserId;
    const toUserId = connection.toUserId?._id || connection.toUserId;
    return (fromUserId && toUserId) && 
           (fromUserId.toString() === userId.toString() || toUserId.toString() === userId.toString());
  });

  if (filteredConnections.length === 0) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <h1 className='text-bold text-2xl text-white'>No connections found</h1>
      </div>
    );
  }

  return (
    <div className='min-h-screen text-white p-6 flex flex-col items-center'>
      <h1 className='text-3xl font-bold text-center my-16'>Connections</h1>
      <div className='flex flex-wrap justify-center gap-6 max-w-7xl w-full'>
        {filteredConnections.map((connection) => {
          console.log('Connection:', connection);

          const userId = user?._id || user;
          const fromUser = connection.fromUserId || {};
          const toUser = connection.toUserId || {};
          const otherUser = (fromUser._id || fromUser).toString() === userId.toString() ? toUser : fromUser;

          const { _id: otherUserId, name, about, age, gender, photo_url } = otherUser;
          const connectionId = connection._id;
          const displayGender = gender || 'N/A';

          return (
            <div
              key={connectionId}
              className='bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 flex flex-row items-center w-full max-w-2xl'
            >
              <div className='mr-6'>
                <img
                  alt={`${name || 'User'} profile`}
                  className='w-20 h-20 rounded-full object-cover border-4 border-gray-600'
                  src={photo_url || 'https://picsum.photos/96'}
                  onError={(e) => {
                    e.target.src = 'https://picsum.photos/96';
                  }}
                />
              </div>
              <div className='text-left px-3'>
                <h2 className='text-xl font-semibold mb-2 text-white'>{name || 'Unknown User'}</h2>
                {age ? (
                  <p className='text-gray-400 mb-2'>{age} years old • {displayGender}</p>
                ) : (
                  <p className='text-gray-500 mb-2 text-sm'>Age/Gender not specified</p>
                )}
                {about ? (
                  <p className='text-gray-300 text-sm leading-relaxed'>{about}</p>
                ) : (
                  <p className='text-gray-500 italic text-sm'>No description available</p>
                )}
                <p className='text-xs text-gray-500 mt-2'>
                  Connected: {new Date(connection.createdAt).toLocaleDateString()} • Status: {connection.status}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;