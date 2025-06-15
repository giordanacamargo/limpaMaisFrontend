import React, {useEffect, useRef, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from 'primereact/column';
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";

import {showToastError, showToastSuccess} from "../../utils/InterfaceUtils";
import DatatableHeader from "../layout/datatableHeader/DatatableHeader";
import PageTitle from "../layout/pageTitle/PageTitle";
import {formatCurrency, formatData} from "../../utils/FormatUtils";
import ConfirmDeleteDialog from "../layout/customComponents/confirmDialogs/ConfirmDeleteDialog";
import {useNavigate} from "react-router-dom";
import {FilterMatchMode} from "primereact/api";
import useVendaService from "../../services/VendaService";

function Vendas() {
    const toast = useRef(null);
    const navigate = useNavigate();
    const [vendas, setVendas] = useState([]);
    const [atualizar, setAtualizar] = useState(Date.now());
    const [vendaToDelete, setVendaToDelete] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [gerandoRelatorioId, setGerandoRelatorioId] = useState(null);
    const {findAll, exportVenda, deleteVenda} = useVendaService();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await findAll();
                setVendas(result);
                setTotalRecords(vendas.length);
                initFilters();
            } catch (error) {
                showToastError(toast, "Não foi possível carregar as vendas. Por favor, tente novamente mais tarde.");
            }
        };
        fetchData();
    }, [atualizar]);

    function handleAdicionarVenda() {
        navigate('/nova_venda');
    }

    function handleEditVenda(venda) {
        navigate(`/nova_venda/${venda.idVenda}`);
    }

    function handleRemoveVendaDialog(venda) {
        setVendaToDelete(venda);
    }

    const initFilters = () => {
        setFilters({
            global: {value: null, matchMode: FilterMatchMode.CONTAINS},
            'cliente.nome': {value: '', matchMode: FilterMatchMode.CONTAINS}
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

    const handleRemoveVenda = async () => {
        try {
            await deleteVenda(vendaToDelete.idVenda);
            setAtualizar(Date.now());
            setVendaToDelete(null);
            showToastSuccess(toast, "Venda deletada com sucesso.");
        } catch (error) {
            showToastError(toast, "Não foi possível deletar a venda. Por favor, tente novamente mais tarde.");
        }
    }

    const exportReport = async (rowData) => {
        setGerandoRelatorioId(rowData.idVenda);
        try {
            const response = await exportVenda(rowData.idVenda);
            const blob = new Blob([response], {
                type: 'application/pdf',
            });
            window.open(window.URL.createObjectURL(blob));
        } catch (error) {
            showToastError(toast, "Não foi possível exportar a venda. Por favor, tente novamente mais tarde.");
        } finally {
            setGerandoRelatorioId(null);
        }
    };

    const datatableHeader = () => {
        return (
            <DatatableHeader onAddButtonClick={handleAdicionarVenda} globalFilterValue={globalFilterValue}
                             onGlobalFilterChange={onGlobalFilterChange} clearFilter={clearFilter}/>
        );
    };

    const actionTemplate = (rowData) => {
        const isLoading = gerandoRelatorioId === rowData.idVenda;
        return (
            <div className="displayFlex">
                <Button icon="pi pi-eye" rounded text severity="info" aria-label="Visualizar" tooltip="Visualizar"
                        onClick={() => handleEditVenda(rowData)}/>
                <Button icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-print"} rounded text
                        severity="secondary" aria-label="Imprimir" tooltip="Imprimir"
                        onClick={() => exportReport(rowData)}
                        disabled={isLoading}/>
                <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Remover" tooltip="Remover"
                        onClick={() => handleRemoveVendaDialog(rowData)}/>
            </div>
        );
    }

    return (
        <div className="container">
            <Toast ref={toast}/>
            <PageTitle pageTitle={"Vendas"} icon={"fa fa-money center icon"}/>

            <DataTable value={vendas} sortField="dataVenda" sortOrder={-1}
                       paginator removableSort
                       stripedRows showGridlines
                       rows={10} rowsPerPageOptions={[5, 10, 20]}
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                       emptyMessage="Nenhuma venda encontrada."
                       currentPageReportTemplate="Exibindo {first} a {last} de {totalRecords} registros"
                       totalRecords={totalRecords}
                       header={datatableHeader}
                       filters={filters}>

                <Column field="cliente.nome" header="Cliente"/>
                <Column field="dataVenda" header="Data da venda" sortable={true} sortField="dataVenda"
                        body={(rowData) => rowData.dataVenda ? formatData(rowData.dataVenda) : null}/>
                <Column field="dataPagamento" header="Data de Pagamento" sortable={true} sortField="dataPagamento"
                        body={(rowData) => rowData.dataPagamento ? formatData(rowData.dataPagamento) : null}/>
                <Column field="valorTotal" header="Valor Total" align="center" sortable={true} sortField="valorTotal"
                        body={(rowData) => rowData.valorTotal ? formatCurrency(rowData.valorTotal) : ''}/>
                <Column field="acoes" header="Ações" align="center"
                        headerStyle={{width: "10%", minWidth: "8rem"}}
                        bodyStyle={{textAlign: "center"}} body={actionTemplate}/>
            </DataTable>
            {vendaToDelete &&
                <ConfirmDeleteDialog mensagem={'Deseja mesmo deletar esta venda?'}
                                     onConfirm={handleRemoveVenda}
                                     onCancel={() => setVendaToDelete(null)}/>}

        </div>
    );
}

export default Vendas;