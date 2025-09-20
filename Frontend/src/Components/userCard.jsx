import React from 'react';

const UserCard = ({ user }) => {

  const {name, email, password, photo_url, age, gender, about, Skills } = user;
  console.log('User data:', user);
  console.log('Photo URL:', user.photo_url); // Debug photo_url
  


  const defaultImage = 'https://via.placeholder.com/150?text=No+Image'; // Placeholder fallback image

  if (!user) {
    return <div className="alert alert-warning">No user data available</div>;
  }

  return (
    <div className="card bg-base-100 w-96 shadow-sm my-10">
      <figure>
        <img
          src={user.photo_url || defaultImage}
          alt={`${user.name || 'User'} Photo`}
          className="w-full h-100 object-cover "
          onError={(e) => {
            e.target.src = defaultImage;
            console.error('Image failed to load:', user.photo_url);
          }}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{user.name || 'Unknown User'}</h2>
        {age && gender && <p>{age +", "+ gender}</p>}
        <p>
          {about}
        </p>
        <div className='card-actions justify-center my-4'>
        <button className='btn btn-primary'>Ignore</button>
        <button className='btn btn-secondary'>Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
