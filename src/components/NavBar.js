import { NavLink } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';


const NavBar = () => {
 return (
 <nav className='nav'>
       <ul className='nav-items'>
          <li>
             <NavLink to="/">Home</NavLink>
          </li>
          <li>
             <NavLink to="/signIn">SignIn</NavLink>
          </li>
          <li>
             <NavLink to="/signUp">SignUp</NavLink>
          </li>
       </ul>
 </nav>
 );
};

export default NavBar;