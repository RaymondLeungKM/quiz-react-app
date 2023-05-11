import axios from "axios";
import { enqueueSnackbar } from "notistack";
import jwt_decode from "jwt-decode";

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
  async (error) => {
    // JWT expired, try to fetch a JWT token
    if (error.response.data && error.response.data.code == "E403JWT") {
      // enqueueSnackbar("JWT expired!", {
      //   variant: "error",
      // });
      const refresh_token = sessionStorage.getItem("refresh_token");
      let apiResponse = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/token",
        { refresh_token }
      );
      sessionStorage.setItem("jwt", apiResponse.data.access_token);
      error.config.headers[
        "Authorization"
      ] = `Bearer ${apiResponse.data.access_token}`;
      return axios(error.config);
    } else {
      return Promise.reject(error);
    }
    throw error;
  }
);

// jwtInterceoptor.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     if (error.response.status === 401) {
//       const authData = JSON.parse(localStorage.getItem("tokens"));
//       const payload = {
//         access_token: authData.access_token,
//         refresh_token: authData.refreshToken,
//       };

//       let apiResponse = await axios.post(
//         "http://localhost:4000/auth/refreshtoken",
//         payload
//       );
//       localStorage.setItem("tokens", JSON.stringify(apiResponse.data));
//       error.config.headers[
//         "Authorization"
//       ] = `bearer ${apiResponse.data.access_token}`;
//       return axios(error.config);
//     } else {
//       return Promise.reject(error);
//     }
//   }
// );

export default instance;
