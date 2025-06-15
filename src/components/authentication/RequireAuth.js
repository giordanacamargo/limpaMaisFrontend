import {Navigate, useLocation} from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({allowedRoles, children}) => {
    const {auth} = useAuth();
    const location = useLocation();

    // Permitir acesso a páginas públicas como '/register'
    if (location.pathname === "/register") {
        return children;
    }

    return (
        auth?.roles?.find(role => allowedRoles?.includes(role))
            ? children
            : auth?.user
                ? <Navigate to="/unauthorized" state={{from: location}} replace/>
                : <Navigate to="/login" state={{from: location}} replace/>
    );
};

export default RequireAuth;
