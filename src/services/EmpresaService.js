import {useCallback} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const EMPRESA_API_BASE_URL = "/api/empresa";

const useEmpresaService = () => {
    const axiosPrivate = useAxiosPrivate();

    const findEmpresa = useCallback(async () => {
        try {
            const response = await axiosPrivate.get(`${EMPRESA_API_BASE_URL}/findEmpresa`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar a empresa:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const newEmpresa = useCallback(async (empresa) => {
        try {
            await axiosPrivate.post(`${EMPRESA_API_BASE_URL}/new`, empresa);
        } catch (error) {
            console.error("Erro ao salvar os dados da empresa:", error);
            throw error;
        }
    }, [axiosPrivate]);

    const uploadFile = useCallback(async (file) => {
        try {
            const formData = new FormData();
            formData.append("demo", file);

            await axiosPrivate.post(`${EMPRESA_API_BASE_URL}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (error) {
            console.error("Erro ao fazer upload do arquivo:", error);
            throw error;
        }
    }, [axiosPrivate]);

    return {findEmpresa, newEmpresa, uploadFile};
};

export default useEmpresaService;
