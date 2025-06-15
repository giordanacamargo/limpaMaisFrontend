import React, {useEffect, useRef, useState} from "react";
import PageTitle from "../../../layout/pageTitle/PageTitle";
import {DataTable} from "primereact/datatable";
import {Column} from 'primereact/column';
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import ConfirmDeleteDialog from "../../../layout/customComponents/confirmDialogs/ConfirmDeleteDialog";
import './CadastroCliente.css'
import DatatableHeader from "../../../layout/datatableHeader/DatatableHeader";
import {formatData, formatTelefone} from "../../../../utils/FormatUtils";
import CadastroClienteModal from "./CadastroClienteModal";
import {showToastError, showToastSuccess} from "../../../../utils/InterfaceUtils";
import {FilterMatchMode} from "primereact/api";
import useClienteService from "../../../../services/ClienteService";

function Clientes() {
    const toast = useRef(null);
    const [atualizar, setAtualizar] = useState(Date.now());
    const [clientes, setClientes] = useState([]);
    const [dialogCadastroVisible, setDialogCadastroVisible] = useState(false);
    const [clienteToDelete, setClienteToDelete] = useState(null);
    const [clienteToEdit, setClienteToEdit] = useState({idCliente: ''});
    const [totalRecords, setTotalRecords] = useState(0);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const {findAllClientes, deleteCliente} = useClienteService();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await findAllClientes();
                setClientes(result);
                setTotalRecords(clientes.length);
                initFilters();
            } catch (error) {
                showToastError(toast, "Não foi possível carregar os clientes. Por favor, tente novamente mais tarde.");
            }
        };

        fetchData();
    }, [atualizar]);

    const initFilters = () => {
        setFilters({
            global: {value: null, matchMode: FilterMatchMode.CONTAINS},
            nome: {value: '', matchMode: FilterMatchMode.CONTAINS},
            dataNascimento: {value: null, matchMode: FilterMatchMode.DATE_IS},
            'endereco.cidade': {value: '', matchMode: FilterMatchMode.CONTAINS},
            'enderecoEletronico.email': {value: '', matchMode: FilterMatchMode.CONTAINS},
            'enderecoEletronico.telefone': {value: '', matchMode: FilterMatchMode.CONTAINS},
        });
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = {...filters};

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function handleAdicionarCliente() {
        setDialogCadastroVisible(true);
        cleanClienteToEdit();
    }

    function handleEditCliente(cliente) {
        cleanClienteToEdit();
        setClienteToEdit(cliente);
        setDialogCadastroVisible(true);
    }

    function handleRemoveClienteDialog(cliente) {
        setClienteToDelete(cliente);
    }

    const handleRemoveCliente = async () => {
        try {
            await deleteCliente(clienteToDelete.idCliente);
            setAtualizar(Date.now());
            setClienteToDelete(null);
            showToastSuccess(toast, 'Cliente deletado com sucesso.');
        } catch (error) {
            showToastError(toast, "Não foi possível deletar o cliente. Por favor, tente novamente mais tarde.");
        }
    }

    function handleDialogCadastroClienteOnHide() {
        setDialogCadastroVisible(false)
        setAtualizar(Date.now());
        showToastSuccess(toast, "Cliente salvo com sucesso.");
        cleanClienteToEdit();
    }

    function handleDialogCadastroClienteOnHideCancel() {
        cleanClienteToEdit();
        setDialogCadastroVisible(false)
    }

    function cleanClienteToEdit() {
        setClienteToEdit({idCliente: ''});
    }

    const actionTemplate = (rowData) => {
        return (
            <div className="flex">
                <Button icon="pi pi-pencil" rounded text severity="info" aria-label="Editar" tooltip="Editar"
                        onClick={() => handleEditCliente(rowData)}/>
                <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Remover" tooltip="Remover"
                        onClick={() => handleRemoveClienteDialog(rowData)}/>
            </div>
        );
    }

    const datatableHeader = () => {
        return (
            <DatatableHeader onAddButtonClick={handleAdicionarCliente} globalFilterValue={globalFilterValue}
                             onGlobalFilterChange={onGlobalFilterChange} clearFilter={clearFilter}/>
        );
    };

    return (
        <div className="container">
            <Toast ref={toast}/>
            <PageTitle pageTitle={"Clientes"} icon={"fa fa-users center icon"}/>

            <DataTable value={clientes}
                       stripedRows showGridlines
                       paginator
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                       currentPageReportTemplate="Exibindo {first} a {last} de {totalRecords} registros"
                       totalRecords={totalRecords}
                       rows={10} rowsPerPageOptions={[5, 10, 20]}
                       filters={filters}
                       header={datatableHeader}
                       emptyMessage="Nenhum cliente encontrado.">

                <Column field="nome" header="Nome" sortable={true} sortField="nome"/>
                <Column field="dataNascimento" header="Data de nascimento" sortable={true} sortField="dataNascimento"
                        body={(rowData) => formatData(rowData.dataNascimento)}/>
                <Column field="endereco.cidade" header="Cidade" sortable={true} sortField="endereco.cidade"/>
                <Column field="enderecoEletronico.email" header="E-mail"/>
                <Column field="enderecoEletronico.telefone" header="Telefone"
                        body={(rowData) => formatTelefone(rowData.enderecoEletronico && rowData.enderecoEletronico.telefone ? rowData.enderecoEletronico.telefone : '')}/>
                <Column field="acoes" header="Ações" align="center"
                        headerStyle={{width: "10%", minWidth: "8rem"}}
                        bodyStyle={{textAlign: "center"}} body={actionTemplate}/>
            </DataTable>
            {clienteToDelete &&
                <ConfirmDeleteDialog mensagem={'Deseja mesmo deletar este cliente?'} onConfirm={handleRemoveCliente}
                                     onCancel={() => setClienteToDelete(null)}/>}
            <CadastroClienteModal idCliente={clienteToEdit.idCliente} visible={dialogCadastroVisible}
                                  onHideSucess={handleDialogCadastroClienteOnHide}
                                  onHideCancel={handleDialogCadastroClienteOnHideCancel}/>

        </div>
    );
}

export default Clientes;
