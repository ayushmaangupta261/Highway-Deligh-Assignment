import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { sendSignUpOtp, verifySignupOtp } from "../../services/operations/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";

type FormValues = {
    name: string;
    dob: string;
    email: string;
    otp: string;
};

const SignUp: React.FC = () => {
    const [otpSent, setOtpSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(0); // seconds until resend
    const RESEND_COOLDOWN = 30; // 30 seconds cooldown
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValues>();

    const startResendTimer = () => {
        setResendTimer(RESEND_COOLDOWN);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendTimer > 0) {
            timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendTimer]);

    const handleSendOtp = async () => {
        const { name, email, dob } = watch(); //  current values
        if (!name || !email || !dob) {
            toast.error("Please fill all the details");
            return;
        }

        await sendSignUpOtp({ name, email, dob });
        setOtpSent(true);
        startResendTimer();
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        console.log("Form Data:", data);



        const response = await verifySignupOtp({ email: data.email, otp: data.otp })
        dispatch(setCredentials({ token: response.token, user: response.user }))
        console.log("OTP verified successfully, proceed to next step -> ", response);

        navigate("/dashboard")

    };

    const inputClass = `peer w-full border rounded-md px-3 pt-5 pb-2 text-sm
    border-[#9A9A9A] focus:border-[#367AFF] focus:outline-none`;

    const labelClass = `absolute left-3 top-1 text-gray-400 text-sm transition-all bg-white px-2
    peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500
    peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm`;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 flex flex-col gap-y-[2rem]">
            <div>
                <h1 className="text-2xl font-bold mb-1">Sign Up</h1>
                <p className="text-[#969696] text-sm mt-3">Sign up to enjoy features of HD</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div className="relative">
                    <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        placeholder=" "
                        className={inputClass}
                        disabled={otpSent}
                    />
                    <label className={labelClass}>Your Name</label>
                    {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                </div>

                {/* DOB */}
                <div className="relative">
                    <input
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        {...register("dob", { required: "Date of Birth is required" })}
                        placeholder=" "
                        className={inputClass}
                        disabled={otpSent}
                    />
                    <label className={labelClass}>Date of Birth</label>
                    {errors.dob && <span className="text-red-500 text-xs">{errors.dob.message}</span>}
                </div>

                {/* Email */}
                <div className="relative">
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                        })}
                        placeholder=" "
                        className={inputClass}
                        disabled={otpSent}
                    />
                    <label className={labelClass}>Email</label>
                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                </div>

                {/* Send OTP / Resend OTP Button */}
                {!otpSent && (
                    <button type="button" onClick={handleSendOtp} className="w-full bg-[#367AFF] rounded-md text-white py-2">
                        Get OTP
                    </button>
                )}
                {otpSent && (
                    <button
                        type="button"
                        onClick={handleSendOtp}
                        className={`w-full rounded-md py-2 ${resendTimer > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#367AFF] text-white"
                            }`}
                        disabled={resendTimer > 0}
                    >
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                    </button>
                )}

                {/* OTP Input */}
                {otpSent && (
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
                        {errors.otp && <span className="text-red-500 text-xs">{errors.otp.message}</span>}
                    </div>
                )}

                {/* Submit */}
                {otpSent && (
                    <button type="submit" className="w-full rounded-md bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        Sign Up
                    </button>
                )}
            </form>
        </div>
    );
};

export default SignUp;
