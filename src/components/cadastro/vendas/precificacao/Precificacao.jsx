import React, {useEffect, useRef, useState} from "react";
import {Toast} from "primereact/toast";
import PageTitle from "../../../layout/pageTitle/PageTitle";
import {DataTable} from "primereact/datatable";
import DatatableHeader from "../../../layout/datatableHeader/DatatableHeader";
import {Column} from "primereact/column";
import CadastroPrecoModal from "./CadastroPrecoModal";
import {formatCurrency} from "../../../../utils/FormatUtils";
import {FilterMatchMode} from 'primereact/api';
import {showToastError, showToastSuccess} from "../../../../utils/InterfaceUtils";
import {Button} from "primereact/button";
import {classNames} from "primereact/utils";
import ConfirmDeleteDialog from "../../../layout/customComponents/confirmDialogs/ConfirmDeleteDialog";
import usePrecoService from "../../../../services/PrecoService";

function Precificacao() {
    const toast = useRef(null);
    const [atualizar, setAtualizar] = useState(Date.now());
    const [precos, setPrecos] = useState([]);
    const [precoToEdit, setPrecoToEdit] = useState({idPreco: ''});
    const [precoToDelete, setPrecoToDelete] = useState(null);
    const [dialogCadastroVisible, setDialogCadastroVisible] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const {findAll, deletePreco} = usePrecoService();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await findAll();
                setPrecos(result);
                setTotalRecords(precos.length);
                initFilters();
            } catch (error) {
                showToastError(toast, "Não foi possível carregar a precificação. Por favor, tente novamente mais tarde.");
            }
        };

        fetchData();
    }, [atualizar]);

    async function handleRemovePreco() {
        try {
            await deletePreco(precoToDelete.idPreco);
            setAtualizar(Date.now());
            setPrecoToDelete(null);
            showToastSuccess(toast, "Preço deletado com sucesso.");
        } catch (error) {
            showToastError(toast, "Não foi possível deletar o preço selecionado. Por favor, tente novamente mais tarde.");
        }
    }

    function handleEditPreco(preco) {
        cleanPrecoToEdit();
        setPrecoToEdit(preco);
        setDialogCadastroVisible(true);
    }

    function handleRemovePrecoDialog(preco) {
        setPrecoToDelete(preco);
    }

    function handleAdicionarPreco() {
        cleanPrecoToEdit();
        setDialogCadastroVisible(true);
    }

    function handleDialogCadastroPrecoOnHideCancel() {
        cleanPrecoToEdit();
        setDialogCadastroVisible(false);
    }

    function handleDialogCadastroPrecoOnHide() {
        setDialogCadastroVisible(false);
        setAtualizar(Date.now());
        showToastSuccess(toast, "Precificação salva com sucesso.");
        cleanPrecoToEdit();
    }

    function cleanPrecoToEdit() {
        setPrecoToEdit({idPreco: ''});
    }

    const initFilters = () => {
        setFilters({
            global: {value: '', matchMode: FilterMatchMode.CONTAINS},
            'produto.nome': {value: '', matchMode: FilterMatchMode.CONTAINS},
            ativo: {value: null, matchMode: FilterMatchMode.EQUALS},
            precoB2B: {value: null, matchMode: FilterMatchMode.BETWEEN},
            precoB2C: {value: null, matchMode: FilterMatchMode.BETWEEN}
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
                        onClick={() => handleEditPreco(rowData)}/>
                <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Remover" tooltip="Remover"
                        onClick={() => handleRemovePrecoDialog(rowData)}/>
            </div>
        );
    }

    const activeBodyTemplate = (rowData) => {
        return <i className={classNames('pi', {
            'true-icon pi-check-circle': rowData.ativo,
            'false-icon pi-times-circle': !rowData.ativo
        })}></i>;
    };

    const datatableHeader = () => {
        return (
            <DatatableHeader onAddButtonClick={handleAdicionarPreco} globalFilterValue={globalFilterValue}
                             onGlobalFilterChange={onGlobalFilterChange} clearFilter={clearFilter}/>
        );
    };

    return (
        <div className="container">
            <Toast ref={toast}/>
            <PageTitle pageTitle={"Precificação"} icon={"fa fa-usd center icon"}/>

            <DataTable value={precos}
                       paginator
                       stripedRows showGridlines
                       rows={10} rowsPerPageOptions={[5, 10, 20]}
                       emptyMessage="Não foram encontrados preços."
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                       currentPageReportTemplate="Exibindo {first} a {last} de {totalRecords} registros"
                       totalRecords={totalRecords}
                       filters={filters}
                       header={datatableHeader}>

                <Column field="produto.nome" header="Produto" sortable={true} sortField="produto.nome"/>

                <Column field="precoB2B" header="Preço para vendedores" sortable={true} sortField="precoB2B"
                        body={(rowData) => formatCurrency(rowData.precoB2B)} align="center"
                        headerStyle={{width: "25%", minWidth: "10rem"}}/>

                <Column field="precoB2C" header="Preço para clientes" sortable={true} sortField="precoB2C"
                        body={(rowData) => formatCurrency(rowData.precoB2C)} align="center"
                        headerStyle={{width: "20%", minWidth: "10rem"}}/>

                <Column field="ativo" header="Ativo" style={{width: '1rem'}}
                        body={activeBodyTemplate} align="center" headerStyle={{width: "10%", minWidth: "5rem"}}
                        bodyStyle={{textAlign: "center"}}/>

                <Column field="acoes" header="Ações" align="center"
                        headerStyle={{width: "10%", minWidth: "8rem"}}
                        bodyStyle={{textAlign: "center"}} body={actionTemplate}/>

            </DataTable>
            <CadastroPrecoModal idPreco={precoToEdit.idPreco}
                                onHideCancel={handleDialogCadastroPrecoOnHideCancel}
                                onHideSucess={handleDialogCadastroPrecoOnHide}
                                visible={dialogCadastroVisible}/>

            {precoToDelete && <ConfirmDeleteDialog mensagem={'Deseja mesmo deletar esse preço?'}
                                                   onConfirm={handleRemovePreco}
                                                   onCancel={() => setPrecoToDelete(null)}/>}

        </div>
    );
}

export default Precificacao;
