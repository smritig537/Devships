import React, { use, useState } from 'react';
import { useDispatch } from 'react-redux';
import UserCard from './userCard';
import axios from 'axios';
import { Base_Url } from '../utils/Constants';
import { addUser } from '../utils/userSlice';


const Editprofile = ({ user }) => {
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [about, setAbout] = useState(user.about);
  const [Skills, setSkills] = useState(user.Skills);
  const [photo_url, setPhotoUrl] = useState(user.photo_url);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  console.log('User in Editprofile:', user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = { name, age, gender, about, Skills, photo_url };
    console.log('Sending PATCH request with:', updatedUser);

    try {
      const res = await axios.patch(`${Base_Url}/profile/edit`, updatedUser, {
        withCredentials: true,
      });
      dispatch(addUser(res.data.user)); 
      setShowToast(true);
      setTimeout(()=> {
        setShowToast(false);
      },3000);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);
      console.error('Update error:', err.response ? err.response.data : err.message);
    }
  };
  

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center my-17 mx-2 md:mx-10">
        <div className="card card-dash bg-base-100 shadow-md w-full max-w-md md:max-w-lg lg:max-w-xl">
          <div className="card-body">
            <h1 className="card-title text-center align-center text-lg md:text-xl">Edit Profile</h1>
            {error && (
              <div className="alert alert-error mt-2 text-sm md:text-base">
                <span>{error}</span>
              </div>
            )}
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <label className="form-control w-full">
                <span className="label-text text-sm md:text-base">Name</span>
                <input
                  type="text"
                  placeholder="Name"
                  className="input input-bordered w-full rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text text-sm md:text-base">Age</span>
                <input
                  type="text"
                  placeholder="Age"
                  className="input input-bordered w-full rounded-md"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text text-sm md:text-base">Gender</span>
                <input
                  type="text"
                  placeholder="Gender"
                  className="input input-bordered w-full rounded-md"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text text-sm md:text-base">Photo URL</span>
                <input
                  type="text"
                  placeholder="Photo URL"
                  className="input input-bordered w-full rounded-md"
                  value={photo_url}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text text-sm md:text-base">Skills</span>
                <input
                  type="text"
                  placeholder="Skills"
                  className="input input-bordered w-full rounded-md"
                  value={Skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text text-sm md:text-base">About</span>
                <input
                  type="text"
                  placeholder="About"
                  className="input input-bordered w-full rounded-md"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </label>

              <div className="card-actions justify-center mt-4">
                <button type="submit" className="btn btn-primary w-full md:w-auto"
               onClick={handleSubmit}>
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4">
          <UserCard user={{name, photo_url, age, gender, about, Skills}} />
        </div>
      </div>
  {showToast &&(
          <div className="toast toast-top toast-center z-10">
      <div className="alert alert-success">
    <span>Profile Saved successfully.</span>
  </div>
 </div>
)}
    </>
  );
};

export default Editprofile;