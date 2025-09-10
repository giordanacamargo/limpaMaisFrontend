import React, {useEffect, useRef, useState} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {Dialog} from "primereact/dialog";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import useEpiService from "../../../../services/EpiService";
import {showToastError} from "../../../../utils/InterfaceUtils";

function CadastroEpiModal({idEpi, visible, onHideSucess, onHideCancel}) {
    const toast = useRef(null);
    const formRef = useRef(null);
    const {findById, newEpi} = useEpiService();

    const [epi, setEpi] = useState({
        idEpi: '',
        nome: '',
        codigo: ''
    });

    useEffect(() => {
        cleanEpiObject();

        if (idEpi) {
            const fetchData = async () => {
                try {
                    const result = await findById(idEpi);
                    setEpi(result);
                } catch (error) {
                    showToastError(toast, "Não foi possível carregar o epi selecionada. Por favor, tente novamente mais tarde.");
                }
            };
            fetchData();
        }
    }, [idEpi]);

    function handleChange(event) {
        setEpi({...epi, [event.target.id]: event.target.value});
    }

    async function handleNewEpi() {
        try {
            await newEpi(epi);
            cleanEpiObject();
            onHideSucess();
        } catch (error) {
            showToastError(toast, "Não foi possível salvar o epi. Por favor, tente novamente mais tarde.");
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const form = formRef.current;
        if (form.checkValidity()) {
            handleNewEpi();
        } else {
            form.reportValidity();
        }
    }

    function cleanEpiObject() {
        setEpi({
            idEpi: '',
            nome: '',
            codigo: ''
        });
    }

    const footerContent = (
        <div>
            <Button className="p-button-text" onClick={onHideCancel} label="Cancelar" icon="pi pi-times"/>
            <Button type="submit" label="Salvar" onClick={handleSubmit} icon="pi pi-check" autoFocus/>
        </div>
    );

    return (
        <Dialog visible={visible} onHide={onHideCancel} header="Cadastro de epi" footer={footerContent}
                draggable={false}>
            <Toast ref={toast}/>
            <form onSubmit={handleSubmit} ref={formRef}>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-12">
                            <FloatLabel>
                                <InputText required id="nome" value={epi.nome}
                                           onChange={handleChange} className="widthFull"/>
                                <label htmlFor="nome">Nome</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-12">
                            <FloatLabel>
                                <InputText required id="codigo" value={epi.codigo}
                                           onChange={handleChange} className="widthFull"/>
                                <label htmlFor="codigo">Código</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
            </form>

        </Dialog>
    );
}

export default CadastroEpiModal;
