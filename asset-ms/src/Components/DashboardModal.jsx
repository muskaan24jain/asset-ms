import React from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";

const DashboardModal = ({ isOpen, toggle, title, children }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <div className="text-end p-3">
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default DashboardModal;
