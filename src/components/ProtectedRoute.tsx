import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuth } from '../features/auth/authSlice';

const ProtectedRoute: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      try {
    
        await dispatch(checkAuth()).unwrap();
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
     
        setIsChecking(false);
      }
    };

 
    if (!user) {
      verifyUserSession();
    } else {
      setIsChecking(false);
    }
  }, [dispatch, user]);


  if (isChecking) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }


  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;