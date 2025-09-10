import React, {useEffect, useRef, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import PageTitle from "../../../layout/pageTitle/PageTitle";
import DatatableHeader from "../../../layout/datatableHeader/DatatableHeader";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import ConfirmDeleteDialog from "../../../layout/customComponents/confirmDialogs/ConfirmDeleteDialog";
import CadastroEpiModal from "./CadastroEpiModal";
import {showToastError, showToastSuccess} from "../../../../utils/InterfaceUtils";
import {FilterMatchMode} from "primereact/api";
import useEpiService from "../../../../services/EpiService";

function Epis() {
    const toast = useRef(null);
    const [atualizar, setAtualizar] = useState(Date.now());
    const [epis, setEpis] = useState([]);
    const [dialogCadastroVisible, setDialogCadastroVisible] = useState(false);
    const [epiToEdit, setEpiToEdit] = useState({idEpi: ''});
    const [epiToDelete, setEpiToDelete] = useState(null);
    const [filters, setFilters] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const {findAllEpis, deleteEpi} = useEpiService();

    async function fetchData() {
        try {
            const result = await findAllEpis("nome");
            setEpis(result.content);
            setTotalRecords(result.totalElements);
            initFilters();
        } catch (error) {
            showToastError(toast, "Não foi possível carregar os EPI's cadastrados. Por favor, tente novamente mais tarde.");
        }
    }

    useEffect(() => {
        fetchData();
    }, [atualizar]);

    function handleAdicionarEpi() {
        cleanEpiToEdit();
        setDialogCadastroVisible(true);
    }

    function handleEditEpi(epi) {
        cleanEpiToEdit();
        setEpiToEdit(epi)
        setDialogCadastroVisible(true);
    }

    function handleRemoveEpiDialog(epi) {
        setEpiToDelete(epi);
    }

    const handleRemoveEpi = async () => {
        try {
            await deleteEpi(epiToDelete.idEpi);
            setAtualizar(Date.now());
            setEpiToDelete(null);
            showToastSuccess(toast, "Epi deletado com sucesso.");
        } catch (error) {
            showToastError(toast, "Não foi possível deletar o EPI. Por favor, tente novamente mais tarde.");
        }
    }

    function handleDialogCadastroEpiOnHideCancel() {
        cleanEpiToEdit();
        setDialogCadastroVisible(false)
    }

    function handleDialogCadastroEpiOnHide() {
        setDialogCadastroVisible(false)
        setAtualizar(Date.now());
        showToastSuccess(toast, "EPI salvo com sucesso.");
        cleanEpiToEdit();
    }

    function cleanEpiToEdit() {
        setEpiToEdit({idEpi: ''});
    }

    const initFilters = () => {
        setFilters({
            global: {value: null, matchMode: FilterMatchMode.CONTAINS},
            nome: {value: '', matchMode: FilterMatchMode.CONTAINS},
            codigo: {value: '', matchMode: FilterMatchMode.CONTAINS}
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
                        onClick={() => handleEditEpi(rowData)}/>
                <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Remover" tooltip="Remover"
                        onClick={() => handleRemoveEpiDialog(rowData)}/>
            </div>
        );
    };

    const datatableHeader = () => {
        return (
            <DatatableHeader onAddButtonClick={handleAdicionarEpi} globalFilterValue={globalFilterValue}
                             onGlobalFilterChange={onGlobalFilterChange} clearFilter={clearFilter}/>
        );
    };

    return (
        <div className="container">
            <Toast ref={toast}/>
            <PageTitle pageTitle={"EPI's"} icon={"fa fa-flask center icon"}/>
            <DataTable
                value={epis}
                stripedRows showGridlines
                paginator currentPageReportTemplate="Exibindo {first} a {last} de {totalRecords} registros"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                totalRecords={totalRecords}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                header={datatableHeader}
                filters={filters}
                emptyMessage="Nenhum EPI encontrado."
            >
                <Column field="nome" header="Nome" sortable sortField="nome" sortOrder={1}/>
                <Column field="codigo" header="Código" sortable sortField="codigo"/>
                <Column field="acoes" header="Ações" align="center" headerStyle={{width: "10%", minWidth: "8rem"}}
                        bodyStyle={{textAlign: "center"}} body={actionTemplate}/>
            </DataTable>
            <CadastroEpiModal idEpi={epiToEdit.idEpi}
                                       onHideCancel={handleDialogCadastroEpiOnHideCancel}
                                       onHideSucess={handleDialogCadastroEpiOnHide}
                                       visible={dialogCadastroVisible}/>

            {epiToDelete &&
                <ConfirmDeleteDialog mensagem={'Deseja mesmo deletar este EPI?'}
                                     onConfirm={handleRemoveEpi}
                                     onCancel={() => setEpiToDelete(null)}/>}
        </div>
    );
}

export default Epis;
