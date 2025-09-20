import React, { useState } from 'react';
import logo from '../assets/logo.png'; 
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Base_Url } from '../utils/Constants'; 
import { removeUser } from '../utils/userSlice';

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setError(null);
    try {
      const logoutUrl = `${Base_Url}/logout`;    
      const response = await axios.post(logoutUrl, {}, { withCredentials: true });
      console.log('Logout response:', {
        status: response.status,
        data: response.data,
      });
      dispatch(removeUser());      
      navigate('/login', { replace: true });
      console.log('Navigated to /login');
    } catch (error) {
      console.error('Logout error details:');
      if (error.response?.status === 404) {
        setError('Logout failed: User not found.');
      } else {
        setError(`Logout failed: ${error.message}.`);
      }
    } finally {
      setIsLoggingOut(false);
      console.log('Logout attempt completed');
    }
  };

  console.log('Current user:', user);

  return (
    <nav className="top-0 w-screen z-10 fixed">
      <div className="navbar shadow-sm bg-base-200 h-auto md:min-h-[60px] sm:min-h-[50px] xs:min-h-[45px]">
        <div className="flex-1 justify-between px-4">
          <Link to="/" className="btn btn-ghost text-2xl md:text-xl sm:text-lg">
            <img
              src={logo}
              className="w-10 h-10 md:w-8 md:h-8 sm:w-6 sm:h-6"
              alt="DevShips Logo"
            />
            DevShips
          </Link>
        </div>
        <div className="flex gap-2 items-center px-4">
          {user && (
            <div className="dropdown dropdown-end mx-5 flex">
              <p className="px-4">Welcome {user.name}</p>
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ">
                <div className="w-10 rounded-full md:w-8 sm:w-8">
                  <img
                    alt="User Photo"
                    src={user.photo_url || 'https://via.placeholder.com/40'}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                  <li>
                  <Link to="/connections" className="justify-between">
                    Connections
                  </Link>
                </li>
                  <li>
                  <Link to="/Requests" className="justify-between">
                    Requests
                  </Link>
                </li>
                <li>
                  <a
                    onClick={handleLogout}
                    className={isLoggingOut ? 'pointer-events-none opacity-50' : ''}
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="alert alert-error mt-2 mx-4">
          <span>{error}</span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;