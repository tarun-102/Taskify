import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Container, Row, Col, Offcanvas } from "react-bootstrap";
import Sidebar from "../dashboard/Sidebar";
import SettingsSidebar from "../profile/SettingsSidebar";
import TopNavbar from "../dashboard/TopNavbar";

const MainLayout: React.FC = () => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const location = useLocation();

  const isSettingsPage = location.pathname.includes("/settings");

  return (
    <div className="bg-light min-vh-100">
      {/* Mobile Drawer */}
      <Offcanvas
        show={showMobileSidebar}
        onHide={() => setShowMobileSidebar(false)}
        className="d-lg-none"
        style={{ width: "260px" }}
      >
        <Offcanvas.Body className="p-0">
          {isSettingsPage ? (
            <SettingsSidebar onClose={() => setShowMobileSidebar(false)} />
          ) : (
            <Sidebar onClose={() => setShowMobileSidebar(false)} />
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <Container fluid className="p-0">
        <Row className="g-0 flex-nowrap">
          {/* Desktop Fixed Sidebar */}
          <Col
            lg="auto"
            className="d-none d-lg-block bg-white border-end"
            style={{ width: "260px" }}
          >
            <div className="position-sticky top-0 vh-100">
              {isSettingsPage ? <SettingsSidebar /> : <Sidebar />}
            </div>
          </Col>

          {/* Main Content Area */}
          <Col className="d-flex flex-column min-vh-100">
            {/* Top Navbar */}
            <div
              className="position-sticky top-0 w-100 shadow-sm"
              style={{ zIndex: 1020 }}
            >
              <TopNavbar onToggleSidebar={() => setShowMobileSidebar(true)} />
            </div>

            {/* Content Outlet */}
            <main className="p-3 p-lg-4 flex-grow-1">
              <Container fluid className="p-0" style={{ maxWidth: "1400px" }}>
                <Outlet />
              </Container>
            </main>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default MainLayout;