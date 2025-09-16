import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import {Base_Url} from '../utils/Constants';


const Login = () => {
  const [email, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const Dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault(); // prevents page reload
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
      console.log('error', error);
    }
  };

  return (
    <div className="flex justify-center items-center my-10">
      <div className="card card-dash bg-base-100 w-96">
        <div className="card-body">
          <h1 className="card-title justify-center">Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col">
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
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
