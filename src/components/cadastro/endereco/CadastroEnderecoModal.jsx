import React, {useEffect, useRef, useState} from "react";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {InputMask} from "primereact/inputmask";
import {Toast} from "primereact/toast";
import {Dialog} from "primereact/dialog";
import useEnderecoService from "../../../services/EnderecoService";
import {showToastError, showToastSuccess} from "../../../utils/InterfaceUtils";

function CadastroEnderecoModal({idEndereco, visible, onHideSucess, onHideCancel}) {
    const {findById, newEndereco, findByCep} = useEnderecoService();
    const toast = useRef(null);
    const formRef = useRef(null);
    const [atualizar, setAtualizar] = useState(Date.now());
    const [endereco, setEndereco] = useState({
        idEndereco: '',
        uf: '',
        cidade: '',
        bairro: '',
        rua: '',
        numero: '',
        cep: '',
        complemento: '',
    });

    useEffect(() => {
        cleanEnderecoObject();
        if (idEndereco) {
            const fetchData = async () => {
                try {
                    const result = await findById(idEndereco);
                    setEndereco(result);
                } catch (error) {
                    console.error("Erro ao buscar endereço:", error);
                    showToastError(toast, "Não foi possível carregar o endereço selecionado. Por favor, tente novamente mais tarde.")
                }
            };
            fetchData();
        }
    }, [atualizar, idEndereco]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = formRef.current;
        if (form.checkValidity()) {
            handleNewEndereco();
        } else form.reportValidity();
    };

    async function handleNewEndereco() {
        try {
            const result = await newEndereco(endereco);
            showToastSuccess(toast, "Endereço salvo com sucesso.");
            cleanEnderecoObject();
            onHideSucess(result);
            setAtualizar(Date.now());
        } catch (error) {
            console.error("Erro ao salvar endereço:", error);
            showToastError(toast, "Não foi possível salvar o endereço. Por favor, tente novamente mais tarde.");
        }
    }

    function handleChange(event) {
        setEndereco({...endereco, [event.target.id]: event.target.value});
    }

    async function handleChangeCep(event) {
        const cep = event.target.value.replace(/\D/g, '');
        handleChange(event);
        if (cep.length === 8) {
            try {
                const result = await findByCep(cep);
                setEndereco((prevEndereco) => ({
                    ...prevEndereco,
                    cep: cep,
                    uf: result.uf,
                    cidade: result.localidade,
                    bairro: result.bairro,
                    rua: result.logradouro,
                    complemento: result.complemento || '',
                    numero: ''
                }));
            } catch (error) {
                setEndereco((prevEndereco) => ({
                    ...prevEndereco,
                    cep: cep
                }));
            }
        }
    }

    function cleanEnderecoObject() {
        setEndereco({
            idEndereco: '',
            uf: '',
            cidade: '',
            bairro: '',
            rua: '',
            numero: '',
            cep: '',
            complemento: ''
        });
    }

    const footerContent = (
        <div>
            <Button className="p-button-text" onClick={onHideCancel} label="Cancelar" icon="pi pi-times"/>
            <Button type="submit" label="Salvar" onClick={handleSubmit} icon="pi pi-check" autoFocus/>
        </div>
    );

    return (
        <Dialog visible={visible} onHide={onHideCancel} header="Cadastro de endereço" footer={footerContent}>
            <Toast ref={toast}/>
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-4">
                            <FloatLabel>
                                <InputMask mask="99.999-999" id="cep" className="widthFull"
                                           value={endereco.cep || null}
                                           onChange={handleChangeCep}/>
                                <label htmlFor="cep">CEP</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-2">
                            <FloatLabel>
                                <InputText id="uf" value={endereco.uf || ''} onChange={handleChange}
                                           className="widthFull"/>
                                <label htmlFor="uf">UF</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-6">
                            <FloatLabel>
                                <InputText id="cidade" value={endereco.cidade || ''} onChange={handleChange}
                                           className="widthFull"/>
                                <label htmlFor="cidade">Cidade</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-6">
                            <FloatLabel>
                                <InputText id="bairro" value={endereco.bairro || ''} onChange={handleChange}
                                           className="widthFull"/>
                                <label htmlFor="bairro">Bairro</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-6">
                            <FloatLabel>
                                <InputText id="rua" value={endereco.rua || ''} onChange={handleChange}
                                           className="widthFull"/>
                                <label htmlFor="rua">Rua</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-4">
                            <FloatLabel>
                                <InputText id="numero" value={endereco.numero || ''} onChange={handleChange}
                                           className="widthFull"/>
                                <label htmlFor="numero">Número</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-8">
                            <FloatLabel>
                                <InputText id="complemento" value={endereco.complemento || ''} onChange={handleChange}
                                           className="widthFull"/>
                                <label htmlFor="complemento">Complemento</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
                < br/>
            </form>
        </Dialog>
    );
}

export default CadastroEnderecoModal;
