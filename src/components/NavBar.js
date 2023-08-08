import React from 'react';
import { NavLink } from 'react-router-dom';
// import { useAuth } from '../context/authContext';
import Button from '@mui/material/Button';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';



const NavBar = () => {

   // const { authUser , signOut } = useAuth();

   const handleSignOut = () => {
      signOut(auth)
        .then(() => {
         console.log("SignOut done")
        })
        .catch((error) => {
          console.log(error);
        });
      };
 return (
 <nav className='nav'>
       <ul className='nav-items'>
          <li>
             <NavLink to="/">Home</NavLink>
          </li>
          <li>
             <NavLink to="/dashboard">dashboard</NavLink>
          </li>
          <li>
             <NavLink to="/signIn">SignIn</NavLink>
          </li>
          <li>
             <NavLink to="/signUp">SignUp</NavLink>
          </li>
          <li>
          <Button className="SignOutBtn" variant="outlined" color="error" onClick={handleSignOut} size="small">SignOut</Button>

          </li>
       </ul>
 </nav>
 );
};

export default NavBar;