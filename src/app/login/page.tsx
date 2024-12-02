"use client";
import { Input } from "@/components/common/Input";
import Image from "next/image";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SHA256 } from "crypto-js";
import Link from "next/link";

export type userFormType = {
  error(arg0: string, error: any): unknown;
  success: any;
  email: string;
  password: string;
};

// Define the validation schema
const validationSchema = yup.object({
  email: yup.string().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@])[a-zA-Z\d@]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export default function Home() {
  const router = useRouter();
  const session = useSession();
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userFormType>({
    resolver: yupResolver(validationSchema) as any,
    mode: "all",
  });

  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [session, router]);
  const onSubmit = async (formData: userFormType) => {
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: SHA256(formData.password).toString(),
        redirect: false,
      });
      if (result?.error) {
        throw new Error(result?.error);
      } else {
        toast.success("Login successful!", { autoClose: 2000 });
        router.push("/ourservices");
      }
    } catch (error: any) {
      let errorMessage = error.message;
      if (errorMessage.startsWith("Error:")) {
        errorMessage = errorMessage.slice("Error:".length);
      }
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit((req: userFormType) => onSubmit(req))}>
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
                  <h1 className="font-bold text-2xl">Login</h1>
                </div>
                <div className="w-full">
                  <Input
                    label="Email"
                    preIcon="mail"
                    name="email"
                    type="text"
                    placeholder="info12@gmail.com"
                    register={register}
                    error={errors?.email?.message?.toString()}
                  />
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
                <div className="-mt-2 mb-5">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="mr-2"
                  />
                  <label htmlFor="rememberMe">Remember</label>
                  <div className="text-right">
                    <Link
                      href="/forgot-password"
                      type="button"
                      className="text-gbgc text-sm font-medium hover:underline focus:outline-none"
                      // onClick={handleForgotPassword}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-red-500 text-sm">{errorMessage}</div>
                )}
                <div className="mb-6">
                  <button className="w-full lg:p-3 p-3 text-white bg-gbgc text-sm font-bold rounded">
                    LOGIN
                  </button>
                  <div className="flex space-x-2 justify-center mt-2">
                    <div> Don&apos;t have an account?</div>
                    <Link
                      href="/register"
                      type="button"
                      className="text-gbgc  font-medium hover:underline focus:outline-none"
                      // onClick={handleForgotPassword}
                    >
                      Register
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
