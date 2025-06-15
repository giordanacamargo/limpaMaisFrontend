import {useCallback} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const API_BASE_URL = "/api/venda";

const useVendaService = () => {
    const axiosPrivate = useAxiosPrivate();

    const findAll = useCallback(async () => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/findAll`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar vendas:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const findById = useCallback(async (idVenda) => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/findById/${idVenda}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar venda:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const newVenda = useCallback(async (venda) => {
        try {
            const response = await axiosPrivate.post(`${API_BASE_URL}/new`, venda);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar/salvar venda:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const deleteVenda = useCallback(async (idVenda) => {
        try {
            const response = await axiosPrivate.delete(`${API_BASE_URL}/remove/${idVenda}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao excluir venda:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const exportVenda = useCallback(async (idVenda) => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/exportVenda/${idVenda}`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao gerar relatório de venda:", error);
            throw error;
        }
    }, [axiosPrivate]);

    return {findAll, findById, newVenda, deleteVenda, exportVenda};
};

export default useVendaService;