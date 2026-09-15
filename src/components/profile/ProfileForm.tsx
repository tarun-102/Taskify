import React from "react";
import { Form, Button } from "react-bootstrap";

export interface UserProfileData {
  fullName: string;
  email: string;
  bio: string;
  location: string;
}

interface ProfileFormProps {
  initialData: UserProfileData;
  onSubmit?: (e: React.FormEvent) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onSubmit }) => {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3">
        <Form.Label className="small fw-semibold text-dark">
          Full Name
        </Form.Label>
        <Form.Control
          type="text"
          defaultValue={initialData.fullName}
          className="rounded-3 py-2 shadow-none border-light-subtle"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="small fw-semibold text-dark">Email</Form.Label>
        <Form.Control
          type="email"
          defaultValue={initialData.email}
          className="rounded-3 py-2 shadow-none border-light-subtle"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="small fw-semibold text-dark">Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          defaultValue={initialData.bio}
          className="rounded-3 py-2 shadow-none border-light-subtle"
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="small fw-semibold text-dark">
          Location
        </Form.Label>
        <Form.Control
          type="text"
          defaultValue={initialData.location}
          className="rounded-3 py-2 shadow-none border-light-subtle"
        />
      </Form.Group>

      <Button
        type="submit"
        variant="primary"
        className="w-100 rounded-3 py-2 fw-semibold border-0"
        style={{ backgroundColor: "#5850EC" }}
      >
        Save Changes
      </Button>
    </Form>
  );
};

export default ProfileForm;
