import React, {useEffect, useRef, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import PageTitle from "../../../layout/pageTitle/PageTitle";
import DatatableHeader from "../../../layout/datatableHeader/DatatableHeader";
import useProdutoService from "../../../../services/ProdutoService";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {Chips} from "primereact/chips";
import CadastroProdutoModal from "./CadastroProdutoModal";
import './CadastroProdutoModal.css';
import ConfirmDeleteDialog from "../../../layout/customComponents/confirmDialogs/ConfirmDeleteDialog";
import {showToastError, showToastSuccess} from "../../../../utils/InterfaceUtils";
import {FilterMatchMode} from "primereact/api";

function Produtos() {
    const toast = useRef(null);
    const {findAllProdutos, deleteProduto, exportProdutos} = useProdutoService();
    const [atualizar, setAtualizar] = useState(Date.now());
    const [produtos, setProdutos] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [dialogCadastroVisible, setDialogCadastroVisible] = useState(false);
    const [produtoToEdit, setProdutoToEdit] = useState({idProduto: ''});
    const [produtoToDelete, setProdutoToDelete] = useState(null);

    async function fetchData() {
        try {
            const result = await findAllProdutos("nome");
            setProdutos(result.content);
            setTotalRecords(result.totalElements);
            initFilters();
        } catch (error) {
            showToastError(toast, "Não foi possível carregar os produtos cadastrados. Por favor, tente novamente mais tarde.");
        }
    }

    useEffect(() => {
        fetchData();
    }, [atualizar]);

    function handleAdicionarProduto() {
        cleanProdutoToEdit();
        setDialogCadastroVisible(true);
    }

    function handleEditProduto(produto) {
        cleanProdutoToEdit()
        setProdutoToEdit(produto)
        setDialogCadastroVisible(true);
    }

    function handleRemoveProdutoDialog(produto) {
        setProdutoToDelete(produto);
    }

    const handleRemoveProduto = async () => {
        try {
            await deleteProduto(produtoToDelete.idProduto);
            setAtualizar(Date.now());
            setProdutoToDelete(null);
            showToastSuccess(toast, "Produto deletado com sucesso.");
        } catch (error) {
            showToastError(toast, "Não foi possível deletar o produto. Por favor, tente novamente mais tarde.");
        }
    }

    function handleDialogCadastroProdutoOnHideCancel() {
        cleanProdutoToEdit();
        setDialogCadastroVisible(false)
    }

    function handleDialogCadastroProdutoOnHide() {
        setDialogCadastroVisible(false)
        setAtualizar(Date.now());
        showToastSuccess(toast, "Produto salvo com sucesso.");
        cleanProdutoToEdit();
    }

    function cleanProdutoToEdit() {
        setProdutoToEdit({idProduto: ''});
    }

    const exportPdf = async () => {
        await exportReport("pdf");
    };

    const exportReport = async (format) => {
        try {
            const response = await exportProdutos(format);
            const blob = new Blob([response], {
                type: 'application/' + format,
            });
            window.open(window.URL.createObjectURL(blob));
        } catch (error) {
            showToastError(toast, "Não foi possível exportar os produtos. Por favor, tente novamente mais tarde.");
        }
    };

    const initFilters = () => {
        setFilters({
            global: {value: null, matchMode: FilterMatchMode.CONTAINS},
            nome: {value: '', matchMode: FilterMatchMode.CONTAINS},
            volume: {value: '', matchMode: FilterMatchMode.EQUALS},
            peso: {value: '', matchMode: FilterMatchMode.EQUALS},
            categoriasConcatenadas: {value: '', matchMode: FilterMatchMode.CONTAINS}
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
                        onClick={() => handleEditProduto(rowData)}/>
                <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Remover" tooltip="Remover"
                        onClick={() => handleRemoveProdutoDialog(rowData)}/>
            </div>
        );
    };

    const datatableHeader = () => {
        return (
            <DatatableHeader onAddButtonClick={handleAdicionarProduto}
                             showExportOptions={"true"}
                             exportPdf={exportPdf} globalFilterValue={globalFilterValue}
                             onGlobalFilterChange={onGlobalFilterChange} clearFilter={clearFilter}/>
        );
    };

    return (
        <div className="container">
            <Toast ref={toast}/>
            <PageTitle pageTitle={"Produtos"} icon={"fa fa-shopping-basket center icon"}/>
            <DataTable
                value={produtos}
                stripedRows showGridlines
                paginator
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Exibindo {first} a {last} de {totalRecords} registros"
                totalRecords={totalRecords}
                rows={10} rowsPerPageOptions={[5, 10, 20]}
                header={datatableHeader}
                filters={filters}
                filterDisplay={"menu"}
                emptyMessage="Nenhum produto encontrado.">
                <Column field="nome" header="Nome" sortable sortField="nome" sortOrder={1}/>
                <Column field="volume" header="Volume" body={(rowData) => rowData.volume ? rowData.volume + " l" : ""}/>
                <Column field="peso" header="Peso" body={(rowData) => rowData.peso ? +rowData.peso + " kg" : ""}/>
                <Column field="categoriasConcatenadas" header="Categorias"
                        body={(rowData) => (
                            <Chips disabled value={rowData.categorias.map((categoria) => categoria.nome)}/>
                        )}/>
                <Column field="acoes" header="Ações" align="center"
                        headerStyle={{width: "10%", minWidth: "8rem"}}
                        bodyStyle={{textAlign: "center"}} body={actionTemplate}/>
            </DataTable>
            <CadastroProdutoModal idProduto={produtoToEdit.idProduto}
                                  onHideCancel={handleDialogCadastroProdutoOnHideCancel}
                                  onHideSucess={handleDialogCadastroProdutoOnHide}
                                  visible={dialogCadastroVisible}/>

            {produtoToDelete &&
                <ConfirmDeleteDialog mensagem={'Deseja mesmo deletar este produto?'} onConfirm={handleRemoveProduto}
                                     onCancel={() => setProdutoToDelete(null)}/>}
        </div>
    );
}

export default Produtos;
