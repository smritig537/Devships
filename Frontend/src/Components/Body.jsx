import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { Base_Url } from '../utils/Constants'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice';
import axios from 'axios'

const Body = () => {
  const dispatch = useDispatch();
  const fetchUser = async () => {
    try{
       const res = await axios.get(Base_Url+'/profile', {
      withCredentials: true
    });
    dispatch(addUser(res.data));
    }catch(error){
      Navigate('/login');
      console.log(error);
    }  
  }

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
      
    </>
  )
}

export default Body
