import { apiConnector } from "../apiconnector";
import { authEndpoint } from "../endpoints/authEndpoints";
import toast from "react-hot-toast";
import { logout } from "../../redux/slices/authSlice";

const { send_signup_otp, verify_signup_otp, send_login_otp, verify_login_otp, google_login_api } = authEndpoint;

interface SignupData {
    name: string;
    email: string;
    dob: string;
}

export const sendSignUpOtp = async (data: SignupData) => {

    const loadingToastId = toast.loading("Sending OTP...");

    try {
        const { name, email, dob } = data;

        console.log("Sending signup OTP to:", email);


        // Validations
        if (!name || name.trim().length < 3) {
            throw new Error("Name must be at least 3 characters long");
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            throw new Error("Invalid email address");
        }

        console.log("api path -> ", send_signup_otp);


        // API call
        const response = await apiConnector("POST", send_signup_otp, { name, email, dob });
        console.log("Signup OTP response ->", response);

        if (response.success === false) {
            throw new Error("Error generating OTP");
        }

        toast.success("OTP sent successfully", { id: loadingToastId });

        return response;
    } catch (error: any) {
        console.error("Error sending signup OTP ->", error);
        toast.error(error.response.data.message || "Something went wrong", { id: loadingToastId }); // update toast to error
        return;
    }
};


interface SignupVerifyData {
    email: string;
    otp: string;
}

export const verifySignupOtp = async (data: SignupVerifyData) => {
    const loadingToastId = toast.loading("Verifying OTP...");
    try {
        const { email, otp } = data;

        // Basic validations
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) throw new Error("Invalid email address");
        if (!otp || otp.length < 4 || otp.length > 6) throw new Error("OTP must be 4-6 digits");

        // API call
        const response = await apiConnector("POST", verify_signup_otp, { email, otp });
        if (response.success === false) throw new Error(response.message || "Error verifying OTP");

        toast.success("Signup successful!", { id: loadingToastId });
        return response; // Contains token and user info
    } catch (error: any) {
        console.error("Error verifying signup OTP ->", error);
        toast.error(error.message || "Something went wrong", { id: loadingToastId });
        return;
    }
};


interface LoginData {
    email: string;
}

export const sendLoginOtp = async (data: LoginData) => {
    const loadingToastId = toast.loading("Sending OTP...");
    try {
        const { email } = data;

        // Basic validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            throw new Error("Invalid email address");
        }

        // API call
        const response = await apiConnector("POST", send_login_otp, { email });
        console.log("Login OTP response ->", response);

        if (response.success === false) {
            throw new Error(response.message || "Error generating OTP");
        }

        toast.success("OTP sent successfully", { id: loadingToastId });
        return response;
    } catch (error: any) {
        console.error("Error sending login OTP ->", error);
        toast.error(error.response.message || "Something went wrong", { id: loadingToastId }); // update toast to error
        return;
    }
};

interface LoginVerifyData {
    email: string;
    otp: string;
}

export const verifyLoginOtp = async (data: LoginVerifyData) => {
    const loadingToastId = toast.loading("Verifying OTP...");
    try {
        const { email, otp } = data;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) throw new Error("Invalid email address");
        if (!otp || otp.length < 4 || otp.length > 6) throw new Error("OTP must be 4-6 digits");

        const response = await apiConnector("POST", verify_login_otp, { email, otp });
        if (response.success === false) throw new Error(response.message || "Error verifying OTP");

        toast.success("Login successful!", { id: loadingToastId });
        return response;
    } catch (error: any) {
        toast.error(error.message || "Something went wrong", { id: loadingToastId });
        return;
    }
};


export const logOutUser = (dispatch: any) => {
    const loadingToastId = toast.loading("Logging Out");
    try {
        dispatch(logout()); // dispatching the logout action
        toast.success("Logged Out Successfully", { id: loadingToastId });
        return;
    } catch (error) {
        toast.error("Log Out Error", { id: loadingToastId });
        console.error("Logout error:", error);
        return;
    }
};



interface GoogleLoginData {
    tokenId: string;
}

export const googleLogin = async (data: GoogleLoginData) => {
    const loadingToastId = toast.loading("Logging in with Google...");
    try {
        const { tokenId } = data;
        if (!tokenId) throw new Error("Google token is missing");

        //  backend API
        const response = await apiConnector("POST", google_login_api, { tokenId });
        if (response.success === false) throw new Error(response.message || "Google login failed");

        toast.success("Login successful!", { id: loadingToastId });
        return response; // { user, token }
    } catch (error: any) {
        toast.error(error.message || "Something went wrong", { id: loadingToastId });
        throw error;
    }
};

