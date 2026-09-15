import React from "react";
import { Image } from "react-bootstrap";

interface ProfileHeaderProps {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  role,
  avatar,
}) => {
  return (
    <div className="d-flex align-items-center gap-3 mb-4 pb-4 border-bottom">
      <Image
        src={avatar}
        roundedCircle
        className="object-fit-cover shadow-sm"
        style={{ width: "65px", height: "65px" }}
        alt="Profile Avatar"
      />
      <div>
        <h6 className="fw-bold text-dark mb-1">{name}</h6>
        <span className="d-block text-muted small mb-1">{email}</span>
        <span
          className="d-block text-secondary small"
          style={{ fontSize: "11.5px" }}
        >
          {role}
        </span>
      </div>
    </div>
  );
};

export default ProfileHeader;
