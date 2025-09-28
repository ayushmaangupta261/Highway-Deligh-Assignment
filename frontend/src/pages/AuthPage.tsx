import React, { useState } from "react";
import signupImage from "../assets/auth/signupImage.png";
import SignUp from "../component/auth/SignUp";
import SignIn from "../component/auth/SignIn"; // Create a Login component

export const AuthPage: React.FC = () => {
  const [authType, setAuthType] = useState<"signup" | "signin">("signup");

  return (
    <div className="h-screen w-full flex">
      {/* Left Side: Form */}
      <div className="w-1/2 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          {authType === "signup" ? (
            <>
              <SignUp />
              <p className="text-center mt-4">
                Already have an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer hover:underline"
                  onClick={() => setAuthType("signin")}
                >
                  Sign in
                </span>
              </p>
            </>
          ) : (
            <>
              <SignIn />
              <p className="text-center mt-4">
               Need an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer hover:underline"
                  onClick={() => setAuthType("signup")}
                >
                  Sign Up
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="w-1/2">
        <img
          src={signupImage}
          alt="Auth"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
