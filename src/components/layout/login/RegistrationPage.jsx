import React, {useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "../../../api/axios";
import {showToastError} from "../../../utils/InterfaceUtils";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";

const REGISTER_URL = '/auth/register';

const RegistrationPage = () => {
    const navigate = useNavigate();
    const toast = useRef(null);

    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showToastError(toast, "As senhas não coincidem.");
            return;
        }

        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({login: cpf, password, role: 'USER'}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );

            if (response.status === 200) {
                navigate("/login");
            }
        } catch (err) {
            console.log(err);
            showToastError(toast, "Não foi possível realizar o registro. Tente novamente mais tarde.");
        }
    };

    return (
        <div className="flex justify-content-center align-items-center h-screen">
            <Toast ref={toast}/>
            <Card title="Registrar" style={{width: '25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'}}>
                <form onSubmit={handleSubmit} className="p-fluid">
                    <div className="field">
                        <label htmlFor="cpf">CPF</label>
                        <InputText
                            id="cpf"
                            type="text"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            placeholder="Digite seu CPF"
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

                    <div className="field mt-4">
                        <label htmlFor="confirmPassword">Confirmar Senha</label>
                        <Password
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirme sua senha"
                            toggleMask
                            feedback={false}
                            required
                        />
                    </div>

                    <Button label="Registrar" type="submit" className="mt-4" icon="pi pi-check"/>
                </form>

                <p className="mt-4 text-center">
                    Já tem uma conta? <Link to="/login">Faça login</Link>
                </p>
            </Card>
        </div>
    );
};

export default RegistrationPage;
