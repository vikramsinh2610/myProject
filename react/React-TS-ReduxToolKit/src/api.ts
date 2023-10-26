// dependencies
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

//redux
import { store } from "./redux/store";
import { showLoader, hideLoader } from './redux/feature/loaderSlice';
import { NotifyAPIError } from './utils/Notification';

export interface APIResponse { data: data }
export interface data { message: '', status: '' }

const { dispatch } = store;
const token = localStorage.getItem('token');

const instance = axios.create({ baseURL: process.env.REACT_APP_API_URI, headers: { 'Authorization': `Bearer ${token}` } });
instance.interceptors.request.use((config: InternalAxiosRequestConfig<AxiosRequestConfig>) => { dispatch(showLoader()); return config },
    (error: AxiosError) => {
        NotifyAPIError(error);
        dispatch(hideLoader());
        return Promise.reject(error);
    });
instance.interceptors.response.use((response: AxiosResponse) => { dispatch(hideLoader()); return response },
    (error: AxiosError) => {
        NotifyAPIError(error);
        dispatch(hideLoader());
        return Promise.reject(error)
    });

export default instance