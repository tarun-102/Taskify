import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuth } from '../features/auth/authSlice';

const ProtectedRoute: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(() => {
    return !!localStorage.getItem("token") && !user;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsChecking(false);
      return;
    }

    if (user) {
      setIsChecking(false);
      return;
    }

    const verifyUserSession = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };

    verifyUserSession();
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