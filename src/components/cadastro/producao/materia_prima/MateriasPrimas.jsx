import React, {useEffect, useRef, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import PageTitle from "../../../layout/pageTitle/PageTitle";
import DatatableHeader from "../../../layout/datatableHeader/DatatableHeader";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import './CadastroMateriaPrimaModal.css';
import ConfirmDeleteDialog from "../../../layout/customComponents/confirmDialogs/ConfirmDeleteDialog";
import CadastroMateriaPrimaModal from "./CadastroMateriaPrimaModal";
import {showToastError, showToastSuccess} from "../../../../utils/InterfaceUtils";
import {FilterMatchMode} from "primereact/api";
import useMateriaPrimaService from "../../../../services/MateriaPrimaService";

function MateriasPrimas() {
    const toast = useRef(null);
    const [atualizar, setAtualizar] = useState(Date.now());
    const [materiasPrimas, setMateriasPrimas] = useState([]);
    const [dialogCadastroVisible, setDialogCadastroVisible] = useState(false);
    const [materiaPrimaToEdit, setMateriaPrimaToEdit] = useState({idMateriaPrima: ''});
    const [materiaPrimaToDelete, setMateriaPrimaToDelete] = useState(null);
    const [filters, setFilters] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const {findAllMateriasPrimas, deleteMateriaPrima} = useMateriaPrimaService();

    async function fetchData() {
        try {
            const result = await findAllMateriasPrimas("nome");
            setMateriasPrimas(result.content);
            setTotalRecords(result.totalElements);
            initFilters();
        } catch (error) {
            showToastError(toast, "Não foi possível carregar os matérias primas cadastradas. Por favor, tente novamente mais tarde.");
        }
    }

    useEffect(() => {
        fetchData();
    }, [atualizar]);

    function handleAdicionarMateriaPrima() {
        cleanMateriaPrimaToEdit();
        setDialogCadastroVisible(true);
    }

    function handleEditMateriaPrima(materiaPrima) {
        cleanMateriaPrimaToEdit();
        setMateriaPrimaToEdit(materiaPrima)
        setDialogCadastroVisible(true);
    }

    function handleRemoveMateriaPrimaDialog(materiaPrima) {
        setMateriaPrimaToDelete(materiaPrima);
    }

    const handleRemoveMateriaPrima = async () => {
        try {
            await deleteMateriaPrima(materiaPrimaToDelete.idMateriaPrima);
            setAtualizar(Date.now());
            setMateriaPrimaToDelete(null);
            showToastSuccess(toast, "Matéria prima deletada com sucesso.");
        } catch (error) {
            showToastError(toast, "Não foi possível deletar a matéria prima. Por favor, tente novamente mais tarde.");
        }
    }

    function handleDialogCadastroMateriaPrimaOnHideCancel() {
        cleanMateriaPrimaToEdit();
        setDialogCadastroVisible(false)
    }

    function handleDialogCadastroMateriaPrimaOnHide() {
        setDialogCadastroVisible(false)
        setAtualizar(Date.now());
        showToastSuccess(toast, "Matéria prima salva com sucesso.");
        cleanMateriaPrimaToEdit();
    }

    function cleanMateriaPrimaToEdit() {
        setMateriaPrimaToEdit({idMateriaPrima: ''});
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
                        onClick={() => handleEditMateriaPrima(rowData)}/>
                <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Remover" tooltip="Remover"
                        onClick={() => handleRemoveMateriaPrimaDialog(rowData)}/>
            </div>
        );
    };

    const datatableHeader = () => {
        return (
            <DatatableHeader onAddButtonClick={handleAdicionarMateriaPrima} globalFilterValue={globalFilterValue}
                             onGlobalFilterChange={onGlobalFilterChange} clearFilter={clearFilter}/>
        );
    };

    return (
        <div className="container">
            <Toast ref={toast}/>
            <PageTitle pageTitle={"Matérias Primas"} icon={"fa fa-flask center icon"}/>
            <DataTable
                value={materiasPrimas}
                stripedRows showGridlines
                paginator currentPageReportTemplate="Exibindo {first} a {last} de {totalRecords} registros"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                totalRecords={totalRecords}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                header={datatableHeader}
                filters={filters}
                emptyMessage="Nenhuma matéria prima encontrada."
            >
                <Column field="nome" header="Nome" sortable sortField="nome" sortOrder={1}/>
                <Column field="codigo" header="Código" sortable sortField="codigo"/>
                <Column field="acoes" header="Ações" align="center" headerStyle={{width: "10%", minWidth: "8rem"}}
                        bodyStyle={{textAlign: "center"}} body={actionTemplate}/>
            </DataTable>
            <CadastroMateriaPrimaModal idMateriaPrima={materiaPrimaToEdit.idMateriaPrima}
                                       onHideCancel={handleDialogCadastroMateriaPrimaOnHideCancel}
                                       onHideSucess={handleDialogCadastroMateriaPrimaOnHide}
                                       visible={dialogCadastroVisible}/>

            {materiaPrimaToDelete &&
                <ConfirmDeleteDialog mensagem={'Deseja mesmo deletar esta matéria prima?'}
                                     onConfirm={handleRemoveMateriaPrima}
                                     onCancel={() => setMateriaPrimaToDelete(null)}/>}
        </div>
    );
}

export default MateriasPrimas;
