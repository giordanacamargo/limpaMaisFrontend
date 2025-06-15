import {useCallback} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const API_BASE_URL = "/api/materia_prima";

const useMateriaPrimaService = () => {
    const axiosPrivate = useAxiosPrivate();

    const findAllMateriasPrimas = useCallback(async (sort) => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/findAllMateriasPrimas`, {
                params: {sort}
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar matérias primas:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const findById = useCallback(async (idMateriaPrima) => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/findById/${idMateriaPrima}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar matéria prima:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const newMateriaPrima = useCallback(async (materiaPrima) => {
        try {
            const response = await axiosPrivate.post(`${API_BASE_URL}/new`, materiaPrima);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar/salvar matéria prima:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const deleteMateriaPrima = useCallback(async (idMateriaPrima) => {
        try {
            const response = await axiosPrivate.delete(`${API_BASE_URL}/remove/${idMateriaPrima}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao excluir matéria prima:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const uploadFile = useCallback(async (nfse) => {
        try {
            const response = await axiosPrivate.post(
                `${API_BASE_URL}/processWithContext`,
                nfse,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(response);
            return response;
        } catch (error) {
            console.error("Erro ao fazer upload do arquivo:", error);
            throw error;
        }
    }, [axiosPrivate]);


    return {findAllMateriasPrimas, findById, newMateriaPrima, deleteMateriaPrima, uploadFile};
};

export default useMateriaPrimaService;