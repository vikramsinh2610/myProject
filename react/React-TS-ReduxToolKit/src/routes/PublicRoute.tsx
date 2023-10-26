// dependencies
import { Navigate, Outlet } from 'react-router-dom';

// other
import { AppUrls } from "../AppUrls";

const PublicRoute = () => {
    const isAuthenticated = localStorage.getItem("token");
    return isAuthenticated ? <Navigate to={AppUrls.Client.Dashboard} /> : <Outlet />;
}

export default PublicRoute;