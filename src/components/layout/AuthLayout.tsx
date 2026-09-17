import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useAppSelector } from "../../store/hooks";

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container fluid className="min-vh-100 p-0 bg-white position-relative">
      <Row className="min-vh-100 g-0 m-0">
        {/* Large Desktop */}
        <Col
          lg={6}
          className="d-none d-lg-flex flex-column align-items-center justify-content-center p-5 text-center bg-white"
        >
          <div
            className="d-flex flex-column align-items-center justify-content-center w-100"
            style={{ maxWidth: "650px" }}
          >
            <img
              src="/logo.png"
              alt="Taskify"
              className="img-fluid mb-4"
              style={{
                maxWidth: "650px",
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </div>
        </Col>

        {/* Tablet & Mobile */}
        <Col
          xs={12}
          lg={6}
          className="position-relative d-flex flex-column align-items-center justify-content-center p-4 p-md-5 bg-white min-vh-100"
        >
          <div
            className="d-block d-lg-none position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundImage: 'url("/logo.png")',
              backgroundSize: "min(70vw, 420px)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.14,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Form Content Wrapper */}
          <div
            className="w-100 position-relative py-3"
            style={{ maxWidth: "440px", zIndex: 1 }}
          >
            {/* Outlet for Form */}
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthLayout;
