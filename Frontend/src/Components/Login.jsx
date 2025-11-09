import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import {Base_Url} from '../utils/Constants';


const Login = () => {
  const [email, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const[name,setName] = useState("");
  const[age,setAge] = useState("");
  const[gender,setGender] = useState("");
  const[photo_url,setPhotoUrl] = useState("");
  const[about,setAbout] = useState("");
  const[Skills,setSkills] = useState("");
  const [error, setError] = useState(null);
  const[isLoginForm, setIsLoginForm] = useState(true);
  const Dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents page reload
    setError(null); // prevents page reload
    try {
      const res = await axios.post(
        Base_Url + '/login',
        { email, password },
        { withCredentials: true }
      );
      console.log(res.data);
      Dispatch(addUser(res.data));
      return navigate('/');
    } catch (error) {
       console.error('Login error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        setError('Login failed: Invalid Credentials');
      } else if (error.response?.status === 404) {
        setError(`Login failed: User not found`);
      } else if( error.response?.status === 400){
        setError(`Login failed: Enter values`); 
      }
      else{
        setError(`Login failed: ${error.message}.`);
      }
    }
  };

const handleSignup = async (e) => {
  e.preventDefault(); // Add this for consistency
  try {
    const res = await axios.post(   
      Base_Url + '/signup',
      {
        email,
        password,
        name,
        age,
        gender,
        photo_url,
        about,
        Skills,
      },
      { withCredentials: true }
    );

    console.log(res.data);
    Dispatch(addUser(res.data.data));
    navigate('/profile'); // No need to return
  } catch (error) {
    console.error('Signup error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    setError(error?.response?.data || 'Failed to signup. Please try again.');
  }
};



  return (
    <div className="flex justify-center items-center my-20">
      <div className="card card-dash bg-base-100 w-96">
        <div className="card-body">
          <h1 className="card-title justify-center">{isLoginForm ? 'Login' : 'Sign Up'}</h1>
           {error && (
            <div className="alert alert-error mt-2">
              <span>{error}</span>
            </div>
          )}
     
          <form onSubmit={isLoginForm ? handleLogin : handleSignup} className="flex flex-col">


          
          {!isLoginForm && <><label className="form-control w-full max-w-xs py-2 my-2">
            <span className="label-text">Name</span>
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full max-w-xs"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          
          <label className="form-control w-full max-w-xs py-2 my-2">
            <span className="label-text">Age</span>
            <input
              type="number"
              placeholder="Age"
              className="input input-bordered w-full max-w-xs"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </label>

          
          <label className="form-control w-full max-w-xs py-2 my-2">
            <span className="label-text">Gender</span>
            <input
              type="text"
              placeholder="Gender"
              className="input input-bordered w-full max-w-xs"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
          </label>

          
          <label className="form-control w-full max-w-xs py-2 my-2">
            <span className="label-text">About</span>
            <input
              type="text"
              placeholder="About"
              className="input input-bordered w-full max-w-xs"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </label>

          
          <label className="form-control w-full max-w-xs py-2 my-2">
            <span className="label-text">Skills</span>
            <input
              type="text"
              placeholder="Skills"
              className="input input-bordered w-full max-w-xs"
              value={Skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </label>

          
          <label className="form-control w-full max-w-xs py-2 my-2">
            <span className="label-text">Photo URL</span>
            <input
              type="text"
              placeholder="Photo URL"
              className="input input-bordered w-full max-w-xs"
              value={photo_url}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </label></>}

            <label className="form-control w-full max-w-xs py-2 my-2">
              <span className="label-text">Email ID</span>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full max-w-xs"
                value={email}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>



            <label className="form-control w-full max-w-xs py-2 my-2">
              <span className="label-text">Password</span>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full max-w-xs"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <div className="card-actions justify-center m-2">
              <button type="submit" className="btn btn-primary">
                {isLoginForm ? 'Login' : 'Sign Up'}
              </button>
            </div>
            <p className= "mt-2 cursor-pointer text-center" onClick={() => setIsLoginForm((value) => !value)}>{isLoginForm ? 'Don\'t have an account? SignUp ' : 'Already have an account? Login'}</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
