import { send } from "process";

const BASE_URL = (import.meta.env as any).VITE_APP_BASE_URL;



export const authEndpoint = {
    send_signup_otp: BASE_URL + "/api/auth/send-signup-otp",
    verify_signup_otp : BASE_URL + "/api/auth/signup",
    send_login_otp : BASE_URL + "/api/auth/send-login-otp",
    verify_login_otp : BASE_URL + "/api/auth/login",
};