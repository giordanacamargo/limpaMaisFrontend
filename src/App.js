import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {PrimeReactProvider} from "primereact/api";
import 'primereact/resources/themes/lara-light-purple/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import Menu from "./components/layout/menu/Menu";
import Footer from "./components/layout/footer/footer";
import {Content, PageContainer} from "./components/layout/footer/FooterStyles";
import React from "react";
import useAuth from "./hooks/useAuth";

function App() {
    const location = useLocation();
    const {auth} = useAuth();

    const hideLayout = ['/login', '/register'];
    const shouldHideLayout = hideLayout.includes(location.pathname);
    console.log(auth);

    // Redireciona não autenticados para o /login, exceto quando for a página de registro
    if (!auth?.token && location.pathname !== '/login' && location.pathname !== '/register') {
        return <Navigate to="/login" replace/>;
    }


    return (
        <div>
            <PrimeReactProvider>
                {!shouldHideLayout && <Menu/>}
                <PageContainer>
                    <Content>
                        <Outlet/>
                    </Content>
                    {!shouldHideLayout && <Footer/>}
                </PageContainer>
            </PrimeReactProvider>
        </div>
    );
}

export default App;
