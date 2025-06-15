import {useCallback} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const API_BASE_URL = "/api/categoria";

const useCategoriaService = () => {
    const axiosPrivate = useAxiosPrivate();

    const findAllCategorias = useCallback(async () => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/findAllCategorias`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const findById = useCallback(async (idCategoria) => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/findById/${idCategoria}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar categoria:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const newCategoria = useCallback(async (categoria) => {
        try {
            const response = await axiosPrivate.post(`${API_BASE_URL}/new`, categoria);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar/salvar categoria:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const deleteCategoria = useCallback(async (idCategoria) => {
        try {
            const response = await axiosPrivate.delete(`${API_BASE_URL}/remove/${idCategoria}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao excluir categoria:", error);
            throw error;
        }
    }, [axiosPrivate]);

    return {findAllCategorias, findById, newCategoria, deleteCategoria};
};

export default useCategoriaService;