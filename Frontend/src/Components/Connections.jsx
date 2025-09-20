import axios from 'axios'
import React from 'react'
import { Base_Url } from '../utils/Constants'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/ConnectionsSlice'

const Connections = () => {
    const connections = useSelector(store => store.connections);
    const dispatch = useDispatch();

    const fetchConnections = async() =>{
        try{

        const res = await axios.get(Base_Url+'/user/connections',{
            withCredentials:true,
        });
        console.log(res.data.data);
        dispatch(addConnections(res.data.data));
        }catch(error){
         //handle error cases
        }
    }

    useEffect(() => {
        fetchConnections();
    }, [])

    if(!connections)return;

    if(connections.length === 0){
        return (
            <div className='flex justify-center my-20'>
              <h1 className='text-bold text-2xl'>No connections found</h1>
            </div>
          )
    }
  return (
    <div className='flex text-center justify-center my-20'>
      <h1 className='text-bold text-white text-5xl'>Connections</h1>
      {connections.map((connection) =>{
        const { name,photo_url,age,gender,about} = connection;
        return(
            <div className='flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto'>
            <div>
            <img alt='photo'
            className='w-20 h-20 rounded-full'
            src={photo_url}/>
            </div>
             <div className='text-left mx-4'>
             <h2 className='font-bold text-xl'>
             {name}</h2>
             {age && gender && <p>{age + ", " + gender}</p>}
             <p>{about}</p>

             </div>
            </div>
            
        )
      })
      }
    </div>

  )
}

export default Connections
