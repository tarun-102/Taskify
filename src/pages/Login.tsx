import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { loginSchema } from "../schema/validationSchema";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser, clearAuthError } from "../features/auth/authSlice";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isAuthenticated || token) {
      navigate("/dashboard", { replace: true });
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      await dispatch(loginUser(values));
    },
  });

  const transparentInputStyle: React.CSSProperties = {
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(0, 0, 0, 0.15)",
    fontSize: "0.95rem",
    padding: "0.75rem 1rem",
  };

  return (
    <div>
      <div className="mb-4">
        <h2
          className="fw-bold text-dark mb-1"
          style={{ fontSize: "1.85rem", letterSpacing: "-0.02em" }}
        >
          Welcome Back!
        </h2>
        <p className="text-secondary small">
          Please enter your credentials to sign in.
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="py-2 small">
          {error}
        </Alert>
      )}

      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label
            className="fw-semibold text-secondary small text-uppercase"
            style={{ fontSize: "0.75rem" }}
          >
            Email Address
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email"
            size="lg"
            className="rounded-3 text-dark shadow-none"
            style={transparentInputStyle}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.email && !!formik.errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2" controlId="loginPassword">
          <Form.Label
            className="fw-semibold text-secondary small text-uppercase"
            style={{ fontSize: "0.75rem" }}
          >
            Password
          </Form.Label>
          <div className="position-relative">
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              size="lg"
              className="rounded-3 text-dark shadow-none"
              style={{ ...transparentInputStyle, paddingRight: "45px" }}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.password && !!formik.errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent text-secondary p-0 d-flex align-items-center justify-content-center"
              style={{ width: "45px", height: "100%", zIndex: 5 }}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-danger small mt-1">{formik.errors.password}</div>
          )}
        </Form.Group>

        <div className="d-flex justify-content-end mb-4">
          <a
            href="#"
            className="text-decoration-none fw-semibold small text-primary"
          >
            Forgot password?
          </a>
        </div>

        <Button
          variant="primary"
          type="submit"
          size="lg"
          disabled={loading}
          className="w-100 fw-bold rounded-3 shadow-sm"
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            backgroundColor: "#0d6efd",
          }}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Sign In"}
        </Button>
      </Form>

      <div className="text-center mt-4">
        <p className="text-secondary small mb-0">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-decoration-none fw-bold text-primary"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;