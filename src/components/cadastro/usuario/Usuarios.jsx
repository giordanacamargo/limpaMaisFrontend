import React, {useEffect, useRef, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from 'primereact/column';
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {FilterMatchMode} from "primereact/api";
import {showToastError, showToastSuccess} from "../../../utils/InterfaceUtils";
import DatatableHeader from "../../layout/datatableHeader/DatatableHeader";
import ConfirmDeleteDialog from "../../layout/customComponents/confirmDialogs/ConfirmDeleteDialog";
import PageTitle from "../../layout/pageTitle/PageTitle";

function Usuarios() {
    const toast = useRef(null);

    const [atualizar, setAtualizar] = useState(Date.now());
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioToDelete, setUsuarioToDelete] = useState(null);
    const [dialogCadastroVisible, setDialogCadastroVisible] = useState(false);
    const [usuarioToEdit, setUsuarioToEdit] = useState({idUsuario: ''});
    const [totalRecords, setTotalRecords] = useState(0);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const result = await usuarioService.findAllUsuario();
                // setUsuarios(result);
                // setTotalRecords(usuarios.length);
                // initFilters();
            } catch (error) {
                showToastError(toast, 'Não foi possível carregar as usuarios. Por favor, tente novamente mais tarde.');
            }
        };
        fetchData();
    }, [atualizar]);

    const initFilters = () => {
        setFilters({
            global: {value: null, matchMode: FilterMatchMode.CONTAINS},
            nome: {value: '', matchMode: FilterMatchMode.CONTAINS},
            idUsuario: {value: '', matchMode: FilterMatchMode.EQUALS}
        });
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    function handleAdicionarUsuario() {
        cleanUsuarioObject();
        setDialogCadastroVisible(true);
    }

    function handleEditUsuario(usuario) {
        cleanUsuarioObject();
        setUsuarioToEdit(usuario);
        setDialogCadastroVisible(true);
    }

    function handleRemoveDialog(usuario) {
        setUsuarioToDelete(usuario);
    }

    async function handleRemoveUsuario() {
        try {
            // await usuarioService.deleteUsuario(usuarioToDelete.idUsuario);
            // setAtualizar(Date.now());
            // setUsuarioToDelete(null);
            // showToastSuccess(toast, "Usuario deletada com sucesso.");
        } catch (error) {
            showToastError(toast, "Não foi possível deletar a usuario selecionada. Por favor, tente novamente mais tarde.");
        }
    }

    function handleDialogCadastroUsuarioOnHideCancel() {
        cleanUsuarioObject();
        setDialogCadastroVisible(false);
    }

    function handleDialogCadastroUsuarioOnHide() {
        setDialogCadastroVisible(false);
        setAtualizar(Date.now());
        showToastSuccess(toast, "Usuario salva com sucesso.");
        cleanUsuarioObject();
    }

    function cleanUsuarioObject() {
        setUsuarioToEdit({idUsuario: '', nome: ''});
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
                        onClick={() => handleEditUsuario(rowData)}/>
                <Button icon="pi pi-trash" rounded text severity="danger" tooltip="Remover"
                        onClick={() => handleRemoveDialog(rowData)}/>
            </div>
        );
    }

    const datatableHeader = () => {
        return (
            <DatatableHeader onAddButtonClick={handleAdicionarUsuario} globalFilterValue={globalFilterValue}
                             onGlobalFilterChange={onGlobalFilterChange} clearFilter={clearFilter}/>
        );
    };

    return (
        <div className="container">
            <Toast ref={toast}/>
            <PageTitle pageTitle={"Usuarios"} icon={"fa fa-list-ul center icon"}/>
            <DataTable value={usuarios}
                       stripedRows showGridlines
                       paginator
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                       currentPageReportTemplate="Exibindo {first} a {last} de {totalRecords} registros"
                       totalRecords={totalRecords}
                       rows={10} rowsPerPageOptions={[5, 10, 20]}
                       filters={filters}
                       header={datatableHeader}
                       emptyMessage="Não foi encontrada nenhuma usuario.">
                <Column field="idUsuario" headerStyle={{width: "8%", minWidth: "3rem"}} align="center" header="ID"
                        sortable sortField="idUsuario" sortOrder={1}/>
                <Column field="nome" header="Nome" sortable sortField="nome"/>
                <Column field="acoes" header="Ações" align="center"
                        headerStyle={{width: "10%", minWidth: "8rem"}}
                        bodyStyle={{textAlign: "center"}} body={actionTemplate}/>
            </DataTable>
            {/*<CadastroUsuarioModal idUsuario={usuarioToEdit.idUsuario}*/}
            {/*                      onHideCancel={handleDialogCadastroUsuarioOnHideCancel}*/}
            {/*                      onHideSucess={handleDialogCadastroUsuarioOnHide}*/}
            {/*                      visible={dialogCadastroVisible}/>*/}
            {usuarioToDelete && <ConfirmDeleteDialog mensagem={'Deseja mesmo deletar essa usuario?'}
                                                     onConfirm={handleRemoveUsuario}
                                                     onCancel={() => setUsuarioToDelete(null)}/>}
        </div>
    );
}

export default Usuarios;
