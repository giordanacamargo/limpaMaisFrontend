import React, {useEffect, useRef, useState} from "react";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {InputMask} from "primereact/inputmask";
import {Toast} from "primereact/toast";
import {Dialog} from "primereact/dialog";
import CalendarBR from "../../../layout/customComponents/CalendarBR/CalendarBR";
import {showToastError} from "../../../../utils/InterfaceUtils";
import CadastroEnderecoModal from "../../endereco/CadastroEnderecoModal";
import CpfCnpjSwitch from "../../../layout/customComponents/CpfCnpjSwitch/CpfCnpjSwitch";
import {InputSwitch} from "primereact/inputswitch";
import useClienteService from "../../../../services/ClienteService";

function CadastroClienteModal({idCliente, visible, onHideSucess, onHideCancel}) {
    const toast = useRef(null);
    const formRef = useRef(null);
    const [dialogCadastroEnderecoVisible, setDialogCadastroEnderecoVisible] = useState(false);
    const {newCliente, findById} = useClienteService();
    const [cliente, setCliente] = useState({
        idCliente: '',
        nome: '',
        dataNascimento: '',
        cpf: '',
        cnpj: "",
        pessoaJuridica: false,
        vendedor: false,
        numero: '',
        endereco: {
            idEndereco: '',
            enderecoFormatado: ''
        },
        enderecoEletronico: {
            idEnderecoEletronico: '',
            email: '',
            telefone: ''
        }
    });

    useEffect(() => {
        setDialogCadastroEnderecoVisible(false);
        cleanClienteObject();
        if (idCliente) {
            const fetchData = async () => {
                try {
                    const result = await findById(idCliente)
                    setCliente(result);
                } catch (error) {
                    showToastError(toast, "Não foi possível carregar o cliente selecionado. Por favor, tente novamente mais tarde.");
                }
            };
            fetchData();
        }
    }, [idCliente]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = formRef.current;
        if (form.checkValidity()) {
            handleNewCliente();
        } else form.reportValidity();
    };

    async function handleNewCliente() {
        try {
            await newCliente(cliente);
            cleanClienteObject();
            setDialogCadastroEnderecoVisible(false);
            onHideSucess();
        } catch (error) {
            showToastError(toast, "Não foi possível salvar o cliente. Por favor, tente novamente mais tarde.");
        }
    }

    function handleChange(event) {
        const {id, value, name, checked, type} = event.target;
        if (type === 'checkbox' && id === 'vendedor') {
            setCliente({
                ...cliente,
                vendedor: checked
            });
        } else if (id === 'email' || id === 'telefone') {
            setCliente({
                ...cliente,
                enderecoEletronico: {
                    ...cliente.enderecoEletronico,
                    [id]: value
                }
            });
        } else if (name === 'tipoPessoa') {
            setCliente({
                ...cliente,
                pessoaJuridica: value
            });

        } else {
            setCliente({...cliente, [id]: value});
        }
    }

    function cleanClienteObject() {
        setCliente({
            idCliente: '',
            nome: '',
            dataNascimento: '',
            cpf: '',
            cnpj: "",
            pessoaJuridica: false,
            vendedor: false,
            numero: '',
            endereco: {
                idEndereco: '',
                enderecoFormatado: ''
            },
            enderecoEletronico: {
                idEnderecoEletronico: '',
                email: '',
                telefone: ''
            }
        });
    }

    function handleOpenCadastroEndereco() {
        setDialogCadastroEnderecoVisible(true);
    }

    function handleDialogCadastroEnderecoOnHideCancel() {
        setDialogCadastroEnderecoVisible(false);
    }

    function handleDialogCadastroEnderecoOnHideSuccess(enderecoAtualizado) {
        setDialogCadastroEnderecoVisible(false);
        setCliente({
            ...cliente,
            endereco: enderecoAtualizado
        });
    }

    const footerContent = (
        <div>
            <Button className="p-button-text" onClick={onHideCancel} label="Cancelar" icon="pi pi-times"/>
            <Button type="submit" label="Salvar" onClick={handleSubmit} icon="pi pi-check" autoFocus/>
        </div>
    );

    return (
        <Dialog visible={visible} onHide={onHideCancel} header="Cadastro de cliente" footer={footerContent}>
            <Toast ref={toast}/>
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-6 displayContents">
                        <div className="col-md-6">
                            <FloatLabel>
                                <InputText required className="widthFull" id="nome" value={cliente.nome || ''}
                                           onChange={handleChange}/>
                                <label htmlFor="nome">Nome</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div className="form-group col-md-6 displayContents">
                        <div className="col-md-6">
                            <FloatLabel>
                                <CalendarBR id="dataNascimento"
                                            value={cliente.dataNascimento ? new Date(cliente.dataNascimento) : null}
                                            onChange={(value) => setCliente({...cliente, dataNascimento: value})}
                                            className="widthFull"/>
                                <label htmlFor="dataNascimento">Data de Nascimento</label>
                            </FloatLabel>
                        </div>

                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group displayContents widthFull">
                        <div className="col-md-6">
                            <CpfCnpjSwitch
                                id="cpfCnpjSwitch"
                                isPessoaJuridica={cliente.pessoaJuridica}
                                cpf={cliente.cpf}
                                cnpj={cliente.cnpj}
                                onSwitchChange={handleChange}
                                onInputChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group col-md-6 displayContents widthFull">
                        <div className="col-md-6" style={{paddingTop: '10px'}}>
                            <div className="p-inputgroup flex-1">
                                <span id="switch2" style={{marginRight: '10px'}}>Vendedor?</span>
                                <InputSwitch id="vendedor" checked={cliente.vendedor} aria-labelledby="switch2"
                                             onChange={handleChange}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-3">
                            <FloatLabel>
                                <InputMask mask="(99) 99999-9999" id="telefone" className="widthFull"
                                           value={cliente.enderecoEletronico && cliente.enderecoEletronico.telefone ? cliente.enderecoEletronico.telefone : null}
                                           onChange={handleChange}/>
                                <label htmlFor="telefone">Telefone</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-3">
                            <FloatLabel>
                                <InputText id="email"
                                           value={cliente.enderecoEletronico && cliente.enderecoEletronico.email ? cliente.enderecoEletronico.email : ''}
                                           onChange={handleChange}
                                           className="widthFull"/>
                                <label htmlFor="email">E-mail</label>
                            </FloatLabel>
                        </div>

                        <div className="col-md-6">
                            <div className="p-inputgroup flex-1">
                                <FloatLabel>
                                    <InputText required id="endereco"
                                               value={cliente.endereco && cliente.endereco.enderecoFormatado ? cliente.endereco.enderecoFormatado : ''}
                                               className="widthFull" disabled/>
                                    <Button type="button" icon="fa fa-pencil-square-o" className="p-button-plain"
                                            onClick={handleOpenCadastroEndereco} title="Editar endereço"/>
                                    <label htmlFor="endereco">Endereço</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>
                </div>
                < br/>
            </form>

            <CadastroEnderecoModal
                idEndereco={cliente.endereco && cliente.endereco.idEndereco ? cliente.endereco.idEndereco : null}
                visible={dialogCadastroEnderecoVisible}
                onHideCancel={handleDialogCadastroEnderecoOnHideCancel}
                onHideSucess={handleDialogCadastroEnderecoOnHideSuccess}
            />
        </Dialog>
    );
}

export default CadastroClienteModal;
