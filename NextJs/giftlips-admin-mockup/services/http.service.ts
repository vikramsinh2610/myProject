import { devLog } from "@/helpers/logger";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVICE_BASE_URL;
axios.defaults.headers.get["Accept"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";

axios.interceptors.request.use(
  (config: any) => {
    const user: any = localStorage.getItem("user");

    if (user) {
      config.headers["Authorization"] = `Bearer ${
        JSON.parse(user)?.user?.accessToken
      }`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      return (window.location.href = "/login");
    }
  }
);

const http = {
  request: axios,
  create: axios.create,
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
};

export default http;
