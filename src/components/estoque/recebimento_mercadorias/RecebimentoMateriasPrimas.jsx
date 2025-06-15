import React, {useEffect, useRef, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Toast} from "primereact/toast";


import {FileUpload} from "primereact/fileupload";
import {showToastError} from "../../../utils/InterfaceUtils";
import PageTitle from "../../layout/pageTitle/PageTitle";
import useMateriaPrimaService from "../../../services/MateriaPrimaService";

function RecebimentoMateriasPrimas() {
    const toast = useRef(null);
    const [atualizar, setAtualizar] = useState(Date.now());
    const [itensNfse, setItensNfse] = useState([]);
    const {uploadFile} = useMateriaPrimaService();

    const onUploadNfse = async (event) => {
        const formData = new FormData();

        // Adiciona cada arquivo ao FormData
        event.files.forEach((file) => {
            formData.append("nfse", file);
        });

        try {
            const nfse = await uploadFile(formData);
            console.log(nfse.request.response);
            setItensNfse(nfse.data.produtos);
            setAtualizar(Date.now());
        } catch (error) {
            // Adicione tratamento de erro
            showToastError("Erro ao processar PDF");
        }
    };

    return (
        <div className="container">
            <Toast ref={toast}/>
            <PageTitle pageTitle={"Recebimento de matérias primas"} icon={"pi pi-inbox center icon"}/>
            <div>
                <FileUpload
                    name="nfse"
                    multiple
                    chooseLabel="Escolher"
                    cancelLabel="Cancelar"
                    uploadLabel="Enviar"
                    emptyTemplate={<p className="m-0">Arraste arquivos para realizar o upload da NFS-e.</p>}
                    customUpload
                    uploadHandler={onUploadNfse}
                />
            </div>

            <br/>

            <DataTable
                value={itensNfse}
                stripedRows showGridlines
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                // totalRecords={totalRecords}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                // header={datatableHeader}
                emptyMessage="Nenhum item encontrado."
            >
                <Column field="produto.codigo" header="Código" sortable sortField="produto.codigo" sortOrder={1}/>
                <Column field="produto.descricao" header="Nome" sortable sortField="produto.descricao"/>
                <Column field="produto.quantidade" header="Qtd" sortable sortField="produto.quantidade"/>
                <Column field="produto.unidade_medida" header="Medida" sortable sortField="produto.unidade_medida"/>
                <Column field="produto.valor_unitario" header="Val Unit." sortable sortField="produto.valor_unitario"/>
                <Column field="produto.valor_total" header="Val Total" sortable sortField="produto.valor_total"/>
                <Column field="produto.icms" header="ICMS" sortable sortField="produto.icms"/>
                <Column field="produto.ipi" header="IPI" sortable sortField="produto.ipi"/>

            </DataTable>


            <br/>
        </div>
    );
}

export default RecebimentoMateriasPrimas;
