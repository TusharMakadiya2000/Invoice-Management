"use client";
import { Input } from "@/components/common/Input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SHA256 } from "crypto-js";

export type userFormType = {
  password: string;
  confirmPassword: string;
};

export default function Resetpassword({
  params,
}: {
  params: { email: string };
}) {
  const userEmail = params.email;
  console.log("userEmail", userEmail);
  const router = useRouter();

  const validationSchema = yup.object({
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@])[a-zA-Z\d@]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password"), ""], "Passwords must match"),
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<userFormType>({
    resolver: yupResolver(validationSchema),
  });

  const handleResetPassword = async (formData: userFormType) => {
    try {
      const password = SHA256(formData.password).toString();
      const response = await fetch("/api/user/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail, password }),
      });

      if (response.ok) {
        // Password reset successfully
        console.log("Password reset successfully");
        // Redirect to login page or any other page
        router.push("/login");
      } else {
        // Handle errors
        console.error("Failed to reset password:", await response.text());
      }
    } catch (error) {
      console.error("Failed to reset password:", error);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit((req: userFormType) => handleResetPassword(req))}
      >
        <div className="flex justify-center items-center bg-bgc dark:bg-fgc-dark min-h-screen">
          <div className="md:grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 lg:mt-0">
            <div className="hidden md:grid col-span-1">
              <div className="m-auto grid gap-14 justify-around">
                <div className="flex justify-center items-center flex-col">
                  <div className="w-full text-center lg:w-2/3 text-2xl lg:text-4xl font-extrabold leading-[120%]">
                    Manage your work more effectively
                  </div>
                </div>
                <Image
                  src="/work.svg"
                  height={500}
                  width={500}
                  alt=""
                  className="max-w-full h-auto md:max-w-xl w-80 lg:w-[500px]"
                />
              </div>
            </div>
            <div className="grid col-span-1">
              <div className="mt-6 md:mt-0 w-full md:w-[450px] m-auto grid gap-8 p-4 lg:p-6 shadow-lg bg-white dark:bg-bgc-dark rounded-md my-10">
                <div className="flex justify-center items-center flex-col gap-6 mt-6">
                  <Image
                    src="/user.svg"
                    height={999}
                    width={999}
                    alt=""
                    className="w-[110px] h-[90px] rounded-full"
                  />
                  <h1 className="font-bold text-2xl">Reset Password</h1>
                </div>
                <div className="w-full">
                  <Input
                    label="Password"
                    preIcon="lock-closed"
                    name="password"
                    type="password"
                    placeholder="Password"
                    register={register}
                    error={errors?.password?.message?.toString()}
                  />
                </div>
                <div className="w-full">
                  <Input
                    preIcon="lock-closed"
                    label="confirm Password"
                    type="password"
                    placeholder="Confirm your Password"
                    name="confirmPassword"
                    register={register}
                    error={errors?.confirmPassword?.message?.toString()}
                  />
                </div>

                <div className="mb-6">
                  <button className="w-full lg:p-3 p-3 text-white bg-gbgc text-sm font-bold rounded">
                    Change
                  </button>
                  <div className="flex space-x-2 justify-center mt-2">
                    <div> You have an account?</div>
                    <Link
                      href="/login"
                      type="button"
                      className="text-gbgc  font-medium hover:underline focus:outline-none"
                      // onClick={handleForgotPassword}
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
