import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { googleLogin } from "../../services/operations/authApi"; // your API function
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import googleIcon from "../../assets/auth/google.png"

const GoogleLoginButton: React.FC = () => {
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        if (!response.access_token) throw new Error("Google access token missing");

       
        const res = await googleLogin({ tokenId: response.access_token });

        if (res.user && res.token) {
          dispatch(setCredentials({ user: res.user, token: res.token }));
          toast.success("Logged in successfully");
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Google login failed");
      }
    },
    onError: () => {
      toast.error("Google login failed");
    },
  });

  return (
    <div className=" flex flex-col items-center ">

      <div

        className=""
      >
        <img
          src={googleIcon}
          alt="Google Icon"
          className="w-[5rem] cursor-pointer "
          onClick={() => login()}
        />

      </div>
    </div>
  );
};

export default GoogleLoginButton;
