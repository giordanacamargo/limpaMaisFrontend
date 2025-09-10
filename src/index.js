import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App";
import Produtos from "./components/cadastro/produtos/produto/Produtos";
import LoginDialog from "./components/layout/login/LoginDialog";
import RequireAuth from "./components/authentication/RequireAuth";
import Precificacao from "./components/cadastro/vendas/precificacao/Precificacao";
import Vendas from "./components/vendas/Vendas";
import CadastroVenda from "./components/vendas/CadastroVenda";
import Categorias from "./components/cadastro/produtos/categoria/Categorias";
import CadastroInformacoesEmpresa from "./components/cadastro/empresa/empresaInformacoes/CadastroInformacoesEmpresa";
import Fornecedores from "./components/cadastro/empresa/fornecedores/Fornecedores";
import MateriasPrimas from "./components/cadastro/producao/materia_prima/MateriasPrimas";
import Colaboradores from "./components/cadastro/empresa/colaboradores/Colaboradores";
import Clientes from "./components/cadastro/vendas/cliente/Clientes";
import {AuthProvider} from "./context/AuthProvider";
import Unauthorized from "./components/authentication/Unauthorized";
import RegistrationPage from "./components/layout/login/RegistrationPage";
import RecebimentoMateriasPrimas from "./components/estoque/recebimento_mercadorias/RecebimentoMateriasPrimas";
import AccuracyDashboard from "./components/estoque/AccuracyDashboard";

const ROLES = {
    'ROLE_USER': 'ROLE_USER',
    'ROLE_ADMIN': 'ROLE_ADMIN'
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/login",
                element: <LoginDialog/>
            },
            {
                path: "/unauthorized",
                element: <Unauthorized/>
            },
            {
                path: "/register",
                element: <RegistrationPage/>
            },
            {
                path: "/cadastro/produtos",
                element: (
                    <RequireAuth allowedRoles={[ROLES.ROLE_ADMIN]}>
                        <Produtos/>
                    </RequireAuth>
                )
            },
            {
                path: "/cadastro/categorias",
                element: (
                    <RequireAuth allowedRoles={[ROLES.ROLE_ADMIN]}>
                        <Categorias/>
                    </RequireAuth>
                )
            },
            {
                path: "/cadastro/empresa",
                element: (
                    <RequireAuth allowedRoles={[ROLES.ROLE_USER]}>
                        <CadastroInformacoesEmpresa/>
                    </RequireAuth>
                )
            },
            {
                path: "/cadastro/fornecedores",
                element: <Fornecedores/>
            },
            {
                path: "/cadastro/materias_primas",
                element: <MateriasPrimas/>
            },
            {
                path: "/cadastro/colaboradores",
                element: <Colaboradores/>
            },
            {
                path: "/cadastro/clientes",
                element: <Clientes/>
            },
            {
                path: "/cadastro/precificacao",
                element: <Precificacao/>
            },
            {
                path: "/vendas",
                element: <Vendas/>
            },
            {
                path: "/nova_venda",
                element: <CadastroVenda/>
            },
            {
                path: "/nova_venda/:idVenda",
                element: <CadastroVenda/>
            },
            {
                path: "/estoque/recebimento/materias_primas",
                element: (
                    <RequireAuth allowedRoles={[ROLES.ROLE_ADMIN]}>
                        <RecebimentoMateriasPrimas/>
                    </RequireAuth>
                )
            },
            {
                path: "/estoque/recebimento/accuracy_dashboard",
                element: (
                    <RequireAuth allowedRoles={[ROLES.ROLE_ADMIN]}>
                        <AccuracyDashboard/>
                    </RequireAuth>
                )
            },

        ]
    }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router}/>
        </AuthProvider>
    </React.StrictMode>
);

reportWebVitals();
