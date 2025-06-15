import React, {useEffect, useRef, useState} from "react";
import './CadastroMateriaPrimaModal.css';
import 'react-toastify/dist/ReactToastify.css';
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {Dialog} from "primereact/dialog";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import useMateriaPrimaService from "../../../../services/MateriaPrimaService";
import {showToastError} from "../../../../utils/InterfaceUtils";

function CadastroMateriaPrimaModal({idMateriaPrima, visible, onHideSucess, onHideCancel}) {
    const toast = useRef(null);
    const formRef = useRef(null);
    const {findById, newMateriaPrima} = useMateriaPrimaService();

    const [materiaPrima, setMateriaPrima] = useState({
        idMateriaPrima: '',
        nome: '',
        codigo: ''
    });

    useEffect(() => {
        cleanMateriaPrimaObject();

        if (idMateriaPrima) {
            const fetchData = async () => {
                try {
                    const result = await findById(idMateriaPrima);
                    setMateriaPrima(result);
                } catch (error) {
                    showToastError(toast, "Não foi possível carregar a matéria prima selecionada. Por favor, tente novamente mais tarde.");
                }
            };
            fetchData();
        }
    }, [idMateriaPrima]);

    function handleChange(event) {
        setMateriaPrima({...materiaPrima, [event.target.id]: event.target.value});
    }

    async function handleNewMateriaPrima() {
        try {
            await newMateriaPrima(materiaPrima);
            cleanMateriaPrimaObject();
            onHideSucess();
        } catch (error) {
            showToastError(toast, "Não foi possível salvar a matéria prima. Por favor, tente novamente mais tarde.");
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const form = formRef.current;
        if (form.checkValidity()) {
            handleNewMateriaPrima();
        } else {
            form.reportValidity();
        }
    }

    function cleanMateriaPrimaObject() {
        setMateriaPrima({
            idMateriaPrima: '',
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
        <Dialog visible={visible} onHide={onHideCancel} header="Cadastro de matéria prima" footer={footerContent}
                draggable={false}>
            <Toast ref={toast}/>
            <form onSubmit={handleSubmit} ref={formRef}>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-12">
                            <FloatLabel>
                                <InputText required id="nome" value={materiaPrima.nome}
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
                                <InputText required id="codigo" value={materiaPrima.codigo}
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

export default CadastroMateriaPrimaModal;
