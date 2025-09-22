import React from 'react'
import Editprofile from './Editprofile'
import { useSelector } from 'react-redux'

const Profile = () => {
  const user = useSelector((store) => store.user);
  return user &&(
    <>
    <Editprofile user={user}/>
      
    </>
  )
}

export default Profile
