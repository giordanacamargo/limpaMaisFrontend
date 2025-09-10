import {useCallback} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const API_BASE_URL = "/api/epi";

const useEpiService = () => {
    const axiosPrivate = useAxiosPrivate();

    const findAllEpis = useCallback(async (sort) => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/findAll`, {
                params: {sort}
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar EPI's:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const findById = useCallback(async (idEpi) => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/findById/${idEpi}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar EPI:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const newEpi = useCallback(async (Epi) => {
        try {
            const response = await axiosPrivate.post(`${API_BASE_URL}/new`, Epi);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar/salvar EPI:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const deleteEpi = useCallback(async (idEpi) => {
        try {
            const response = await axiosPrivate.delete(`${API_BASE_URL}/remove/${idEpi}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao excluir EPI:", error);
            throw error;
        }
    }, [axiosPrivate]);


    return {findAllEpis, findById, newEpi, deleteEpi};
};

export default useEpiService;