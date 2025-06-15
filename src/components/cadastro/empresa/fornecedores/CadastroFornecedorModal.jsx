import React, {useEffect, useRef, useState} from "react";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {InputMask} from "primereact/inputmask";
import {Toast} from "primereact/toast";
import {Dialog} from "primereact/dialog";
import useFornecedorService from "../../../../services/FornecedorService";
import CadastroEnderecoModal from "../../endereco/CadastroEnderecoModal";
import {masks, showToastError} from "../../../../utils/InterfaceUtils";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import CpfCnpjSwitch from "../../../layout/customComponents/CpfCnpjSwitch/CpfCnpjSwitch";
import useMateriaPrimaService from "../../../../services/MateriaPrimaService";

function CadastroFornecedorModal({idFornecedor, visible, onHideSucess, onHideCancel}) {
    const toast = useRef(null);
    const {findDTOById, newFornecedor} = useFornecedorService();
    const {findAllMateriasPrimas} = useMateriaPrimaService();
    const formRef = useRef(null);
    const [materiasPrimas, setMateriasPrimas] = useState([]);
    const [dialogCadastroEnderecoVisible, setDialogCadastroEnderecoVisible] = useState(false);
    const [fornecedorDTO, setFornecedorDTO] = useState({
        idFornecedor: "",
        nome: "",
        cpf: "",
        cnpj: "",
        pessoaJuridica: false,
        idEndereco: null,
        enderecoFormatado: "",
        idEnderecoEletronico: "",
        email: "",
        telefone: "",
        idMateriaPrimaList: []
    });

    useEffect(() => {
        setDialogCadastroEnderecoVisible(false);
        cleanFornecedorObject();
        if (idFornecedor) {
            const fetchData = async () => {
                try {
                    const result = await findDTOById(idFornecedor);
                    setFornecedorDTO(result);
                } catch (error) {
                    showToastError(toast, "Não foi possível carregar o fornecedor selecionado. Por favor, tente novamente mais tarde.");
                }
            };
            fetchData();
        }

        const fetchDataMateriasPrimas = async () => {
            try {
                const result = await findAllMateriasPrimas("nome");
                setMateriasPrimas(result.content);
            } catch (error) {
                showToastError(toast, "Não foi possível carregar as matérias primas. Por favor, tente novamente mais tarde.");
            }
        };
        fetchDataMateriasPrimas();
    }, [idFornecedor]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = formRef.current;
        if (form.checkValidity()) {
            handleNewFornecedor();
        } else form.reportValidity();
    };

    async function handleNewFornecedor() {
        try {
            await newFornecedor(fornecedorDTO);
            cleanFornecedorObject();
            setDialogCadastroEnderecoVisible(false);
            onHideSucess();
        } catch (error) {
            showToastError(toast, "Não foi possível salvar o fornecedor. Por favor, tente novamente mais tarde.")
        }
    }

    function handleChange(event) {
        const {name, value} = event.target;
        if (name === 'tipoPessoa') {
            setFornecedorDTO({
                ...fornecedorDTO,
                pessoaJuridica: value
            });
        } else {
            setFornecedorDTO({
                ...fornecedorDTO,
                [name]: value
            });
        }
    }

    function cleanFornecedorObject() {
        setFornecedorDTO({
            idFornecedor: "",
            nome: "",
            cpf: "",
            cnpj: "",
            pessoaJuridica: false,
            idEndereco: null,
            enderecoFormatado: "",
            idEnderecoEletronico: "",
            email: "",
            telefone: null,
            idMateriaPrimaList: []
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
        setFornecedorDTO({
            ...fornecedorDTO,
            idEndereco: enderecoAtualizado.idEndereco,
            enderecoFormatado: enderecoAtualizado.enderecoFormatado
        });
    }

    const footerContent = (
        <div>
            <Button className="p-button-text" onClick={onHideCancel} label="Cancelar" icon="pi pi-times"/>
            <Button type="submit" label="Salvar" onClick={handleSubmit} icon="pi pi-check" autoFocus/>
        </div>
    );

    return (
        <Dialog visible={visible} onHide={onHideCancel} header="Cadastro de fornecedor" footer={footerContent}>
            <Toast ref={toast}/>
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-6 displayContents">
                        <div className="col-md-6">
                            <FloatLabel>
                                <InputText required className="widthFull"
                                           name="nome"
                                           id="nome"
                                           value={fornecedorDTO.nome || ''}
                                           onChange={handleChange}/>
                                <label htmlFor="nome">Nome</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div className="form-group col-md-6 displayContents">
                        <div className="col-md-3">
                            <FloatLabel>
                                <InputMask mask={masks.telefone}
                                           name="telefone"
                                           id="telefone" className="widthFull"
                                           value={fornecedorDTO.telefone || null}
                                           onChange={handleChange}/>
                                <label htmlFor="telefone">Telefone</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-3">
                            <FloatLabel>
                                <InputText id="email"
                                           name="email"
                                           value={fornecedorDTO.email || ''}
                                           onChange={handleChange} className="widthFull"/>
                                <label htmlFor="email">E-mail</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group displayContents widthFull">
                        <div className="col-md-6">
                            <CpfCnpjSwitch
                                id="cpfCnpjSwitch"
                                isPessoaJuridica={fornecedorDTO.pessoaJuridica}
                                cpf={fornecedorDTO.cpf}
                                cnpj={fornecedorDTO.cnpj}
                                onSwitchChange={handleChange}
                                onInputChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group col-md-6 displayContents widthFull">
                        <div className="col-md-6">
                            <div className="p-inputgroup flex-1">
                                <FloatLabel>
                                    <InputText required id="endereco"
                                               value={fornecedorDTO.enderecoFormatado ? fornecedorDTO.enderecoFormatado : ''}
                                               className="widthFull" disabled/>
                                    <Button type="button" icon="fa fa-pencil-square-o" className="p-button-plain"
                                            onClick={handleOpenCadastroEndereco}
                                            title="Editar endereço"/>
                                    <label htmlFor="endereco">Endereço</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-12">
                            <DataTable
                                value={materiasPrimas}
                                dataKey="idMateriaPrima"
                                header={<p>Quais matérias primas ele fornece?</p>}
                                selection={materiasPrimas.filter(materiaPrima => fornecedorDTO.idMateriaPrimaList.includes(materiaPrima.idMateriaPrima))}
                                onSelectionChange={(e) =>
                                    setFornecedorDTO({
                                        ...fornecedorDTO,
                                        idMateriaPrimaList: e.value.map(materiaPrima => materiaPrima.idMateriaPrima)
                                    })
                                }
                            >
                                <Column selectionMode="multiple" style={{width: "2em"}}/>
                                <Column field="nome" header="Matéria Prima"/>
                                <Column field="codigo" header="Código"/>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </form>
            <CadastroEnderecoModal
                idEndereco={fornecedorDTO.idEndereco ? fornecedorDTO.idEndereco : null}
                visible={dialogCadastroEnderecoVisible}
                onHideCancel={handleDialogCadastroEnderecoOnHideCancel}
                onHideSucess={handleDialogCadastroEnderecoOnHideSuccess}
            />
        </Dialog>
    );
}

export default CadastroFornecedorModal;

