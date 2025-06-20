import React, {useContext, useMemo, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {MegaMenu} from "primereact/megamenu";
import "./Menu.css";
import {ReactComponent as Logo} from '../../../img/identidadeVisual/logo.svg';
import DynamicBreadcrumb from "./DynamicBreadrumb";
import useAuth from "../../../hooks/useAuth";
import {TieredMenu} from "primereact/tieredmenu";
import {Avatar} from "primereact/avatar";
import AuthContext from "../../../context/AuthProvider";

const Menu = () => {
    const {auth} = useAuth();
    const navigate = useNavigate();
    const menu = useRef(null);
    const {setAuth} = useContext(AuthContext);
    const handleGoToPath = (path) => {
        navigate(path);
    };

    const handleLogOut = () => {
        setAuth({user: null, pwd: null, roles: [], token: null});
        navigate('/login');
    };


    // Itens do menu do usuário
    const menuItems = useMemo(() => [
        {
            label: 'Meu Perfil',
            icon: 'pi pi-user',
            command: () => navigate('/perfil')
        },
        {
            separator: true
        },
        {
            label: 'Sair',
            icon: 'pi pi-sign-out',
            command: () => {
                handleLogOut();
            }
        }
    ], [navigate]);

    const start = <div><Logo className="logoEmpresa"/></div>;

    const endContent = useMemo(() => (
        <div className="flex align-items-center gap-3">
            <div
                className="usuario-card flex align-items-center gap-2 cursor-pointer p-2 hover:surface-100
                            transition-duration-150 border-round"
                onClick={(e) => menu.current.toggle(e)}
            >
                <Avatar
                    icon="pi pi-user"
                    shape="circle"
                    size="large"
                    className="bg-primary"
                />
                <div className="flex flex-column">
                    <span className="font-bold text-sm">{'Olá, ' + auth?.user || 'Usuário'}</span>
                    {/*auth.roles*/}
                    <span className="text-color-secondary text-sm">{auth?.role || 'Perfil'}</span>
                </div>
                <div className="ml-2">
                    <i className="pi pi-sort-down-fill" style={{fontSize: '1rem'}}></i>
                </div>
            </div>

            <TieredMenu
                ref={menu}
                model={menuItems}
                popup
                breakpoint="767px"
            />
        </div>
    ), [auth, menuItems]);

    const items = [
        {
            label: 'Início',
            icon: "fa fa-home",
            command: () => handleGoToPath('/')
        },
        {
            label: 'Cadastro',
            icon: 'fa fa-pencil-square-o',
            items: [
                [
                    {
                        label: 'Empresa',
                        items: [
                            {
                                label: 'Informações',
                                icon: 'fa fa-address-card',
                                command: () => handleGoToPath('/cadastro/empresa')
                            },
                            {
                                label: 'Colaboradores',
                                icon: 'fa fa-users',
                                command: () => handleGoToPath('/cadastro/colaboradores')
                            },
                            {
                                label: 'Fornecedores',
                                icon: 'pi pi-truck',
                                command: () => handleGoToPath('/cadastro/fornecedores')
                            }
                        ]
                    },
                    {
                        label: 'Produtos',
                        items: [
                            {
                                label: 'Categorias',
                                icon: 'fa fa-list-ul',
                                command: () => handleGoToPath('/cadastro/categorias')
                            },
                            {
                                label: 'Produtos',
                                icon: 'fa fa-shopping-basket',
                                command: () => handleGoToPath('/cadastro/produtos')
                            }
                        ]
                    },
                    {
                        label: 'Produção',
                        items: [
                            // {
                            //     label: 'Formulações',
                            //     icon: 'fa fa-glass',
                            //     // command: () => handleGoToPath('/formulacao')
                            // },
                            {
                                label: 'Matérias Primas',
                                icon: 'fa fa-flask',
                                command: () => handleGoToPath('/cadastro/materias_primas')
                            }
                        ]
                    },
                    {
                        label: 'Vendas',
                        items: [
                            {
                                label: 'Clientes',
                                icon: 'fa fa-users',
                                command: () => handleGoToPath('/cadastro/clientes')
                            },
                            {
                                label: 'Precificação',
                                icon: 'fa fa-usd',
                                command: () => handleGoToPath('/cadastro/precificacao')
                            }
                        ]
                    }
                ],
            ]
        },
        {
            label: 'Vendas',
            icon: 'fa fa-money',
            items: [
                [
                    {
                        label: 'Central de Vendas',
                        items: [
                            {
                                label: 'Nova venda',
                                icon: 'fa fa-plus',
                                command: () => handleGoToPath('/nova_venda')
                            },
                            {
                                label: 'Histórico',
                                icon: 'fa fa-history',
                                command: () => handleGoToPath('/vendas')
                            }
                        ]
                    }
                ],
            ]
        },
        // {
        //     label: 'Produção',
        //     icon: 'fa fa-cogs',
        //     items: [
        //         [
        //             {
        //                 label: 'Central de Produção',
        //                 items: [
        //                     {
        //                         label: 'Ordens de Produção',
        //                         icon: 'fa fa-gavel',
        //                         // command: () => handleGoToPath('/ordens_producao')
        //                     },
        //                     {
        //                         label: 'Histórico',
        //                         icon: 'fa fa-history',
        //                         // command: () => handleGoToPath('/historico_producao')
        //                     }
        //                 ]
        //             },
        //             {
        //                 label: 'Lotes',
        //                 items: [
        //                     {
        //                         label: 'Lotes gerados',
        //                         icon: 'fa fa-inbox',
        //                         // command: () => handleGoToPath('/lotes')
        //                     }
        //                 ]
        //             }
        //         ],
        //     ]
        // }
        {
            label: 'Estoque',
            icon: 'pi pi-warehouse',
            items: [
                [
                    {
                        label: 'Recebimento',
                        items: [
                            {
                                label: 'Matérias Primas',
                                icon: 'pi pi-inbox',
                                command: () => handleGoToPath('/estoque/recebimento/materias_primas')
                            },
                            {
                                label: 'Accuracy Dashboard',
                                icon: 'pi pi-inbox',
                                command: () => handleGoToPath('/estoque/recebimento/accuracy_dashboard')
                            },
                        ]
                    },
                ],
            ]
        }
    ];

    return (
        <div>
            <div className="fundo">
                <div className="container">
                    <MegaMenu
                        model={items}
                        start={start}
                        end={endContent}
                        className="menu"
                    />
                </div>
            </div>

            <div className="container breadcrumbmenu">
                <DynamicBreadcrumb/>
            </div>
        </div>
    );
};

export default Menu;
