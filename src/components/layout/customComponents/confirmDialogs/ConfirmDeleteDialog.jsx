import React from 'react';
import {ConfirmDialog} from 'primereact/confirmdialog';

export default function ConfirmDeleteDialog({mensagem, onConfirm, onCancel}) {

    const accept = () => {
        onConfirm();
    };

    let reject = () => {
        onCancel();
    };

    return (
        <>
            <ConfirmDialog
                visible={true}
                onHide={onCancel}
                message={mensagem}
                header="Confirmação"
                icon="pi pi-exclamation-triangle"
                accept={accept}
                reject={reject}
                acceptLabel="Sim"
                rejectClassName="p-button-text"
                rejectLabel="Não"
            />
        </>
    )
}
