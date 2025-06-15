import {useCallback} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const API_BASE_URL = "/api/colaborador";

const useColaboradorService = () => {
    const axiosPrivate = useAxiosPrivate();

    const findAllColaboradores = useCallback(async (sort) => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/findAllColaboradores`, {
                params: {sort}
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar colaboradores:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const findById = useCallback(async (idColaborador) => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/findById/${idColaborador}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar colaborador:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const newColaborador = useCallback(async (colaborador) => {
        try {
            const response = await axiosPrivate.post(`${API_BASE_URL}/new`, colaborador);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar colaborador:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const deleteColaborador = useCallback(async (idColaborador) => {
        try {
            const response = await axiosPrivate.delete(`${API_BASE_URL}/remove/${idColaborador}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao excluir colaborador:", error);
            throw error;
        }
    }, [axiosPrivate]);

    return {findAllColaboradores, findById, newColaborador, deleteColaborador};
};

export default useColaboradorService;