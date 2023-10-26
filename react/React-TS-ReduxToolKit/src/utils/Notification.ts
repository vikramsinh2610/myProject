// dependencies
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { APIResponse } from "../api";

export const NotifySuccess = (message: string) => toast.success(message);

export const NotifyError = (message: string) => toast.error(message);

export const NotifyAPISuccess = (response: APIResponse) => { if (response?.data?.message) toast.success(response.data.message); }

export const NotifyAPIError = (error: AxiosError) => {
    const response = error?.response as APIResponse
    toast.error(response?.data.message || error?.message || 'Something went wrong');
}