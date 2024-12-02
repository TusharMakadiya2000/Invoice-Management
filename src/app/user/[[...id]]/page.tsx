"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/common/NavBar";
import Sidebar from "@/components/common/sidebar";
import SecurityDetails from "@/components/common/SecurityDetails";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/common/Input";
import { SHA256 } from "crypto-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Icon from "@/components/common/Icon";

/* ------------------------------ form fields and types ------------------------------ */

interface Users {
  id?: string;
  fullName: string;
  businessName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export default function Home({ params }: { params: { id: string } }) {
  const userId = params.id;
  const [itemId, setItemId] = useState<string>(params.id ? params.id[0] : "");
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<Users[]>([]);
  const isEditMode = !!itemId;
  const [currentPassword, setCurrentPassword] = useState<string>("");

  /* ------------------------------ Define the validation schema ------------------------------ */

  const editModeValidationSchema = yup.object({
    fullName: yup.string().required("Full Name is required"),
    businessName: yup.string().required("Business Name is required"),
    email: yup.string().required("Email is required"),
  });

  const saveModeValidationSchema = yup.object({
    fullName: yup.string().required("Full Name is required"),
    businessName: yup.string().required("Business Name is required"),
    email: yup.string().required("Email is required"),
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

  const validationSchema = isEditMode
    ? editModeValidationSchema
    : saveModeValidationSchema;
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<Users>({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  /* ------------------------------ Get Current Password ------------------------------ */

  const getCurrentPasswordValue = useCallback(() => {
    const currentPasswordValue =
      getValues("currentPassword" as keyof Users) || "";
    setCurrentPassword(currentPasswordValue);
  }, [getValues]);

  /* ------------------------------ Fetch current password value on component mount ------------------------------ */

  useEffect(() => {
    getCurrentPasswordValue();
  }, [getCurrentPasswordValue]);

  /* ------------------------------ Get User By Id ------------------------------ */

  useEffect(() => {
    if (itemId) {
      axios.get(`/api/user/getuser?id=${itemId}`).then((response) => {
        const item = response.data;
        setValue("fullName", item.fullName);
        setValue("businessName", item.businessName);
        setValue("email", item.email);
        trigger();
      });
    } else {
      setValue("fullName", "");
      setValue("businessName", "");
      setValue("email", "");
      setValue("password", "");
      setValue("confirmPassword", "");
    }
  }, [itemId, setValue, trigger]);

  /* ------------------------------ Save & Edit User Data ------------------------------ */

  const onSubmit = async (data: Users) => {
    const requestMethod = itemId ? "put" : "post";
    let url = itemId
      ? `/api/user/updateuser?id=${encodeURIComponent(itemId)}`
      : "/api/user/add";
    const hashedPassword = data.password ?? "";
    data.password = SHA256(hashedPassword).toString();

    const requestData = itemId ? { ...data, id: itemId } : data;
    axios[requestMethod]<Users>(url, requestData)
      .then((response) => {
        if (itemId) {
          const updatedItems = userDetails.map((userDetails) =>
            userDetails.id === itemId ? response.data : userDetails
          );
          setUserDetails(updatedItems);
          toast.success("User Update successfully!");
        } else {
          setUserDetails([...userDetails, response.data]);
          toast.success("User save successfully!");
        }
        setValue("fullName", "");
        setValue("businessName", "");
        setValue("email", "");
      })
      .catch((error) => {
        console.error("Error adding/updating item:", error.message);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex">
          <Sidebar />
          <div className="w-full flex flex-col place-items-end dark:bg-fgc-dark">
            <Header />
            <div className="flex justify-items-center place-items-center p-4 md:p-4 w-full  text-sm sm:w-[calc(100%-310px)] mt-[60px] sm:mt-[80px]">
              <div className="w-full p-6 shadow-lg bg-white rounded-md dark:bg-bgc-dark">
                <div className="flex items-center justify-between mb-3 border-b border-gray-200">
                  <div></div>
                  <h1 className="text-xl font-bold pb-3">
                    {itemId ? "Edit User" : "Add User"}
                  </h1>
                  <Icon
                    icon="x"
                    className="h-5 w-5 lg:h-8 lg:w-8 hover:cursor-pointer"
                    onClick={() => router.replace("/users")}
                  />
                </div>
                <h2 className="text-lg font-semibold mb-2">Personal Details</h2>

                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 justify-items-center gap-4">
                    <div className="col-span-3 md:col-span-1 w-full">
                      <Input
                        preIcon="pencil"
                        label="Full Name"
                        type="text"
                        placeholder="Enter Full Name"
                        name="fullName"
                        register={register}
                        error={errors?.fullName?.message?.toString()}
                      />
                    </div>
                    <div className="col-span-3 md:col-span-1 w-full">
                      <Input
                        preIcon="annotation"
                        label="Business Name"
                        type="text"
                        placeholder="Enter Business Name"
                        name="businessName"
                        register={register}
                        error={errors?.businessName?.message?.toString()}
                      />
                    </div>
                    <div className="col-span-3 md:col-span-1 w-full">
                      <Input
                        preIcon="mail"
                        label="Email"
                        type="email"
                        placeholder="Enter Your Email"
                        name="email"
                        register={register}
                        error={errors?.email?.message?.toString()}
                      />
                    </div>
                  </div>

                  {isEditMode && (
                    <div className="flex justify-end items-center gap-4">
                      <button
                        className="w-24 h-10 border rounded-lg text-white font-bold tracking-wider bg-gbgc"
                        type="submit"
                        onClick={() => router.replace("/users")}
                      >
                        Update
                      </button>
                    </div>
                  )}
                  {isEditMode && (
                    <SecurityDetails
                      currentPassword={currentPassword}
                      password={""}
                      confirmPassword={""}
                      userId={userId[0]}
                    />
                  )}
                  {!isEditMode && (
                    <>
                      <div className="grid grid-cols-2 justify-items-center gap-4">
                        <div className="col-span-2 md:col-span-1 w-full">
                          <Input
                            preIcon="lock-closed"
                            label="Password"
                            type="password"
                            placeholder="Enter your Password"
                            name="password"
                            register={register}
                            error={errors?.password?.message?.toString()}
                          />
                        </div>
                        <div className="col-span-2 md:col-span-1 w-full">
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
                      <div className="mt-2 flex justify-end items-center gap-4">
                        <button
                          className="w-24 h-10 border rounded-lg text-white font-bold tracking-wider bg-gbgc"
                          type="submit"
                          onClick={() => router.replace("/users")}
                        >
                          Save
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
