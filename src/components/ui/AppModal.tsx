import React from "react";
import { Modal } from "react-bootstrap";

interface AppModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "lg" | "xl";
  titleClass?: string;
}

const AppModal: React.FC<AppModalProps> = ({ 
  show, 
  onHide, 
  title, 
  children, 
  size,
  titleClass = "text-dark" 
}) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size={size}>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className={`fw-bold fs-5 ${titleClass}`}>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>
  );
};

export default AppModal;