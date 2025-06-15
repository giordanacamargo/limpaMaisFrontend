import React, {useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import axios from "../../../api/axios";
import {showToastError} from "../../../utils/InterfaceUtils";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";

const LOGIN_URL = '/auth/login';

const LoginDialog = () => {
    const {setAuth} = useAuth();
    const navigate = useNavigate();
    const toast = useRef(null);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {

        try {
            e.preventDefault();
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({login, password}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            const token = response?.data?.token;
            const roles = response?.data?.roles;
            setAuth({user: login, pwd: password, roles, token});
            setLogin('');
            setPassword('');
            navigate('/');

        } catch (err) {
            console.log(err);
            showToastError(toast, "Não foi possível realizar o login. Tente novamente mais tarde.");
        }
    }

    return (
        <div className="flex justify-content-center align-items-center h-screen">
            <Toast ref={toast}/>
            <Card title="Login" style={{width: '25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'}}>
                <form onSubmit={handleSubmit} className="p-fluid">
                    <div className="field">
                        <label htmlFor="username">Usuário</label>
                        <InputText
                            id="username"
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Digite seu usuário"
                            required
                        />
                    </div>

                    <div className="field mt-4">
                        <label htmlFor="password">Senha</label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite sua senha"
                            toggleMask
                            feedback={false}
                            required
                        />
                    </div>

                    <Button label="Entrar" type="submit" className="mt-4" icon="pi pi-sign-in"/>
                    <p className="mt-4 text-center">
                        Não tem uma conta? <Link to="/register">Registre-se</Link>
                    </p>
                </form>

            </Card>
        </div>
    );
};

export default LoginDialog;
