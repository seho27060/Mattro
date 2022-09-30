import React, { useRef } from "react";

import styles from "./Modal.module.scss";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FunctionComponent<ModalProps> = ({
  children,
  isOpen,
  onClose
}) => {
  const overlayRef = useRef(null);
  const handleOverlayClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };
  if (!isOpen) {
    return null;
  }
  return (
    <div className={`${styles.modal} flex align-center justify-center`}>
      <div
        className={styles.modal__overlay}
        ref={overlayRef}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      <div className={`${styles.modal__box} flex column`}>
        <button
          className={`${styles.modal__btn} fs-50`}
          type="button"
          onClick={onClose}
        >
          &times;
        </button>
        <div className={`${styles.children}`}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
