import "./App.css";

import { BrowserRouter as Route,  Routes } from 'react-router-dom';

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import NavBar from "./components/NavBar";
import Home from "./layout/home";
import PublicRoute from "./routes/publicRoute";
import PrivateRoute from "./routes/privateRoute";
import Dashboard from "./layout/dashboard";
import { AuthProvider } from "./context/authContext";



const App = () => {

  
  return (
    <>
     <Routes>         
  <NavBar />
    
                  
                        
      <Route path="/" element={<Home/>}/>      
      <Route path="/dashboard" element={<Dashboard/>}/>      
      <Route path="/signIn" element={<SignIn/>}/>
      <Route path="/signUp" element={<SignUp/>}/>                  
                      
                      
    </Routes>  
              
           
      
    
    </>
  );
};

export default App;