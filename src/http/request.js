import axios from "axios";
import { getToken, removeToken } from "@/composables/auth";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || "/api",
  timeout: 50000,
});

service.interceptors.request.use(
  function (config) {
    const token = getToken();
    if (token) {
      // 后端 LoginInterceptor 读取的是 Authorization
      config.headers.Authorization = token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    const msg = error?.response?.data?.msg || error.message || "请求失败";
    const status = error?.response?.status;

    if (status === 401 || msg === "非法token，请先登录") {
      removeToken();
      if (location.pathname !== "/login") {
        location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default service;
