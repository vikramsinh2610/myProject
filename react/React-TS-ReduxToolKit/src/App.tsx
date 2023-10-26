// dependencies
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// routes 
import AppRoutes from "./routes/AppRoutes";

// loader
import Loader from "./layout/loader/Loader";

// css
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

    return (
        <BrowserRouter>
            <AppRoutes />
            <Loader />
            <ToastContainer />
        </BrowserRouter>
    );
};

export default App;
