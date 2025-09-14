import React from 'react';
import './App.css';
import {BrowserRouter , Routes, Route} from 'react-router-dom'
import Body from './Components/Body';
import Login from './Components/Login';
import Profile from './Components/Profile';

const App = () => {
  return (<>
    <BrowserRouter >
    <Routes>
    <Route path="/" element={<Body/>}>
     <Route path="/login" element={<Login/>}/>
     <Route path="/profile" element={<Profile/>}/>
     </Route>
    </Routes>
    </BrowserRouter>   
    </>
    
  );
};

export default App;