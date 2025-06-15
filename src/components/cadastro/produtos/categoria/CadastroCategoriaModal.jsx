import React, {useEffect, useRef, useState} from "react";
import './CadastroCategoria.css'
import 'react-toastify/dist/ReactToastify.css';
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {Dialog} from "primereact/dialog";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import useCategoriaService from "../../../../services/CategoriaService";
import {showToastError} from "../../../../utils/InterfaceUtils";

function CadastroCategoriaModal({idCategoria, visible, onHideSucess, onHideCancel}) {
    const toast = useRef(null);
    const formRef = useRef(null);
    const {newCategoria, findById} = useCategoriaService();

    const [categoria, setCategoria] = useState({
        idCategoria: '',
        nome: ''
    });

    useEffect(() => {
        cleanCategoriaObject();

        if (idCategoria) {
            const fetchData = async () => {
                try {
                    const result = await findById(idCategoria);
                    setCategoria(result);
                } catch (error) {
                    showToastError(toast, 'Não foi possível carregar a categoria selecionada. Por favor, tente novamente mais tarde.');
                }
            };
            fetchData();
        }
    }, [idCategoria]);

    function handleChange(event) {
        setCategoria({...categoria, [event.target.id]: event.target.value});
    }

    async function handleNewCategoria() {
        try {
            await newCategoria(categoria);
            cleanCategoriaObject();
            onHideSucess();
        } catch (error) {
            showToastError(toast, "Não foi possível salvar a categoria. Por favor, tente novamente mais tarde.");
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const form = formRef.current;
        if (form.checkValidity()) {
            handleNewCategoria();
        } else {
            form.reportValidity();
        }
    }

    function cleanCategoriaObject() {
        setCategoria({
            idCategoria: '',
            nome: ''
        });
    }

    const footerContent = (
        <div>
            <Button className="p-button-text" onClick={onHideCancel} label="Cancelar" icon="pi pi-times"/>
            <Button type="submit" label="Salvar" onClick={handleSubmit} icon="pi pi-check" autoFocus/>
        </div>
    );

    return (
        <Dialog visible={visible} onHide={onHideCancel} header="Cadastro de categoria" footer={footerContent}
                draggable={false}>
            <Toast ref={toast}/>
            <form onSubmit={handleSubmit} ref={formRef}>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-12">
                            <FloatLabel>
                                <InputText required id="nome" value={categoria.nome}
                                           onChange={handleChange} className="widthFull"/>
                                <label htmlFor="nome">Nome</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
            </form>
        </Dialog>
    );
}

export default CadastroCategoriaModal;
