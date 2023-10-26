// dependencies
import { Navigate } from 'react-router-dom';

// other
import { AppUrls } from "../AppUrls";
import MainLayout from '../pages/layout/main-layout/MainLayout';

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("token");
  // return isAuthenticated ?
  //   <>
  //     <MainLayout />
  //   </>
  //   : <Navigate to={AppUrls.Client.Auth.SignIn} />;

  return <MainLayout />;
}

export default PrivateRoute;