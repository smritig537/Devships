import React from 'react';
import './App.css';
import {BrowserRouter , Routes, Route} from 'react-router-dom'
import Body from './Components/Body';
import Login from './Components/Login';
import Profile from './Components/Profile';
import { Provider } from 'react-redux';  
import appStore from './utils/appStore';  
import Feed from './Components/Feed';

const App = () => {
  return (<>
    <Provider store={appStore}> {/* Provider is used to provide the store to all the components */}
    <BrowserRouter >
    <Routes>
    <Route path="/" element={<Body/>}>
     <Route path="/" element={<Feed/>}/>
     <Route path="/login" element={<Login/>}/>
     <Route path="/profile" element={<Profile/>}/>
     </Route>
    </Routes>
    </BrowserRouter> 
    </Provider>  
    </>
    
  );
};

export default App;