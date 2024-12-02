// SecurityDetails.tsx
import React from "react";
import { Input } from "@/components/common/Input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import router from "next/router";
import { SHA256 } from "crypto-js";
import axios from "axios";

interface Props {
  currentPassword: string;
  password: string;
  confirmPassword: string;
  userId?: string;
}

const SecurityDetails: React.FC<Props> = ({ userId }) => {
  const ValidationSchema = yup.object({
    currentPassword: yup
      .string()
      .required("CurrentPassword is required")
      .min(8, "Current Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@])[a-zA-Z\d@]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
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
    formState: { errors },
  } = useForm<Props>({
    resolver: yupResolver(ValidationSchema),
    mode: "all",
  });
  // changepassword
  const onSubmit = async (formData: Props) => {
    try {
      if (userId) {
        console.log("formData.currentPassword", formData);
        const result = await axios(`/api/user/changepassword`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            currentPassword: SHA256(formData.currentPassword).toString(),
            password: SHA256(formData.password).toString(),
            userId: userId,
          }),
        });
        console.log("result.....", result);
        if (!result) {
          // throw new Error(`Failed to change password : ${result.statusText}`);
        } else {
          toast.success("Password changed successfully!");
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error);
    }
  };

  return (
    <div className="">
      <h2 className="text-lg font-semibold mb-2">Security Details</h2>
      <div className="grid grid-cols-3 justify-items-center gap-4">
        <div className="col-span-3 md:col-span-1 w-full">
          <Input
            preIcon="lock-closed"
            label="Current Password"
            type="password"
            placeholder="Enter your Current Password"
            name="currentPassword"
            register={register}
            error={errors?.currentPassword?.message?.toString()}
          />
        </div>
        <div className="col-span-3 md:col-span-1 w-full">
          <Input
            preIcon="lock-closed"
            label="New Password"
            type="password"
            placeholder="Enter your New Password"
            name="password"
            register={register}
            error={errors?.password?.message?.toString()}
          />
        </div>
        <div className="col-span-3 md:col-span-1 w-full">
          <Input
            preIcon="lock-closed"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your Password"
            name="confirmPassword"
            register={register}
            error={errors?.confirmPassword?.message?.toString()}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end items-center gap-4">
        <button
          className="w-24 h-10 border rounded-lg text-white font-bold tracking-wider bg-gbgc"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          Change
        </button>
      </div>
    </div>
  );
};

export default SecurityDetails;
