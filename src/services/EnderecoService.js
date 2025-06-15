import {useCallback} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../api/axios";

const ENDERECO_API_BASE_URL = "/api/endereco";
const API_VIA_CEP_URL = "https://viacep.com.br/ws";

const useEnderecoService = () => {
    const axiosPrivate = useAxiosPrivate();

    const findById = useCallback(async (idEndereco) => {
        try {
            const response = await axiosPrivate.get(`${ENDERECO_API_BASE_URL}/findById/${idEndereco}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar endereço:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const newEndereco = useCallback(async (endereco) => {
        try {
            const response = await axiosPrivate.post(`${ENDERECO_API_BASE_URL}/new`, endereco);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar endereço:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const deleteEndereco = useCallback(async (idEndereco) => {
        try {
            const response = await axiosPrivate.delete(`${ENDERECO_API_BASE_URL}/remove/${idEndereco}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao excluir endereço:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const findByCep = useCallback(async (cep) => {
        try {
            const response = await axios.get(`${API_VIA_CEP_URL}/${cep}/json/`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar endereço pelo CEP:", error);
            throw error;
        }
    }, []);

    return {findById, newEndereco, deleteEndereco, findByCep};
};

export default useEnderecoService;
