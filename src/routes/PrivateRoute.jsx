import { Backdrop, CircularProgress } from "@mui/material";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { loading, user } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
        >
            <CircularProgress color="secondary" />
        </Backdrop>
    }

    if (!user) {
        return <Navigate to={'/sign-in'} state={{from: location}}/>
    }

    return children;
};

export default PrivateRoute;