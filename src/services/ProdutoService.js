import {useCallback} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const PRODUTO_API_BASE_URL = "/api/produto";

const useProdutoService = () => {
    const axiosPrivate = useAxiosPrivate();

    const findAllProdutos = useCallback(async (sort) => {
        try {
            const response = await axiosPrivate.get(`${PRODUTO_API_BASE_URL}/findAllProdutos`, {
                params: {sort}
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const findById = useCallback(async (idProduto) => {
        try {
            const response = await axiosPrivate.get(`${PRODUTO_API_BASE_URL}/findById/${idProduto}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const newProduto = useCallback(async (produto) => {
        try {
            const response = await axiosPrivate.post(`${PRODUTO_API_BASE_URL}/new`, produto);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar/salvar produto:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const deleteProduto = useCallback(async (idProduto) => {
        try {
            const response = await axiosPrivate.delete(`${PRODUTO_API_BASE_URL}/remove/${idProduto}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const exportProdutos = useCallback(async (format) => {
        try {
            const response = await axiosPrivate.get(`${PRODUTO_API_BASE_URL}/exportProdutos/${format}`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao gerar relatório de produtos:", error);
            throw error;
        }
    }, [axiosPrivate]);

    return {findAllProdutos, findById, newProduto, deleteProduto, exportProdutos};
};

export default useProdutoService;