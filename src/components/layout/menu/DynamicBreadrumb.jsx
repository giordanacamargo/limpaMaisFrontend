import React from 'react';
import {useLocation} from 'react-router-dom';
import {BreadCrumb} from 'primereact/breadcrumb';

const DynamicBreadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    const home = {icon: 'pi pi-home', url: '/'};

    const breadcrumbMap = {
        'materias_primas': 'Matérias Primas',
        'precificacao': 'Precificação',
        'nova_venda': 'Nova Venda',
    };

    const breadcrumbItems = pathnames.map((value, index) => {
        const url = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = breadcrumbMap[value] || value.charAt(0).toUpperCase() + value.slice(1);
        return {label, url};
    });

    return (
        <BreadCrumb model={breadcrumbItems} home={home}/>
    );
};

export default DynamicBreadcrumb;
