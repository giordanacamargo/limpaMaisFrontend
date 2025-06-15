import React, {useEffect, useRef, useState} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {Toast} from "primereact/toast";
import PageTitle from "../../../layout/pageTitle/PageTitle";
import {Button} from "primereact/button";
import {InputMask} from "primereact/inputmask";
import CadastroEnderecoModal from "../../endereco/CadastroEnderecoModal";
import {Image} from "primereact/image";
import {FileUpload} from "primereact/fileupload";
import {Card} from "primereact/card";
import {useNavigate} from "react-router-dom";
import {showToastError, showToastSuccess} from "../../../../utils/InterfaceUtils";
import useEmpresaService from "../../../../services/EmpresaService";

function CadastroInformacoesEmpresa() {
    const {findEmpresa, newEmpresa} = useEmpresaService();
    const toast = useRef(null);
    const formRef = useRef(null);
    const [dialogCadastroEnderecoVisible, setDialogCadastroEnderecoVisible] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const [empresa, setEmpresa] = useState({
        idEmpresa: '',
        nome: '',
        nomeFantasia: '',
        cnpj: '',
        enderecoEletronico: {
            idEnderecoEletronico: '',
            email: '',
            telefone: ''
        },
        endereco: {
            idEndereco: '',
            enderecoFormatado: '',
        },
        inscricaoMunicipal: '',
        inscricaoEstadual: '',
        imagemBase64: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await findEmpresa();
                if (result) {
                    setEmpresa(result);
                    if (result.imagemBase64) {
                        const base64URL = `data:image/jpeg;base64,` + result.imagemBase64;
                        setImagePreview(base64URL);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar empresa:", error);
                showToastError(toast, "Não foi possível carregar a empresa. Por favor, tente novamente mais tarde.");
            }
        };
        fetchData();
    }, [findEmpresa]);

    async function handleNewEmpresa() {
        try {
            await newEmpresa(empresa);
            showToastSuccess(toast, "A empresa foi salva com sucesso.");
        } catch (error) {
            console.error("Erro ao salvar empresa:", error);
            showToastError(toast, "Não foi possível salvar a empresa. Por favor, tente novamente mais tarde.");
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const form = formRef.current;
        if (form.checkValidity()) {
            handleNewEmpresa();
        } else form.reportValidity();
    }

    function handleChange(event) {
        const {id, value} = event.target;
        if (id === 'email' || id === 'telefone') {
            setEmpresa({
                ...empresa,
                enderecoEletronico: {
                    ...empresa.enderecoEletronico,
                    [id]: value
                }
            });
        } else {
            setEmpresa({...empresa, [id]: value});
        }
    }

    function handleOpenCadastroEndereco() {
        setDialogCadastroEnderecoVisible(true);
    }

    function handleDialogCadastroEnderecoOnHideCancel() {
        setDialogCadastroEnderecoVisible(false);
    }

    function handleDialogCadastroEnderecoOnHideSuccess(enderecoAtualizado) {
        setDialogCadastroEnderecoVisible(false);
        setEmpresa({
            ...empresa,
            endereco: enderecoAtualizado
        });
    }

    function onUploadNewLogoFile() {
        showToastSuccess(toast, "A nova logo foi definida com sucesso.");
    }

    return (
        <div className="container">
            <PageTitle pageTitle={"Informações da empresa"} icon={"fa fa-address-card center icon"}/>
            <form onSubmit={handleSubmit} ref={formRef}>
                <Toast ref={toast}/>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-6">
                            <FloatLabel>
                                <InputText required id="nome" value={empresa.nome}
                                           className="widthFull" onChange={handleChange}/>
                                <label htmlFor="nome">Nome</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-6">
                            <FloatLabel>
                                <InputText required id="nomeFantasia" value={empresa.nomeFantasia}
                                           className="widthFull" onChange={handleChange}/>
                                <label htmlFor="nomeFantasia">Nome Fantasia</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-6">
                            <FloatLabel>
                                <InputMask required mask="99.999.999/9999-99" id="cnpj" className="widthFull"
                                           value={empresa.cnpj || ''}
                                           onChange={handleChange}/>
                                <label htmlFor="cnpj">CNPJ</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-6">
                            <div className="p-inputgroup flex-1">
                                <FloatLabel>
                                    <InputText id="endereco"
                                               value={empresa.endereco && empresa.endereco.enderecoFormatado ? empresa.endereco.enderecoFormatado : ''}
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
                    <div className="form-group col-md-6 displayContents">
                        <div className="col-md-3">
                            <FloatLabel>
                                <InputMask mask="(99) 99999-9999" id="telefone" className="widthFull"
                                           value={empresa.enderecoEletronico.telefone || ''}
                                           onChange={handleChange}/>
                                <label htmlFor="telefone">Telefone</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-3">
                            <FloatLabel>
                                <InputText id="email" value={empresa.enderecoEletronico.email || ''}
                                           onChange={handleChange}
                                           className="widthFull"/>
                                <label htmlFor="email">E-mail</label>
                            </FloatLabel>
                        </div>
                    </div>

                    <div className="form-group col-md-6 displayContents">
                        <div className="col-md-3">
                            <FloatLabel>
                                <InputText id="inscricaoMunicipal" value={empresa.inscricaoMunicipal || ''}
                                           onChange={handleChange}
                                           className="widthFull"/>
                                <label htmlFor="inscricaoMunicipal">Inscrição Municipal</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-3">
                            <FloatLabel>
                                <InputText id="inscricaoEstadual" value={empresa.inscricaoEstadual || ''}
                                           onChange={handleChange}
                                           className="widthFull"/>
                                <label htmlFor="inscricaoEstadual">Inscrição Estadual</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-4">
                            <Card subTitle="Logo atual:" footer={imagePreview && (
                                <Image id="img-preview" src={imagePreview} preview alt="Imagem da Empresa"
                                       width="250"
                                       className="img-preview"/>
                            )}>
                            </Card>

                        </div>
                        <div className="col-md-8">
                            <FileUpload name="demo" url="http://localhost:8080/api/empresa/upload"
                                        accept="image/*"
                                        chooseLabel="Escolher"
                                        cancelLabel="Cancelar"
                                        uploadLabel="Enviar"
                                        maxFileSize={1000000}
                                        onUpload={onUploadNewLogoFile}
                                        emptyTemplate={<p className="m-0">Arraste arquivos para realizar o
                                            upload da logo.</p>}/>
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-12 textAlignCenter">
                        <Button type="button" className="p-button-text" onClick={() => navigate(-1)} label="Voltar"
                                icon="pi pi-back"/>
                        <Button type="submit" label="Salvar" icon="pi pi-check"/>
                    </div>
                </div>
            </form>

            <CadastroEnderecoModal
                idEndereco={empresa.endereco && empresa.endereco.idEndereco ? empresa.endereco.idEndereco : null}
                visible={dialogCadastroEnderecoVisible}
                onHideSucess={handleDialogCadastroEnderecoOnHideSuccess}
                onHideCancel={handleDialogCadastroEnderecoOnHideCancel}/>
        </div>
    );
}

export default CadastroInformacoesEmpresa;
