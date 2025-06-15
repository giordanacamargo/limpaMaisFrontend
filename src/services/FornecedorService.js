import {useCallback} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const FORNECEDOR_API_BASE_URL = "/api/fornecedor";

const useFornecedorService = () => {
    const axiosPrivate = useAxiosPrivate();

    const findAllDTO = useCallback(async () => {
        try {
            const response = await axiosPrivate.get(`${FORNECEDOR_API_BASE_URL}/findAllDTO`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar fornecedores:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const findDTOById = useCallback(async (idFornecedor) => {
        try {
            const response = await axiosPrivate.get(`${FORNECEDOR_API_BASE_URL}/findDTOById/${idFornecedor}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar fornecedor:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const newFornecedor = useCallback(async (fornecedorDTO) => {
        try {
            const response = await axiosPrivate.post(`${FORNECEDOR_API_BASE_URL}/new`, fornecedorDTO);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar fornecedor:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const deleteFornecedor = useCallback(async (idFornecedor) => {
        try {
            const response = await axiosPrivate.delete(`${FORNECEDOR_API_BASE_URL}/remove/${idFornecedor}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao excluir fornecedor:", error);
            throw error;
        }
    }, [axiosPrivate]);

    return {findAllDTO, findDTOById, newFornecedor, deleteFornecedor};
};

export default useFornecedorService;
