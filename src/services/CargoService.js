import {useCallback} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const API_BASE_URL = "/api/cargo";

const useCargoService = () => {
    const axiosPrivate = useAxiosPrivate();

    const findAllCargos = useCallback(async (sort) => {
        try {
            const response = await axiosPrivate.get(`${API_BASE_URL}/findAllCargos`, {
                params: {sort}
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar cargos:", error);
            throw error;
        }
    }, [axiosPrivate]);

    return {findAllCargos};
};

export default useCargoService;