import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalCustom({title, bodyText, textPrimaryButton, textSecondaryButton}) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="modal show" style={{display: 'block', position: 'initial'}}>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{bodyText}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={handleClose} variant="secondary">{textSecondaryButton}</Button>
                    <Button variant="primary">{textPrimaryButton}</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    );
}

export default ModalCustom;
