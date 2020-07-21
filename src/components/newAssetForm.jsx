import React, { Component } from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import VFTextEditor from './common/vfTextEditor';

const NewAssetForm  = ({ content, show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>New Asset</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {content}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default NewAssetForm;