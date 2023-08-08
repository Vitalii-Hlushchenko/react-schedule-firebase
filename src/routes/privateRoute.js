import React from 'react';
import { Route, Link} from 'react-router-dom';
import { useAuth } from '../context/authContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { authUser } = useAuth();

  return (
    <Route
    {...rest}
    render={props => {
      return authUser ? <Component {...props} /> : <Link to="/signIn" />
    }}
  ></Route>
  );
};

export default PrivateRoute;
