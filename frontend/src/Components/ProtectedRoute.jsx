import React from 'react';
import { Navigate } from 'react-router-dom';
import { isExpired, decodeToken } from "react-jwt";
import useToken from '../auth/useToken';

const ProtectedRoute = ({ children }) => {
  const { token } = useToken();
  const decodedToken = decodeToken(token);

  if (!token || isExpired(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
