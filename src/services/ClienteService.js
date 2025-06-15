import {useCallback} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const API_BASE_URL = "/api/cliente";

const useClienteService = () => {
    const axiosPrivate = useAxiosPrivate();

    const findAllClientes = useCallback(async () => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/findAllClientes`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const findById = useCallback(async (idCliente) => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/findById/${idCliente}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const newCliente = useCallback(async (cliente) => {
        try {
            const response = await axiosPrivate.post(`${API_BASE_URL}/new`, cliente);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar cliente:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const deleteCliente = useCallback(async (idCliente) => {
        try {
            const response = await axiosPrivate.delete(`${API_BASE_URL}/remove/${idCliente}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const updateCliente = useCallback(async (idCliente, cliente) => {
        try {
            const response = await axiosPrivate.put(`${API_BASE_URL}/update/${idCliente}`, cliente);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const findByFilter = useCallback(async (filters) => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/findByFilter`, {
                params: filters
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar clientes com filtros:", error);
            throw error;
        }
    }, [axiosPrivate]);

    return {
        findAllClientes,
        findById,
        newCliente,
        deleteCliente,
        updateCliente,
        findByFilter
    };
};

export default useClienteService;