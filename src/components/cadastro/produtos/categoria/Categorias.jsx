import React, {useEffect, useRef, useState} from "react";
import PageTitle from "../../../layout/pageTitle/PageTitle";
import {DataTable} from "primereact/datatable";
import {Column} from 'primereact/column';
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import ConfirmDeleteDialog from "../../../layout/customComponents/confirmDialogs/ConfirmDeleteDialog";
import DatatableHeader from "../../../layout/datatableHeader/DatatableHeader";
import CadastroCategoriaModal from "./CadastroCategoriaModal";
import {showToastError, showToastSuccess} from "../../../../utils/InterfaceUtils";
import {FilterMatchMode} from "primereact/api";
import useCategoriaService from "../../../../services/CategoriaService";

function Categorias() {
    const toast = useRef(null);
    const [atualizar, setAtualizar] = useState(Date.now());
    const [categorias, setCategorias] = useState([]);
    const [categoriaToDelete, setCategoriaToDelete] = useState(null);
    const [dialogCadastroVisible, setDialogCadastroVisible] = useState(false);
    const [categoriaToEdit, setCategoriaToEdit] = useState({idCategoria: ''});
    const [totalRecords, setTotalRecords] = useState(0);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const {findAllCategorias, deleteCategoria} = useCategoriaService();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await findAllCategorias();
                setCategorias(result);
                setTotalRecords(categorias.length);
                initFilters();
            } catch (error) {
                showToastError(toast, 'Não foi possível carregar as categorias. Por favor, tente novamente mais tarde.');
            }
        };
        fetchData();
    }, [atualizar]);

    const initFilters = () => {
        setFilters({
            global: {value: null, matchMode: FilterMatchMode.CONTAINS},
            nome: {value: '', matchMode: FilterMatchMode.CONTAINS},
            idCategoria: {value: '', matchMode: FilterMatchMode.EQUALS}
        });
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    function handleAdicionarCategoria() {
        cleanCategoriaObject();
        setDialogCadastroVisible(true);
    }

    function handleEditCategoria(categoria) {
        cleanCategoriaObject();
        setCategoriaToEdit(categoria);
        setDialogCadastroVisible(true);
    }

    function handleRemoveDialog(categoria) {
        setCategoriaToDelete(categoria);
    }

    async function handleRemoveCategoria() {
        try {
            await deleteCategoria(categoriaToDelete.idCategoria);
            setAtualizar(Date.now());
            setCategoriaToDelete(null);
            showToastSuccess(toast, "Categoria deletada com sucesso.");
        } catch (error) {
            showToastError(toast, "Não foi possível deletar a categoria selecionada. Por favor, tente novamente mais tarde.");
        }
    }

    function handleDialogCadastroCategoriaOnHideCancel() {
        cleanCategoriaObject();
        setDialogCadastroVisible(false);
    }

    function handleDialogCadastroCategoriaOnHide() {
        setDialogCadastroVisible(false);
        setAtualizar(Date.now());
        showToastSuccess(toast, "Categoria salva com sucesso.");
        cleanCategoriaObject();
    }

    function cleanCategoriaObject() {
        setCategoriaToEdit({idCategoria: '', nome: ''});
    }

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
                <Button icon="pi pi-pencil" rounded text severity="info" tooltip="Editar"
                        onClick={() => handleEditCategoria(rowData)}/>
                <Button icon="pi pi-trash" rounded text severity="danger" tooltip="Remover"
                        onClick={() => handleRemoveDialog(rowData)}/>
            </div>
        );
    }

    const datatableHeader = () => {
        return (
            <DatatableHeader onAddButtonClick={handleAdicionarCategoria} globalFilterValue={globalFilterValue}
                             onGlobalFilterChange={onGlobalFilterChange} clearFilter={clearFilter}/>
        );
    };

    return (
        <div className="container">
            <Toast ref={toast}/>
            <PageTitle pageTitle={"Categorias"} icon={"fa fa-list-ul center icon"}/>
            <DataTable value={categorias}
                       stripedRows showGridlines
                       paginator
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                       currentPageReportTemplate="Exibindo {first} a {last} de {totalRecords} registros"
                       totalRecords={totalRecords}
                       rows={10} rowsPerPageOptions={[5, 10, 20]}
                       filters={filters}
                       header={datatableHeader}
                       emptyMessage="Não foi encontrada nenhuma categoria.">
                <Column field="idCategoria" headerStyle={{width: "8%", minWidth: "3rem"}} align="center" header="ID"
                        sortable sortField="idCategoria" sortOrder={1}/>
                <Column field="nome" header="Nome" sortable sortField="nome"/>
                <Column field="acoes" header="Ações" align="center"
                        headerStyle={{width: "10%", minWidth: "8rem"}}
                        bodyStyle={{textAlign: "center"}} body={actionTemplate}/>
            </DataTable>
            <CadastroCategoriaModal idCategoria={categoriaToEdit.idCategoria}
                                    onHideCancel={handleDialogCadastroCategoriaOnHideCancel}
                                    onHideSucess={handleDialogCadastroCategoriaOnHide}
                                    visible={dialogCadastroVisible}/>
            {categoriaToDelete && <ConfirmDeleteDialog mensagem={'Deseja mesmo deletar essa categoria?'}
                                                       onConfirm={handleRemoveCategoria}
                                                       onCancel={() => setCategoriaToDelete(null)}/>}
        </div>
    );
}

export default Categorias;
