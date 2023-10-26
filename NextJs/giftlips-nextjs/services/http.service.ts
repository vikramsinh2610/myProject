import axios from "axios";
import { signOut } from "next-auth/react";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVICE_BASE_URL;
axios.defaults.headers.get["Accept"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";

axios.interceptors.request.use(
  (config: any) => {
    const user: any = localStorage.getItem("user");

    if (user) {
      config.headers["Authorization"] = `Bearer ${
        JSON.parse(user).user.accessToken
      }`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    // Access Token was expired
    if (err.response.status === 401 || err.response.status === 403) {
      signOut({ redirect: false });
    } else if (err.config.url.includes("/cards")) {
      localStorage.clear();
      // window.location.href = "/login";
    }
    return Promise.reject(err);
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
