import { useState } from "react";

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const Modal = ({ children }) => {
    if (!isOpen) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          bottom: 20,
          right: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.7",
          overflow: "scroll",
        }}
      >
        <div>{children}</div>
      </div>
    );
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return { Modal, openModal, closeModal };
};

export default useModal;
