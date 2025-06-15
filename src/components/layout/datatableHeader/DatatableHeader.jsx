import React from "react";
import {Button} from "primereact/button";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";

function DatatableHeader({
                             onAddButtonClick,
                             showExportOptions,
                             exportCSV,
                             exportExcel,
                             exportPdf,
                             globalFilterValue,
                             clearFilter,
                             onGlobalFilterChange
                         }) {

    const exportItems = [
        ...(exportCSV ? [{label: 'Exportar CSV', value: 'csv'}] : []),
        ...(exportExcel ? [{label: 'Exportar Excel', value: 'excel'}] : []),
        ...(exportPdf ? [{label: 'Exportar PDF', value: 'pdf'}] : [])
    ];

    const handleExport = (e) => {
        const value = e.value;
        if (value === 'csv' && exportCSV) {
            exportCSV();
        } else if (value === 'excel' && exportExcel) {
            exportExcel();
        } else if (value === 'pdf' && exportPdf) {
            exportPdf();
        }
    };

    return (
        <div className="flex justify-content-between mx-2">
            <div className="flex">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"/>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Pesquisar"/>
                </IconField>
                <Button type="button" icon="pi pi-filter-slash" label="Limpar" outlined
                        onClick={clearFilter} className="mx-2"/>
            </div>

            <div>
                {showExportOptions && exportItems.length > 0 && (
                    <Dropdown className="mx-2"
                              value={null}
                              options={exportItems}
                              onChange={handleExport}
                              placeholder="Exportar"
                              emptyMessage="Nenhuma opção"
                    />
                )}

                <Button
                    label="Adicionar"
                    icon="pi pi-plus"
                    onClick={onAddButtonClick}
                />
            </div>
        </div>
    );
}

export default DatatableHeader;
