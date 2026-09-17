import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { changePasswordApi } from "../api/authApi"; 
import { useAppDispatch } from "../store/hooks";
import { logoutUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChangePassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ type: "", text: "" });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const submitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.oldPassword || !passwords.newPassword) return;

    setPwdLoading(true);
    setPwdMsg({ type: "", text: "" });

    try {
      await changePasswordApi({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });

      toast.success("Password changed successfully!");

      await dispatch(logoutUser()).unwrap();
      navigate("/login", { replace: true });
    } catch (err: any) {
      setPwdMsg({
        type: "danger",
        text: err.response?.data?.message || "Failed to change password. Please check your current password.",
      });
      setPwdLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "850px" }}>
      <Card className="border-0 shadow-sm rounded-4 h-100">
        <Card.Body className="p-3 p-sm-4 p-lg-5">
          <h5 className="fw-bold text-dark mb-2">Change Password</h5>
          <p className="text-muted small mb-4 pb-3 border-bottom">
            Ensure your account is using a long, random password to stay secure.
          </p>

          {pwdMsg.text && (
            <Alert variant={pwdMsg.type} className="py-2 small fw-medium mb-4">
              {pwdMsg.text}
            </Alert>
          )}

          <Form onSubmit={submitPasswordChange}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary small text-uppercase">Current Password</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                placeholder="Enter current password"
                value={passwords.oldPassword}
                onChange={handlePwdChange}
                required
                className="rounded-3 shadow-none bg-light border-light-subtle"
                style={{ padding: "0.75rem 1rem" }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary small text-uppercase">New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={passwords.newPassword}
                onChange={handlePwdChange}
                required
                className="rounded-3 shadow-none bg-light border-light-subtle"
                style={{ padding: "0.75rem 1rem" }}
              />
            </Form.Group>

            <Button 
              type="submit" 
              variant="primary" 
              className="rounded-3 py-2 px-4 fw-bold border-0"
              style={{ backgroundColor: "#5850EC" }}
              disabled={pwdLoading || !passwords.oldPassword || !passwords.newPassword}
            >
              {pwdLoading ? <Spinner size="sm" animation="border" /> : "Update Password"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChangePassword;