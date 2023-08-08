import "./App.css";

import {   Route,  Routes } from 'react-router-dom';

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import NavBar from "./components/NavBar";
import PrivateRoute from "./routes/privateRoute";
import Home from "./layout/Home";
import Dashboard from "./layout/Dashboard";
import { Fragment } from "react";



const App = () => {

  
  return (
    <Fragment>
              
  <NavBar />
  <Routes>
                  
                        
  <Route path="/" element={<Home/>}/>      
           
      <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      <Route path="/signIn" element={<SignIn/>}/>
      <Route path="/signUp" element={<SignUp/>}/>       

  </Routes>
    
  
              
           
   
              
    
    </Fragment>
  );
};

export default App;