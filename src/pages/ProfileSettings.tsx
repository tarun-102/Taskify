import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { updateUserApi } from "../api/authApi";
import { updateUserProfile } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const ProfileSettings: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentEmail = user?.email || "aman@example.com";

  const initialName = user?.name || "Aman Gupta";
  const initialLocation = (user as any)?.location || "Ahmedabad, India";

  const [formData, setFormData] = useState({
    name: initialName,
    location: initialLocation,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    setFormData({
      name: user?.name || "Aman Gupta",
      location: (user as any)?.location || "Ahmedabad, India",
    });
  }, [user]);

  const hasChanges = formData.name !== initialName || formData.location !== initialLocation;

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const dataForBackend = {
        name: formData.name,
      };

      await updateUserApi(dataForBackend);

      dispatch(updateUserProfile(formData));

      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setMsg({
        type: "danger",
        text: err.response?.data?.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "850px" }}>
      <div
        className="d-flex d-lg-none align-items-center gap-2 mb-3"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer", width: "fit-content" }}
      >
        <FiArrowLeft size={20} className="text-dark" />
        <span className="fw-bold text-dark">Back to Dashboard</span>
      </div>

      <Card className="border-0 shadow-sm rounded-4 h-100">
        <Card.Body className="p-3 p-sm-4 p-lg-5">
          <h5 className="fw-bold text-dark mb-4">Profile Information</h5>

          <div className="d-flex align-items-center gap-3 mb-4 pb-4 border-bottom">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0"
              style={{ width: "65px", height: "65px", backgroundColor: "#5850EC", fontSize: "24px" }}
            >
              {getInitials(formData.name)}
            </div>

            <div>
              <h6 className="fw-bold text-dark mb-1">{formData.name}</h6>
              <span className="d-block text-muted small mb-1">{currentEmail}</span>
            </div>
          </div>

          {msg.text && (
            <Alert variant={msg.type} className="py-2 small fw-medium mb-4">
              {msg.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-dark">Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="rounded-3 py-2 shadow-none border-light-subtle bg-light"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-dark">Email</Form.Label>
              <Form.Control
                type="email"
                value={currentEmail}
                className="rounded-3 py-2 shadow-none border-light-subtle bg-light"
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold text-dark">Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="rounded-3 py-2 shadow-none border-light-subtle bg-light"
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              disabled={!hasChanges || loading}
              className="rounded-3 py-2 px-4 fw-bold border-0 d-flex align-items-center gap-2"
              style={{ backgroundColor: !hasChanges ? "#a5a2f5" : "#5850EC" }}
            >
              {loading ? <Spinner size="sm" animation="border" /> : "Save Changes"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfileSettings;