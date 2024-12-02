"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/common/Input";
import axios from "axios";
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Country, State, City } from "country-state-city";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Icon from "@/components/common/Icon";
import Sidebar from "@/components/common/sidebar";
import Header from "@/components/common/NavBar";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@/components/common/Button";
import { useAppState } from "@/utils/useAppState";
import { IUser } from "@/components/models/user";
type Address = {
  country: string;
  state: string;
  city: string;
  zipcode: number;
  address1: string;
  address2: string;
};

type Service = {
  title: string;
  serialNo: string;
  hsnSac: string;
  quantity: number;
  amount: number;
  gst: number;
};

type FormData = {
  id?: string;
  customerName: string;
  mobileNumber: string;
  invoiceDate: Date | null;
  address: Address;
  vehicleCompany: string;
  vehicleVariant: string;
  vehicleNo: string;
  kilometers: number;
  nextkilometer: number;
  services: Service[];
  createdBy?: string;
  createdOn?: Date;
  updatedBy?: string;
  updatedOn?: Date;
};

const validationSchema = yup.object().shape({
  customerName: yup.string().required("Customer Name is required"),
  mobileNumber: yup
    .string()
    .required("Mobile Number is required")
    .matches(/^[0-9]+$/, "Mobile Number must contain only digits")
    .min(10, "Mobile Number must be 10 digits")
    .max(10, "Mobile Number must be 10 digits"),
  invoiceDate: yup.date().required("Invoice Date is required").nullable(),
  address: yup.object().shape({
    country: yup.string().required("Country is required"),
    state: yup.string().required("State is required"),
    city: yup.string().required("City is required"),
    zipcode: yup
      .number()
      .required("zipcode is required")
      .typeError("zipcode is Required")
      .min(1),
    address1: yup.string().required("Apartment/Flat is required"),
    address2: yup.string().optional(),
  }),
  vehicleCompany: yup.string().required("Vehicle Company is required"),
  vehicleVariant: yup.string().required("Vehicle Variant is required"),
  vehicleNo: yup.string().required("Vehicle Number is required"),
  kilometers: yup
    .number()
    .required("Kilometers is required")
    .typeError("Kilometers must be a number")
    .min(1, "Kilometers must be at least 1"),
  nextkilometer: yup
    .number()
    .required("Next Kilometer is required")
    .typeError("Next Kilometer must be a number")
    .min(
      yup.ref("kilometers"),
      "Next Kilometer must be greater than Kilometers"
    ),
  services: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Title is required"),
      serialNo: yup
        .string()
        .required("Serial No. is required")
        .typeError("Serial No. is required"),
      hsnSac: yup
        .string()
        .required("HSN/SAC is required")
        .typeError("HSN/SAC is required"),
      quantity: yup
        .number()
        .required("Quantity is required")
        .typeError("Quantity must be a number")
        .min(1, "Quantity must be at least 1"),
      amount: yup
        .number()
        .required("Rate is required")
        .typeError("Rate must be a number")
        .min(1, "Rate must be at least 1"),
      gst: yup
        .number()
        .required("GST(%) is required")
        .typeError("GST(%) must be a number")
        .min(0, "GST(%) must be at least 0"),
    })
  ),
});

export default function Home({ params }: { params: { id: string } }) {
  const [itemId, setItemId] = useState<string>(params.id ? params.id[0] : "");
  const [invoiceDetails, setInvoiceDetails] = useState<FormData[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [citys, setCitys] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const router = useRouter();
  const [{ user }, setAppState] = useAppState();
  useEffect(() => {
    setAppState({ user: "user object" });
    // eslint-disable-next-line
  }, []);

  const getUserDetails = async () => {
    try {
      const { data, status } = await axios.get(
        "/api/user/get-personal-details"
      );

      if (status === 200) {
        setAppState({ user: data as IUser });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line
  }, []);

  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    mobileNumber: "",
    invoiceDate: null,
    address: {
      country: "",
      state: "",
      city: "",
      zipcode: 0,
      address1: "",
      address2: "",
    },
    vehicleCompany: "",
    vehicleVariant: "",
    vehicleNo: "",
    kilometers: 0,
    nextkilometer: 0,
    services: [],
  });
  const {
    handleSubmit,
    register,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      services: [
        {
          title: "",
          serialNo: "1",
          hsnSac: "0",
          quantity: 1,
          amount: 0,
          gst: 0,
        },
      ],
    },
  });
  console.log("errors", errors);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const handleRemoveService = (indexToRemove: number) => {
    remove(indexToRemove);
  };

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
  const handleDateChange = (date: Date | [Date, Date] | null) => {
    if (date instanceof Date) {
      setSelectedDate(date);
      setValue("invoiceDate", date);
    }
  };

  // handle CountryChange submission
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setSelectedState("");
    setCitys([]);
    if (countryCode) {
      const countryStates = State.getStatesOfCountry(countryCode);
      setStates(countryStates);
    } else {
      setStates([]);
    }
  };

  // handle StateChange submission
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);
    setSelectedCity("");
    setCitys([]);
    if (stateCode && selectedCountry) {
      const stateCity = City.getCitiesOfState(selectedCountry, stateCode);
      setCitys(stateCity);
    } else {
      setCitys([]);
    }
  };
  useEffect(() => {
    if (itemId) {
      axios.get(`/api/invoice/getinvoice?id=${itemId}`).then((response) => {
        const item = response.data;
        setValue("customerName", item.customerName);
        setValue("mobileNumber", item.mobileNumber);
        if (item.invoiceDate) {
          setValue("invoiceDate", new Date(item.invoiceDate));
          setSelectedDate(new Date(item.invoiceDate));
        }

        setValue("address.country", item.address.country);
        setSelectedCountry(item.address.country);
        if (item.address.country) {
          const countryStates = State.getStatesOfCountry(item.address.country);
          setStates(countryStates);
          setValue("address.state", item.address.state);
          setSelectedState(item.address.state);

          // Fetch cities based on the retrieved state
          if (item.address.state) {
            const stateCity = City.getCitiesOfState(
              item.address.country,
              item.address.state
            );
            setCitys(stateCity);
            setValue("address.city", item.address.city);
            setSelectedCity(item.address.city);
          }
        }
        setValue("address.zipcode", item.address.zipcode);
        setValue("address.address1", item.address.address1);
        setValue("address.address2", item.address.address2);

        setValue("vehicleCompany", item.vehicleCompany);
        setValue("vehicleVariant", item.vehicleVariant);
        setValue("vehicleNo", item.vehicleNo);
        setValue("kilometers", item.kilometers);
        setValue("nextkilometer", item.nextkilometer);

        // if (item.services.length > -1) {
        //   item.services.forEach((_: any, index: any) => {
        //     append({
        //       title: "",
        //       serialNo: "",
        //       hsnSac: "",
        //       quantity: 0,
        //       amount: 0,
        //       gst: 0,
        //     });
        //   });

        //   item.services.forEach((service: any, index: any) => {
        //     // Populate each service field using setValue
        //     setValue(
        //       `services[${index}].title` as keyof FormData,
        //       service.title
        //     );
        //     setValue(
        //       `services[${index}].serialNo` as keyof FormData,
        //       service.serialNo
        //     );
        //     setValue(
        //       `services[${index}].hsnSac` as keyof FormData,
        //       service.hsnSac
        //     );
        //     setValue(
        //       `services[${index}].quantity` as keyof FormData,
        //       service.quantity
        //     );
        //     setValue(
        //       `services[${index}].amount` as keyof FormData,
        //       service.amount
        //     );
        //     setValue(`services[${index}].gst` as keyof FormData, service.gst);
        //   });
        // }
        const initialServices = item.services.map(
          (service: any, index: any) => ({
            title: service.title,
            serialNo: service.serialNo,
            hsnSac: service.hsnSac,
            quantity: service.quantity,
            amount: service.amount,
            gst: service.gst,
          })
        );

        initialServices.forEach((service: any, index: any) => {
          setValue(`services[${index}].title` as keyof FormData, service.title);
          setValue(
            `services[${index}].serialNo` as keyof FormData,
            service.serialNo
          );
          setValue(
            `services[${index}].hsnSac` as keyof FormData,
            service.hsnSac
          );
          setValue(
            `services[${index}].quantity` as keyof FormData,
            service.quantity
          );
          setValue(
            `services[${index}].amount` as keyof FormData,
            service.amount
          );
          setValue(`services[${index}].gst` as keyof FormData, service.gst);
        });
        setValue("services", initialServices);
        trigger();
      });
    } else {
    }
  }, [itemId, setValue, trigger]);

  const handleAddService = () => {
    append({
      title: "",
      serialNo: "0",
      hsnSac: "0",
      quantity: 0,
      amount: 0,
      gst: 0,
    });
  };

  const onSubmit = async (data: FormData) => {
    const userId = user._id;
    console.log("userId", userId);
    const requestData = {
      ...data,
      createdBy: userId,
      createdOn: new Date(),
      updatedBy: userId,
      updatedOn: new Date(),
    };
    try {
      const requestMethod = itemId ? "put" : "post";
      let url = itemId
        ? `/api/invoice/updateinvoice?id=${encodeURIComponent(itemId)}`
        : "/api/invoice/add";
      const response = await axios[requestMethod]<FormData>(url, requestData);
      if (itemId) {
        const updatedItems = invoiceDetails.map((invoiceDetails) =>
          invoiceDetails.id === itemId ? response.data : invoiceDetails
        );
        setInvoiceDetails(updatedItems);
        toast.success("Invoice Update successfully!");
      } else {
        setInvoiceDetails([...invoiceDetails, response.data]);
        toast.success("Invoice save successfully!");
      }
      router.replace("/invoices");
    } catch (error: any) {
      console.error("Error adding/updating item:", error.message);
      toast.error("Error occurred while saving the invoice.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full flex flex-col place-items-end dark:bg-fgc-dark">
        <Header />
        <div className="p-2 md:p-4 w-full  text-sm sm:w-[calc(100%-310px)] mt-[60px] sm:mt-[80px]">
          <div className="w-full relative border-b border-border dark:border-border-dark">
            <Button
              className="	absolute left-0 rounded-lg  pr-2 !p-1 font-bold opacity-70 !gap-0"
              type="button"
              onClick={() => {
                router.push("/invoices");
              }}
            >
              <Icon icon="chevron-left" className="h-5 w-5" />
              Back
            </Button>

            <div className="text-xl font-bold mb-3 text-center ">
              {itemId ? "Edit Invoice" : "Add Invoice"}
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5 mt-5">
              <h1 className="font-bold text-lg">Customer Details :</h1>
              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-3 md:col-span-1 w-full">
                  <Input
                    label="Customer Name"
                    type="text"
                    placeholder="Enter Customer Name"
                    name="customerName"
                    register={register}
                    error={errors?.customerName?.message?.toString()}
                  />
                </div>
                <div className="col-span-3 md:col-span-1 w-full">
                  <Input
                    label="Mobile Number"
                    type="text"
                    placeholder="Enter Mobile Number"
                    name="mobileNumber"
                    register={register}
                    error={errors?.mobileNumber?.message?.toString()}
                  />
                </div>
                <div className="col-span-3 md:col-span-1 w-full">
                  <label className="flex flex-col md:flex-row md:items-center gap-x-2 font-semibold ">
                    Invoice Date :
                  </label>
                  <div className="pt-1 w-full">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        handleDateChange(date);
                        setValue("invoiceDate", date);
                      }}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="Select Date"
                      maxDate={new Date()}
                      className="!w-full rounded border dark:border-border-dark dark:bg-fgc-dark px-2.5 py-2
    text-textSecondary focus:border-dark disabled:cursor-not-allowed dark:disabled:bg-disable-dark dark:border-darkBorder dark:text-text-dark"
                    />
                  </div>
                  {errors?.invoiceDate?.message && (
                    <div className="text-red-600">
                      {errors.invoiceDate.message}
                    </div>
                  )}
                </div>
                <div className="col-span-3 md:col-span-1 w-full">
                  <label className="font-semibold">Country:</label>
                  <select
                    className="w-full border border-border rounded-md mt-1 p-2 dark:bg-fgc-dark dark:border-border-dark"
                    value={selectedCountry}
                    {...register("address.country")}
                    onChange={handleCountryChange}
                  >
                    <option value="">Select Country</option>
                    {countries.map((Country, index) => (
                      <option key={index} value={Country.code}>
                        {Country.name}
                      </option>
                    ))}
                  </select>
                  {errors?.address?.country?.message?.toString() && (
                    <div className="text-red-600">
                      {errors?.address?.country?.message?.toString()}
                    </div>
                  )}
                </div>

                {/* State selection */}
                <div className="col-span-3 md:col-span-1 w-full">
                  <label className="font-semibold">State:</label>
                  <select
                    className="w-full border border-border rounded-md mt-1 p-2 dark:bg-fgc-dark dark:border-border-dark"
                    value={selectedState}
                    {...register("address.state")}
                    onChange={handleStateChange}
                  >
                    <option value="">Select State</option>
                    {states.map((State, index) => (
                      <option key={index} value={State.isoCode}>
                        {State.name}
                      </option>
                    ))}
                  </select>
                  {errors?.address?.state?.message?.toString() && (
                    <div className="text-red-600">
                      {errors?.address?.state?.message?.toString()}
                    </div>
                  )}
                </div>
                <div className="col-span-3 md:col-span-1 w-full">
                  <label className="font-semibold">City:</label>
                  <select
                    className="w-full border border-border rounded-md mt-1 p-2 dark:bg-fgc-dark dark:border-border-dark"
                    value={selectedCity}
                    {...register("address.city")}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="">Select City</option>
                    {citys.map((City, index) => (
                      <option key={index} value={City.code}>
                        {City.name}
                      </option>
                    ))}
                  </select>
                  {errors?.address?.city?.message?.toString() && (
                    <div className="text-red-600">
                      {errors?.address?.city?.message?.toString()}
                    </div>
                  )}
                </div>
                {/* Zip Code field */}
                <div className="col-span-3 md:col-span-1 w-full">
                  <Input
                    label="Zip Code"
                    type="number"
                    placeholder="Enter Zip Code"
                    name="address.zipcode"
                    register={register}
                    error={errors?.address?.zipcode?.message?.toString()}
                  />
                </div>
                <div className="col-span-3 md:col-span-1 w-full">
                  <Input
                    label="Apartment/Flat"
                    type="text"
                    placeholder="Enter Your Apartment/Flat"
                    name="address.address1"
                    register={register}
                    error={errors?.address?.address1?.message?.toString()}
                  />
                </div>
                {/* Street Address field */}
                <div className="col-span-3 md:col-span-1 w-full">
                  <Input
                    label="Landmark(optional)"
                    type="text"
                    placeholder="Enter Your Landmark (Optional)"
                    name="address.address2"
                    register={register}
                    error={errors?.address?.address2?.message?.toString()}
                  />
                </div>
              </div>
              {/* -------------------------------- End: Customer details fields -------------------------------- */}
              {/* -------------------------------- Start: Vehicle details fields -------------------------------- */}
              <h1 className="font-bold text-lg">Vehicle Details :</h1>
              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-3 md:col-span-1">
                  <Input
                    label="Vehicle Company"
                    type="text"
                    placeholder="Enter Vehicle Company"
                    name="vehicleCompany"
                    register={register}
                    error={errors?.vehicleCompany?.message?.toString()}
                  />
                </div>
                <div className="col-span-3 md:col-span-1">
                  <Input
                    label="Vehicle Model"
                    type="text"
                    placeholder="Enter Vehicle Model"
                    name="vehicleVariant"
                    register={register}
                    error={errors?.vehicleVariant?.message?.toString()}
                  />
                </div>

                <div className="col-span-3 md:col-span-1 w-full">
                  <Input
                    label="Vehicle Number"
                    type="text"
                    placeholder="Enter Vehicle Number"
                    name="vehicleNo"
                    register={register}
                    error={errors?.vehicleNo?.message?.toString()}
                  />
                </div>
                <div className="col-span-3 md:col-span-1 w-full">
                  <Input
                    label="Kilometers"
                    type="number"
                    placeholder="Enter Kilometers"
                    name="kilometers"
                    register={register}
                    error={errors?.kilometers?.message?.toString()}
                  />
                </div>
                <div className="col-span-3 md:col-span-1 w-full">
                  <Input
                    label="Next Kilometer"
                    type="number"
                    placeholder="Enter Next Kilometer"
                    name="nextkilometer"
                    register={register}
                    error={errors?.nextkilometer?.message?.toString()}
                  />
                </div>
              </div>
              {/*-------------------------------- End: Customer details fields --------------------------------*/}

              {/* -------------------------------- Start: Service details fields --------------------------------*/}
              <h1 className="font-bold text-lg">Service Details :</h1>

              {fields.map((service, index) => (
                <div
                  key={index}
                  className="bg-bgc  dark:bg-bgc-dark p-2 rounded-md"
                >
                  <div className="flex gap-2">
                    <h1 className="font-bold text-lg">
                      Service Detail {index + 1} :
                    </h1>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveService(index)}
                        className="font-bold py-1 px-2 rounded"
                      >
                        <Icon icon="trash" className="w-5 h-5 text-red-400" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-5">
                    <div className="col-span-1 w-full">
                      <Input
                        label="Title"
                        type="text"
                        placeholder="Enter Title"
                        name={`services[${index}].title`}
                        register={register}
                        error={errors?.services?.[
                          index
                        ]?.title?.message?.toString()}
                      />
                    </div>
                    <div className="col-span-1 w-full">
                      <Input
                        type="text"
                        label="Sr. No."
                        placeholder="Enter Serial No."
                        name={`services[${index}].serialNo`}
                        register={register}
                        error={errors?.services?.[
                          index
                        ]?.serialNo?.message?.toString()}
                      />
                    </div>
                    <div className="col-span-1 w-full">
                      <Input
                        type="text"
                        label="HSN/SAC"
                        placeholder="Enter HSN/SAC"
                        name={`services[${index}].hsnSac`}
                        register={register}
                        error={errors?.services?.[
                          index
                        ]?.hsnSac?.message?.toString()}
                      />
                    </div>
                    <div className="col-span-1 w-full">
                      <Input
                        type="number"
                        label="Quantity"
                        placeholder="Enter Quantity"
                        name={`services[${index}].quantity`}
                        register={register}
                        error={errors?.services?.[
                          index
                        ]?.quantity?.message?.toString()}
                      />
                    </div>
                    <div className="col-span-1 w-full">
                      <Input
                        label="Rate"
                        type="number"
                        placeholder="Enter Rate"
                        name={`services[${index}].amount`}
                        register={register}
                        error={errors?.services?.[
                          index
                        ]?.amount?.message?.toString()}
                      />
                    </div>
                    <div className="col-span-1 w-full">
                      <Input
                        label="GST(%)"
                        type="number"
                        placeholder="Enter GST(%)"
                        name={`services[${index}].gst`}
                        register={register}
                        error={errors?.services?.[
                          index
                        ]?.gst?.message?.toString()}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-start ">
                <div
                  onClick={handleAddService}
                  className=" flex items-center bg-white dark:text-white text-black font-semibold border-2 dark:border-border-dark dark:bg-fgc-dark py-1 px-4 rounded-full cursor-pointer"
                >
                  <Icon
                    icon="plus"
                    className="h-5 w-5 lg:h-8 lg:w-8"
                    // onClick={handleAddService}
                  />
                  <button type="button" className="">
                    Add Service
                  </button>
                </div>
              </div>
              {/* -------------------------------- End: Customer details fields -------------------------------- */}
              <div className="flex justify-end gap-4">
                <Button type="button" href={"/invoices"}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {itemId ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
