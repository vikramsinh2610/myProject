import React, { ReactNode, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import styles from "./modal.module.css";

export interface IAppProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
  heading: string;
}

export default function Model(props: IAppProps) {

  return (
    <Modal show={props.show} onHide={props.onClose} dialogClassName={styles.modalwidth}>
      <Modal.Header closeButton>
        <Modal.Title>{props.heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </Modal>
  );
}
