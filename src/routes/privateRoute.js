import React from 'react';
import { Navigate, useLocation} from 'react-router-dom';
import { useAuth } from '../context/authContext';

const PrivateRoute = ({ children }) => {
  const { authUser } = useAuth();
  const location = useLocation();

  if (!authUser) {
    return <Navigate to="/" replace state={{from: location}}/>;
  }

  return children;
};

export default PrivateRoute;
