import React, {useEffect, useRef, useState} from "react";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {InputMask} from "primereact/inputmask";
import {Toast} from "primereact/toast";
import {Dialog} from "primereact/dialog";
import CalendarBR from "../../../layout/customComponents/CalendarBR/CalendarBR";
import {MultiSelect} from "primereact/multiselect";
import CadastroEnderecoModal from "../../endereco/CadastroEnderecoModal";
import {masks, showToastError} from "../../../../utils/InterfaceUtils";
import useCargoService from "../../../../services/CargoService";
import useColaboradorService from "../../../../services/ColaboradorService";

function CadastroColaboradorModal({idColaborador, visible, onHideSucess, onHideCancel}) {
    const toast = useRef(null);
    const formRef = useRef(null);
    const [cargos, setCargos] = useState([]);
    const [dialogCadastroEnderecoVisible, setDialogCadastroEnderecoVisible] = useState(false);
    const {newColaborador, findById} = useColaboradorService();
    const {findAllCargos} = useCargoService();
    const [colaborador, setColaborador] = useState({
        idColaborador: '',
        nome: '',
        dataNascimento: '',
        cpf: '',
        enderecoEletronico: {
            idEnderecoEletronico: '',
            email: '',
            telefone: ''
        },
        endereco: {
            idEndereco: '',
            enderecoFormatado: '',
        },
        cargos: []
    });

    useEffect(() => {
        setDialogCadastroEnderecoVisible(false);
        cleanColaboradorObject();
        if (idColaborador) {
            const fetchData = async () => {
                try {
                    const result = await findById(idColaborador);
                    setColaborador(result);
                } catch (error) {
                    showToastError(toast, "Não foi possível carregar o colaborador selecionado. Por favor, tente novamente mais tarde.");
                }
            };
            fetchData();
        }

        const fetchDataCargos = async () => {
            try {
                const result = await findAllCargos("nome");
                setCargos(result.content);
            } catch (error) {
                showToastError(toast, "Não foi possível carregar os cargos. Por favor, tente novamente mais tarde.");
            }
        };
        fetchDataCargos();
    }, [idColaborador]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = formRef.current;
        if (form.checkValidity()) {
            handleNewColaborador();
        } else form.reportValidity();
    };

    async function handleNewColaborador() {
        try {
            await newColaborador(colaborador);
            cleanColaboradorObject();
            setDialogCadastroEnderecoVisible(false);
            onHideSucess();
        } catch (error) {
            showToastError(toast, "Não foi possível salvar o colaborador. Por favor, tente novamente mais tarde.")
        }
    }

    function handleChange(event) {
        const {id, value} = event.target;
        if (id === 'email' || id === 'telefone') {
            setColaborador({
                ...colaborador,
                enderecoEletronico: {
                    ...colaborador.enderecoEletronico,
                    [id]: value
                }
            });
        } else {
            setColaborador({...colaborador, [id]: value});
        }
    }

    function cleanColaboradorObject() {
        setColaborador({
            idColaborador: '',
            nome: '',
            dataNascimento: '',
            cpf: '',
            enderecoEletronico: {
                idEnderecoEletronico: '',
                email: '',
                telefone: ''
            },
            endereco: {
                idEndereco: '',
                enderecoFormatado: ''
            },
            cargos: []
        });
    }

    function handleCargoSelectionChange(event) {
        const selectedCargo = event.value;
        const updatedCargos = cargos.filter(cargo => selectedCargo.includes(cargo.idCargo));
        setColaborador({...colaborador, cargos: updatedCargos});
    }

    function handleOpenCadastroEndereco() {
        setDialogCadastroEnderecoVisible(true);
    }

    function handleDialogCadastroEnderecoOnHideCancel() {
        setDialogCadastroEnderecoVisible(false);
    }

    function handleDialogCadastroEnderecoOnHideSuccess(enderecoAtualizado) {
        setDialogCadastroEnderecoVisible(false);
        setColaborador({
            ...colaborador,
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
        <Dialog visible={visible} onHide={onHideCancel} header="Cadastro de colaborador" footer={footerContent}>
            <Toast ref={toast}/>
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-6 displayContents">
                        <div className="col-md-6">
                            <FloatLabel>
                                <InputText required className="widthFull" id="nome" value={colaborador.nome || ''}
                                           onChange={handleChange}/>
                                <label htmlFor="nome">Nome</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div className="form-group col-md-6 displayContents">
                        <div className="col-md-3">
                            <FloatLabel>
                                <CalendarBR id="dataNascimento"
                                            value={colaborador.dataNascimento ? new Date(colaborador.dataNascimento) : null}
                                            onChange={(value) => setColaborador({
                                                ...colaborador,
                                                dataNascimento: value
                                            })} className="widthFull"/>
                                <label htmlFor="dataNascimento">Nascimento</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-3">
                            <FloatLabel>
                                <InputMask mask={masks.cpf} id="cpf" className="widthFull"
                                           value={colaborador.cpf || null} onChange={handleChange}/>
                                <label htmlFor="cpf">CPF</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-3">
                            <FloatLabel>
                                <InputMask mask="(99) 99999-9999" id="telefone" className="widthFull"
                                           value={colaborador.enderecoEletronico && colaborador.enderecoEletronico.telefone ? colaborador.enderecoEletronico.telefone : null}
                                           onChange={handleChange}/>
                                <label htmlFor="telefone">Telefone</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-3">
                            <FloatLabel>
                                <InputText id="email"
                                           value={colaborador.enderecoEletronico && colaborador.enderecoEletronico.email ? colaborador.enderecoEletronico.email : ''}
                                           onChange={handleChange} className="widthFull"/>
                                <label htmlFor="email">E-mail</label>
                            </FloatLabel>
                        </div>

                        <div className="col-md-6">
                            <div className="p-inputgroup flex-1">
                                <FloatLabel>
                                    <InputText required id="endereco"
                                               value={colaborador.endereco && colaborador.endereco.enderecoFormatado ? colaborador.endereco.enderecoFormatado : ''}
                                               className="widthFull" disabled/>
                                    <Button type="button" icon="fa fa-pencil-square-o" className="p-button-plain"
                                            onClick={handleOpenCadastroEndereco} title="Editar endereço"/>
                                    <label htmlFor="endereco">Endereço</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-12">
                            <FloatLabel>
                                <MultiSelect id="cargos"
                                             value={colaborador.cargos.map(cargo => cargo.idCargo)}
                                             onChange={handleCargoSelectionChange}
                                             options={cargos.map(cargo => ({
                                                 label: cargo.nome,
                                                 value: cargo.idCargo
                                             }))}
                                             display="chip"
                                             placeholder="Selecione os cargos"
                                             className="widthFull"/>
                                <label htmlFor="cargos">Cargos</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
            </form>
            <CadastroEnderecoModal
                idEndereco={colaborador.endereco && colaborador.endereco.idEndereco ? colaborador.endereco.idEndereco : null}
                visible={dialogCadastroEnderecoVisible}
                onHideCancel={handleDialogCadastroEnderecoOnHideCancel}
                onHideSucess={handleDialogCadastroEnderecoOnHideSuccess}
            />
        </Dialog>
    );
}

export default CadastroColaboradorModal;
