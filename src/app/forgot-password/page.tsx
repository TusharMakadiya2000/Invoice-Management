"use client";

import { Input } from "@/components/common/Input";
import Image from "next/image";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
export type userFormType = {
  email: string;
  otp?: string;
};
export default function ForgotPassword() {
  const router = useRouter();
  const session = useSession();
  const [showOTPFields, setShowOTPFields] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const validationSchema = yup.object({
    email: yup.string().required("Email is required"),
  });

  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [session, router]);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<userFormType>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (formData: userFormType) => {
    console.log("formData", formData);
    try {
      const response = await fetch("/api/user/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("response", response);
      if (!response.ok) {
        throw new Error(`Email doesn't exist.`);
      }

      const result = await response.json();
      console.log("result", result);
      setShowOTPFields(true);
      // router.push("/login");
    } catch (error: any) {
      let errorMessage = error.message;
      if (errorMessage.startsWith("Error:")) {
        errorMessage = errorMessage.slice("Error:".toString());
      }
      toast.error(errorMessage);
    }
  };

  const handleVerifyOTP = async (formData: userFormType) => {
    try {
      const response = await fetch("/api/user/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: decodeURIComponent(formData.email),
          otp: formData.otp,
        }),
      });
      console.log("response", response);
      if (!response.ok) {
        throw new Error(`Invalid OTP.`);
      }
      setOtpVerified(true);
      toast.success("OTP Verifyed");
      handlesubmit(formData);
    } catch (error: any) {
      let errorMessage = error.message;
      if (errorMessage.startsWith("Error:")) {
        errorMessage = errorMessage.slice("Error:".toString());
      }
      toast.error(errorMessage);
    }
  };
  const handlesubmit = (formData: userFormType) => {
    if (otpVerified) {
      router.push("/reset-password/" + formData.email);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit((formData: userFormType) => {
          if (showOTPFields) {
            handleVerifyOTP(formData);
          } else {
            onSubmit(formData);
          }
        })}
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

            <div className="mt-6 md:mt-0 w-full md:w-[450px] m-auto grid gap-8 p-4 lg:p-6 shadow-lg bg-white dark:bg-bgc-dark rounded-md my-10">
              <div className="flex justify-center items-center flex-col gap-6 mt-6">
                <Image
                  src="/user.svg"
                  height={999}
                  width={999}
                  alt=""
                  className="w-[110px] h-[90px] rounded-full"
                />
                <h1 className="font-bold text-2xl">Forgot password</h1>
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
                  disabled={showOTPFields} // Disable email input when OTP fields are shown
                />
              </div>
              {showOTPFields && (
                <>
                  <Input
                    label="OTP"
                    preIcon="mail"
                    name="otp"
                    type="number"
                    placeholder=""
                    register={register}
                    error={errors?.otp?.message?.toString()}
                  />
                </>
              )}
              <button
                type="submit"
                className="flex justify-center h-12 items-center text-white bg-gbgc text-md font-bold rounded"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
