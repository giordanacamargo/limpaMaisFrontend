import {useCallback} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const PRECO_API_BASE_URL = "/api/preco";

const usePrecoService = () => {
    const axiosPrivate = useAxiosPrivate();

    const findAll = useCallback(async () => {
        try {
            const response = await axiosPrivate.get(`${PRECO_API_BASE_URL}/findAll`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar preços:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const findAllAtivos = useCallback(async () => {
        try {
            const response = await axiosPrivate.get(`${PRECO_API_BASE_URL}/findAllAtivos`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar preços ativos:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const findById = useCallback(async (idPreco) => {
        try {
            const response = await axiosPrivate.get(`${PRECO_API_BASE_URL}/findById/${idPreco}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar preço:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const newPreco = useCallback(async (preco) => {
        try {
            const response = await axiosPrivate.post(`${PRECO_API_BASE_URL}/new`, preco);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar precificação:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const deletePreco = useCallback(async (idPreco) => {
        try {
            const response = await axiosPrivate.delete(`${PRECO_API_BASE_URL}/remove/${idPreco}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao excluir precificação:", error);
            throw error;
        }
    }, [axiosPrivate]);

    return {findAll, findAllAtivos, findById, newPreco, deletePreco};
};

export default usePrecoService;
