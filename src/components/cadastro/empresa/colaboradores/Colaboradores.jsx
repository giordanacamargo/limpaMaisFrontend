import React, {useEffect, useRef, useState} from "react";
import PageTitle from "../../../layout/pageTitle/PageTitle";
import {DataTable} from "primereact/datatable";
import {Column} from 'primereact/column';
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import ConfirmDeleteDialog from "../../../layout/customComponents/confirmDialogs/ConfirmDeleteDialog";
import DatatableHeader from "../../../layout/datatableHeader/DatatableHeader";
import {formatData, formatTelefone} from "../../../../utils/FormatUtils";
import CadastroColaboradorModal from "./CadastroColaboradorModal";
import {showToastError, showToastSuccess} from "../../../../utils/InterfaceUtils";
import {FilterMatchMode} from "primereact/api";
import useColaboradorService from "../../../../services/ColaboradorService";

function Colaboradores() {
    const toast = useRef(null);
    const [colaboradores, setColaboradores] = useState([]);
    const [atualizar, setAtualizar] = useState(Date.now());
    const [dialogCadastroVisible, setDialogCadastroVisible] = useState(false);
    const [colaboradorToDelete, setColaboradorToDelete] = useState(null);
    const [colaboradorToEdit, setColaboradorToEdit] = useState({idColaborador: ''});
    const [totalRecords, setTotalRecords] = useState(0);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const {deleteColaborador, findAllColaboradores} = useColaboradorService();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await findAllColaboradores("nome");
                setColaboradores(result.content);
                initFilters();
            } catch (error) {
                showToastError(toast, 'Não foi possível carregar os colaboradores. Por favor, tente novamente mais tarde.');
            }
        };
        fetchData();
    }, [atualizar]);

    function handleAdicionarColaborador() {
        setDialogCadastroVisible(true);
        cleanColaboradorToEdit();
    }

    function handleEditColaborador(colaborador) {
        cleanColaboradorToEdit();
        setColaboradorToEdit(colaborador);
        setDialogCadastroVisible(true);
    }

    function handleRemoveColaboradorDialog(colaborador) {
        setColaboradorToDelete(colaborador);
    }

    const handleRemoveColaborador = async () => {
        try {
            await deleteColaborador(colaboradorToDelete.idColaborador);
            setAtualizar(Date.now());
            setColaboradorToDelete(null);
            showToastSuccess(toast, 'Colaborador deletado com sucesso.');
        } catch (error) {
            showToastError(toast, "Não foi possível deletar o colaborador. Por favor, tente novamente mais tarde.");
        }
    }

    function handleDialogCadastroColaboradorOnHide() {
        setDialogCadastroVisible(false)
        setAtualizar(Date.now());
        showToastSuccess(toast, "Colaborador salvo com sucesso.");
        cleanColaboradorToEdit();
    }

    function handleDialogCadastroColaboradorOnHideCancel() {
        cleanColaboradorToEdit();
        setDialogCadastroVisible(false)
    }

    function cleanColaboradorToEdit() {
        setColaboradorToEdit({idColaborador: ''});
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = {...filters};

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const clearFilter = () => {
        initFilters();
    };

    const initFilters = () => {
        setFilters({
            global: {value: null, matchMode: FilterMatchMode.CONTAINS},
            dataNascimento: {value: null, matchMode: FilterMatchMode.DATE_IS},
            email: {value: '', matchMode: FilterMatchMode.CONTAINS},
            telefone: {value: '', matchMode: FilterMatchMode.CONTAINS}
        });
        setGlobalFilterValue('');
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="flex">
                <Button icon="pi pi-pencil" rounded text severity="info" aria-label="Editar" tooltip="Editar"
                        onClick={() => handleEditColaborador(rowData)}/>
                <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Remover" tooltip="Remover"
                        onClick={() => handleRemoveColaboradorDialog(rowData)}/>
            </div>
        );
    };

    const datatableHeader = () => {
        return (
            <DatatableHeader onAddButtonClick={handleAdicionarColaborador} globalFilterValue={globalFilterValue}
                             onGlobalFilterChange={onGlobalFilterChange} clearFilter={clearFilter}/>
        );
    };

    return (
        <div className="container">
            <Toast ref={toast}/>
            <PageTitle pageTitle={"Colaboradores"} icon={"fa fa-users center icon"}/>

            <DataTable value={colaboradores}
                       stripedRows showGridlines
                       tableStyle={{minWidth: '5rem'}}
                       paginator
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                       currentPageReportTemplate="Exibindo {first} a {last} de {totalRecords} registros"
                       rows={10} totalRecords={totalRecords}
                       rowsPerPageOptions={[5, 10, 20]}
                       filters={filters}
                       header={datatableHeader}
                       emptyMessage="Nenhum colaborador encontrado.">

                <Column field="nome" header="Nome" sortable sortField="nome"/>
                <Column field="dataNascimento" header="Data de nascimento" sortable={true} sortField="dataNascimento"
                        body={(rowData) => formatData(rowData.dataNascimento)}/>
                <Column field="enderecoEletronico.email" header="E-mail"/>
                <Column field="enderecoEletronico.telefone" header="Telefone"
                        body={(rowData) => formatTelefone(rowData.enderecoEletronico.telefone)}/>
                <Column field="acoes" header="Ações" align="center"
                        headerStyle={{width: "10%", minWidth: "8rem"}}
                        bodyStyle={{textAlign: "center"}} body={actionTemplate}/>
            </DataTable>
            {colaboradorToDelete &&
                <ConfirmDeleteDialog mensagem={'Deseja mesmo deletar este colaborador?'}
                                     onConfirm={handleRemoveColaborador}
                                     onCancel={() => setColaboradorToDelete(null)}/>}
            <CadastroColaboradorModal idColaborador={colaboradorToEdit.idColaborador} visible={dialogCadastroVisible}
                                      onHideSucess={handleDialogCadastroColaboradorOnHide}
                                      onHideCancel={handleDialogCadastroColaboradorOnHideCancel}/>

        </div>
    );
}

export default Colaboradores;
