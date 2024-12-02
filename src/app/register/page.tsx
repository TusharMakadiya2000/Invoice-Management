"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Country, State, City } from "country-state-city";
import { Input } from "@/components/common/Input";
import { SHA256 } from "crypto-js";
import { useSession } from "next-auth/react";
import Link from "next/link";

{
  /* ------------------------------ form fields and types ------------------------------ */
}
export type userFormType = {
  fullName: string;
  businessName: string;
  email: string;
  // servieCenterName: string;
  password: string;
  confirmPassword: string;
};

/* ------------------------------ Define the validation schema ------------------------------ */

const validationSchema = yup.object({
  fullName: yup.string().required("FullName is required"),
  businessName: yup.string().required("BusinessName is required"),
  email: yup.string().required("Email is required"),
  // servieCenterName: yup.string().required("ServieCenterName is required"),
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
    .oneOf([yup.ref("password"), " "], "Passwords must match"),
});

/* ------------------------------ State for form data ------------------------------ */

const UserForm = () => {
  useState({
    fullName: " ",
    businessName: " ",
    email: " ",
    // servieCenterName: " ",
    password: " ",
    confirmPassword: " ",
  });

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [citys, setCitys] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const router = useRouter();
  const session = useSession();

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

  /* ------------------------------ handle Country submission ------------------------------ */

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesData = Country.getAllCountries();
        const countriesList = countriesData.map((country: any) => ({
          name: country.name,
          code: country.isoCode,
        }));
        setCountries(countriesList);
      } catch (error) {
        console.error("Error fetching countries", error);
      }
    };

    fetchCountries();
  }, []);

  const onSubmit = async (formData: userFormType) => {
    try {
      formData.password = SHA256(formData.password).toString();
      const response = await fetch("/api/user/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit form: ${response.statusText}`);
      }

      const result = await response.json();
      router.push("/login");
    } catch (error) {
      console.error("Error submitting form:", error);
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
              <div className="w-full md:w-[450px] m-auto grid gap-4 p-4 lg:p-6 shadow-lg bg-white dark:bg-bgc-dark rounded-md">
                <div className="flex justify-center items-center flex-col gap-4">
                  {/* <Image
                    src="/user.svg"
                    height={999}
                    width={999}
                    alt=""
                    className="w-[110px] h-[90px] rounded-full"
                  /> */}
                  <h1 className="font-bold text-2xl">Register</h1>
                </div>
                <div className="w-full">
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
                <div className="w-full">
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
                <div className="w-full">
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
                <div className="w-full">
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
                <div className="flex justify-end items-center">
                  <button
                    className="w-24 h-8 rounded-md text-white font-bold bg-gbgc"
                    id="sub"
                    type="submit"
                  >
                    SUBMIT
                  </button>
                </div>
                <div className="flex space-x-2 justify-center py-2">
                  <div> Already have an account?</div>
                  <Link
                    href="/login"
                    type="button"
                    className="text-gbgc font-medium hover:underline focus:outline-none"
                  >
                    login
                  </Link>
                </div>

                {/* {errorMessage && (
                  <div className="text-red-500 text-sm">{errorMessage}</div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default UserForm;
