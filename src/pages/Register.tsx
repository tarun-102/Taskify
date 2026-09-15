import React, { useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { registerSchema } from '../schema/validationSchema';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser, clearAuthError } from '../features/auth/authSlice';

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
     
      const { confirmPassword, ...payloadToSend } = values;
      await dispatch(registerUser(payloadToSend));
    },
  });

  const transparentInputStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(0, 0, 0, 0.15)',
    fontSize: '0.95rem',
    padding: '0.75rem 1rem',
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1" style={{ fontSize: '1.85rem', letterSpacing: '-0.02em' }}>
          Create an Account 
        </h2>
        <p className="text-secondary small">Join Taskify and start organizing your work.</p>
      </div>

      {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="mb-3" controlId="registerUsername">
          <Form.Label className="fw-semibold text-secondary small text-uppercase" style={{ fontSize: '0.75rem' }}>
            Username
          </Form.Label>
          <Form.Control 
            type="text" 
            name="name"
            placeholder="johndoe" 
            size="lg"
            className="rounded-3 text-dark shadow-none"
            style={transparentInputStyle}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.name && !!formik.errors.name}
          />
          <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="registerEmail">
          <Form.Label className="fw-semibold text-secondary small text-uppercase" style={{ fontSize: '0.75rem' }}>
            Email Address
          </Form.Label>
          <Form.Control 
            type="email" 
            name="email"
            placeholder="john@example.com" 
            size="lg"
            className="rounded-3 text-dark shadow-none"
            style={transparentInputStyle}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.email && !!formik.errors.email}
          />
          <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="registerPassword">
          <Form.Label className="fw-semibold text-secondary small text-uppercase" style={{ fontSize: '0.75rem' }}>
            Password
          </Form.Label>
          <Form.Control 
            type="password" 
            name="password"
            placeholder="Create a strong password" 
            size="lg"
            className="rounded-3 text-dark shadow-none"
            style={transparentInputStyle}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.password && !!formik.errors.password}
          />
          <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="registerConfirmPassword">
          <Form.Label className="fw-semibold text-secondary small text-uppercase" style={{ fontSize: '0.75rem' }}>
            Confirm Password
          </Form.Label>
          <Form.Control 
            type="password" 
            name="confirmPassword"
            placeholder="Re-enter your password" 
            size="lg"
            className="rounded-3 text-dark shadow-none"
            style={transparentInputStyle}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">{formik.errors.confirmPassword}</Form.Control.Feedback>
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit" 
          size="lg" 
          disabled={loading}
          className="w-100 fw-bold rounded-3 shadow-sm"
          style={{ padding: '0.75rem', fontSize: '1rem', backgroundColor: '#0d6efd' }}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
        </Button>
      </Form>

      <div className="text-center mt-4">
        <p className="text-secondary small mb-0">
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none fw-bold text-primary">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;