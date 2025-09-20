import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { Base_Url } from '../utils/Constants'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice';
import axios from 'axios'

const Body = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const fetchUser = async () => {
    try{
       const res = await axios.get(Base_Url+'/profile', {
      withCredentials: true
    });
    dispatch(addUser(res.data));
    }catch(error){
      if(error.response.status === 401){
        Navigate('/login');
      }
      
      console.log(error);
    }  
  }

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
<div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
      
    </>
  )
}

export default Body
