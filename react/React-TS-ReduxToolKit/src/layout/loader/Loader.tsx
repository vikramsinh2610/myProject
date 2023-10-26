
// dependencies
import { useSelector } from "react-redux";

// redux
import { RootState } from "../../redux/store";

// mui/material
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = () => {
    const { loading } = useSelector((state: RootState) => state.loader);
    
    return (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default Loader;