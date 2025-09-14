import React from 'react';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className=" top-0 w-screen z-10 ">
      <div className="navbar shadow-sm  bg-base-200 md:min-h-[60px] sm:min-h-[50px] xs:min-h-[45px]">
        <div className="flex-1 justify-between px-4">
          <a className="btn btn-ghost text-2xl md:text-xl sm:text-lg">
            <img src={logo} className="w-10 h-10 md:w-8 md:h-8 sm:w-6 sm:h-6" alt="DevShips Logo" />
            DevShips
          </a>
        </div>
        <div className="flex gap-2 items-center px-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full md:w-8 sm:w-6">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;