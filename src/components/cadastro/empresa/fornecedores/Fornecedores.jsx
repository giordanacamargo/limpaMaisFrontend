import React, {useEffect, useRef, useState} from "react";
import PageTitle from "../../../layout/pageTitle/PageTitle";
import {DataTable} from "primereact/datatable";
import {Column} from 'primereact/column';
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import ConfirmDeleteDialog from "../../../layout/customComponents/confirmDialogs/ConfirmDeleteDialog";
import DatatableHeader from "../../../layout/datatableHeader/DatatableHeader";
import {formatTelefone} from "../../../../utils/FormatUtils";
import {showToastError, showToastSuccess} from "../../../../utils/InterfaceUtils";
import CadastroFornecedorModal from "./CadastroFornecedorModal";
import {FilterMatchMode} from "primereact/api";
import useFornecedorService from "../../../../services/FornecedorService";

function Fornecedores() {
    const toast = useRef(null);
    const {findAllDTO, deleteFornecedor} = useFornecedorService();
    const [atualizar, setAtualizar] = useState(Date.now());
    const [fornecedores, setFornecedores] = useState([]);
    const [dialogCadastroVisible, setDialogCadastroVisible] = useState(false);
    const [fornecedorToDelete, setFornecedorToDelete] = useState(null);
    const [fornecedorToEdit, setFornecedorToEdit] = useState({idFornecedor: ''});
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await findAllDTO();
                setFornecedores(result);
                setTotalRecords(fornecedores.length);
                initFilters();
            } catch (error) {
                showToastError(toast, 'Não foi possível carregar os fornecedores. Por favor, tente novamente mais tarde.');
            }
        };
        fetchData();
    }, [atualizar]);

    function handleAdicionarFornecedor() {
        setDialogCadastroVisible(true);
        cleanFornecedorToEdit();
    }

    function handleEditFornecedor(fornecedor) {
        cleanFornecedorToEdit();
        setFornecedorToEdit(fornecedor);
        setDialogCadastroVisible(true);
    }

    function handleRemoveFornecedorDialog(fornecedor) {
        setFornecedorToDelete(fornecedor);
    }

    const handleRemoveFornecedor = async () => {
        try {
            await deleteFornecedor(fornecedorToDelete.idFornecedor);
            setAtualizar(Date.now());
            setFornecedorToDelete(null);
            showToastSuccess(toast, 'Fornecedor deletado com sucesso.');
        } catch (error) {
            showToastError(toast, 'Não foi possível deletar o fornecedor. Por favor, tente novamente mais tarde.');
        }
    }

    function handleDialogCadastroFornecedorOnHide() {
        setDialogCadastroVisible(false)
        setAtualizar(Date.now());
        showToastSuccess(toast, "Fornecedor salvo com sucesso.");
        cleanFornecedorToEdit();
    }

    function handleDialogCadastroFornecedorOnHideCancel() {
        cleanFornecedorToEdit();
        setDialogCadastroVisible(false)
    }

    function cleanFornecedorToEdit() {
        setFornecedorToEdit({idFornecedor: ''});
    }

    const initFilters = () => {
        setFilters({
            global: {value: null, matchMode: FilterMatchMode.CONTAINS},
            nome: {value: '', matchMode: FilterMatchMode.CONTAINS},
            email: {value: '', matchMode: FilterMatchMode.CONTAINS},
            telefone: {value: '', matchMode: FilterMatchMode.CONTAINS}
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

    const actionTemplate = (rowData) => {
        return (
            <div className="flex">
                <Button icon="pi pi-pencil" rounded text severity="info" aria-label="Editar" tooltip="Editar"
                        onClick={() => handleEditFornecedor(rowData)}/>
                <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Remover" tooltip="Remover"
                        onClick={() => handleRemoveFornecedorDialog(rowData)}/>
            </div>
        );
    };

    const datatableHeader = () => {
        return (
            <DatatableHeader onAddButtonClick={handleAdicionarFornecedor} globalFilterValue={globalFilterValue}
                             onGlobalFilterChange={onGlobalFilterChange} clearFilter={clearFilter}/>
        );
    };

    return (
        <div className="container">
            <Toast ref={toast}/>
            <PageTitle pageTitle={"Fornecedores"} icon={"pi pi-truck center icon"}/>

            <DataTable value={fornecedores}
                       emptyMessage={"Não há nenhum fornecedor cadastrado."}
                       stripedRows showGridlines
                       paginator
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                       currentPageReportTemplate="Exibindo {first} a {last} de {totalRecords} registros"
                       totalRecords={totalRecords}
                       rows={10} rowsPerPageOptions={[5, 10, 20]}
                       header={datatableHeader}
                       filters={filters}>

                <Column field="nome" header="Nome" sortable={true} sortField="nome"/>
                <Column field="email" header="E-mail"/>
                <Column field="telefone" header="Telefone"
                        body={(rowData) => formatTelefone(rowData.telefone)}/>
                <Column field="acoes" header="Ações" align="center"
                        headerStyle={{width: "10%", minWidth: "8rem"}}
                        bodyStyle={{textAlign: "center"}} body={actionTemplate}/>
            </DataTable>
            {fornecedorToDelete &&
                <ConfirmDeleteDialog mensagem={'Deseja mesmo deletar este fornecedor?'}
                                     onConfirm={handleRemoveFornecedor}
                                     onCancel={() => setFornecedorToDelete(null)}/>}
            <CadastroFornecedorModal idFornecedor={fornecedorToEdit.idFornecedor} visible={dialogCadastroVisible}
                                     onHideSucess={handleDialogCadastroFornecedorOnHide}
                                     onHideCancel={handleDialogCadastroFornecedorOnHideCancel}/>

        </div>
    );
}

export default Fornecedores;
