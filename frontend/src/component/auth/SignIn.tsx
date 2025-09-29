import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { sendLoginOtp, verifyLoginOtp } from "../../services/operations/authApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";

type SignInFormValues = {
  email: string;
  otp: string;
  keepMeLoggedIn: boolean;
};

const SignIn: React.FC = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignInFormValues>();

  const inputClass = `peer w-full border rounded-md px-3 pt-5 pb-2 text-sm
        border-[#9A9A9A] focus:border-[#367AFF] focus:outline-none`;

  const labelClass = `absolute left-3 top-1 text-gray-400 text-sm transition-all bg-white px-2
        peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500
        peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm`;

  // Send OTP
  const handleSendOtp = async () => {
    const email = watch("email");

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      await sendLoginOtp({ email });

      setOtpSent(true);
      setTimer(30);
    } catch (error: any) {
      console.error(error.message || "Failed to send OTP");
    }
  };

  // Timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Submit OTP
  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    try {
      const response = await verifyLoginOtp({ email: data.email, otp: data.otp });
      console.log("OTP verified successfully", response);

      dispatch(setCredentials({ token: response.token, user: response.user }))
      navigate("/dashboard")

    } catch (error: any) {
      console.log(error.message || "OTP verification failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 flex flex-col gap-y-[2rem]">
      <div>
        <h1 className="text-2xl font-bold mb-1">Sign In</h1>
        <p className="text-[#969696] text-sm mt-3">
          Please login to continue to your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            placeholder=" "
            className={inputClass}
            disabled={otpSent}
          />
          <label className={labelClass}>Email</label>
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        {/* Send OTP Button */}
        {!otpSent && (
          <button
            type="button"
            onClick={handleSendOtp}
            className="text-sm text-[#367AFF]  cursor-pointer w-[4rem] ml-1"
          >
            Send OTP
          </button>
        )}

        {/* OTP Input */}
        {otpSent && (
          <>
            <div className="relative">
              <input
                type="text"
                {...register("otp", {
                  required: "OTP is required",
                  minLength: { value: 4, message: "OTP must be 4 digits" },
                  maxLength: { value: 6, message: "OTP must be max 6 digits" },
                })}
                placeholder=" "
                className={inputClass}
              />
              <label className={labelClass}>OTP</label>
              {errors.otp && (
                <span className="text-red-500 text-xs">{errors.otp.message}</span>
              )}
            </div>

            {/* Resend OTP */}
            <button
              type="button"
              onClick={timer === 0 ? handleSendOtp : undefined}
              disabled={timer > 0}
              className={`text-sm mt-2 w-[8rem] ${timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-[#367AFF]"}`}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>

            {/* Keep me logged in */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                defaultChecked={true}
                {...register("keepMeLoggedIn")}
                className="h-4 w-4 border-[#9A9A9A] text-[#367AFF] focus:ring-[#367AFF]"
              />
              <label className="text-sm text-gray-700">Keep me logged in</label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>

            
          </>
        )}
      </form>
    </div>
  );
};

export default SignIn;
