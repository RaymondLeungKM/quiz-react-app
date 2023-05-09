import axios from "axios";
import { enqueueSnackbar } from "notistack";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 1000,
});

instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("jwt");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common.Authorization;
    }
    return config;
  },

  (error) => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // JWT expired, auto logout the user
    if (error.response.data && error.response.data.code == "E403JWT") {
      enqueueSnackbar("JWT expired!", {
        variant: "error",
      });
    }
    throw error;
  }
);

export default instance;
