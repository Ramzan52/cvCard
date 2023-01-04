import { create } from "apisauce";
import notificationSvc from "./notification-service";
import spinnerSvc from "./spinner-service";
import authSvc from "../services/auth-service"
export const api = create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { Accept: "application/json" },
});

api.axiosInstance.interceptors.request.use(
  async (config) => {
    spinnerSvc.start();

    const token = localStorage.getItem("idToken") || "";

    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.axiosInstance.interceptors.response.use(
  (response) => {
    spinnerSvc.stop();
    return response;
  },
  async (err) => {
    spinnerSvc.stop();

    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const accessToken = await authSvc.refresh();

      if (accessToken) {
        api.axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken;
        return api.axiosInstance(originalRequest);
      } else {
        authSvc.logout();
        return;
      }
    }

    console.error(err.response.data);
    const errorMessage = (err.response.data && err.response.data.message) || err.response.data;
    switch (err.response?.status) {
      case 400:
        notificationSvc.error(errorMessage);
        break;
      
      case 401:
        notificationSvc.error("You are not authorized to perform this action.");
        break;

      default:
        notificationSvc.error("Something went wrong. Please contact system administrator.");
        break;
    }
    
    console.error(err);
    spinnerSvc.stop();
    return;
  
  }

);