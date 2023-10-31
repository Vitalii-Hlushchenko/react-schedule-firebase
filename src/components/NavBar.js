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
             {/* <NavLink to="/">Home</NavLink> */}
          </li>
          <li>
             <NavLink to="/dashboard">Головна</NavLink>
          </li>
          <li>
             <NavLink to="/signIn">Увійти</NavLink>
          </li>
          <li>
             <NavLink to="/signUp">Зареєструватись</NavLink>
          </li>
          <li>
          <Button className="SignOutBtn" variant="outlined" color="error" onClick={handleSignOut} size="small">Вийти</Button>

          </li>
       </ul>
 </nav>
 );
};

export default NavBar;