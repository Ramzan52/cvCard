import { create } from "apisauce";
import { toast } from "react-toastify";
import { BehaviorSubject } from "rxjs";
import notificationSvc from "./notification-service";
import spinnerSvc from "./spinner-service";

export const authApi = create({
  baseURL: process.env.REACT_APP_AUTH_BASE_URL,
  headers: { Accept: "application/json" },
});

authApi.axiosInstance.interceptors.request.use((config) => {
  spinnerSvc.start();
  return config;
});

authApi.axiosInstance.interceptors.response.use(
  (response) => {
    spinnerSvc.stop();
    return response;
  },
  (error) => {
    console.error("Invalid Username / Password");
    spinnerSvc.stop();
    return null;
  }
);

class AuthService {
  lastRefreshedAt = new Date();
  isValidating$ = new BehaviorSubject(false);
  role="";
  constructor() {
    // setInterval(() => {
    //   this.refreshExpiringToken();
    // }, 10000);
  }
  async changePassword(oldPassword, newPassword) {
    try {
      const token = localStorage.getItem("idToken") || "";     
       const response = await authApi.post("/change-password", { password:oldPassword, newPassword:newPassword },{
        headers: {
            'authorization': token,
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        }
    });

      if (response.ok) {
        toast("Password updated");
      } 

     
    } catch (err) {
      console.error(JSON.stringify(err));
      notificationSvc.error("Invalid old password");
      return false;
    }
  }
  async login(username, password) {
    try {
      const response = await authApi.post("login", { username, password });

      if (response.ok) {
        const splited = response.data.token.split(".")[1];
        const jsonData = JSON.parse(atob(splited));

        if (jsonData.role === "admin" || jsonData.role === "site-admin") {
          this.role=jsonData.role;
          this.lastRefreshedAt = new Date();
          localStorage.setItem("idToken", response.data.token);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          localStorage.setItem("loggedIn", true);
          return true;
        } else {
          toast("You Are UnAuthorized to Login", { type: "error" });
          return false;
        }
      } else {
        toast("Invalid username / password");
      }

      notificationSvc.error("Invalid username / password");
      return false;
    } catch (err) {
      console.error(JSON.stringify(err));

      return false;
    }
  }

  async refresh() {
    const token = localStorage.getItem("idToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await authApi.post("refresh", { token, refreshToken });

    if (response.ok) {
      this.lastRefreshedAt = new Date();

      const { token, refreshToken } = response.data;

      localStorage.setItem("idToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("loggedIn", true);

      return { isLoggedIn: true, token };
    }

    return false;
  }

  // async refreshExpiringToken() {
  //   if (
  //     this.lastRefreshedAt.getTime() + 29 * 60 * 1000 <
  //     new Date().getTime()
  //   ) {
  //     this.refresh();
  //   }
  // }

  async validate() {
    this.isValidating$.next(true);
    const response = await this.refresh();
    this.isValidating$.next(false);
    return response;
  }
}

const authSvc = new AuthService();
export default authSvc;
