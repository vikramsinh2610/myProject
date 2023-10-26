// dependencies
import { Route, Routes, Navigate } from "react-router-dom";

// pages
import SignIn from "../pages/auth/sign-in/SignIn";
import SignUp from "../pages/auth/sign-up/SignUp";
import Dashboard from "../pages/dashboard/Dashboard";

// route
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// other
import { AppUrls } from "../AppUrls";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to={AppUrls.Client.Dashboard} />} />
            <Route element={<PublicRoute />}>
                <Route path={AppUrls.Client.Auth.SignIn} element={<SignIn />} />
                <Route path={AppUrls.Client.Auth.SignUp} element={<SignUp />} />
            </Route>
            <Route element={<PrivateRoute />}>
                <Route path={AppUrls.Client.Dashboard} element={<Dashboard />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
