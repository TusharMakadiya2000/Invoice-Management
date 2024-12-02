import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Icon from "./Icon";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Dialog, Transition } from "@headlessui/react";
import { Input } from "./Input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { useAppState } from "@/utils/useAppState";
import { IUser } from "../models/user";

interface Vehicles {
  _id?: string;
  userId?: string;
  vehicleName: string;
  vehicleNumber: string;
  vehicleType: string;
  ownerName: string;
  mobileNumber: string;
}
interface MyDialogProps {
  isOpen: boolean;
  setIsOpen: (item: boolean) => void;
  item: Vehicles | null;
}

const EditVehicleModal: React.FC<MyDialogProps> = ({
  isOpen,
  setIsOpen,
  item,
}) => {
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
  };
  const [{ user }, setAppState] = useAppState();
  console.log("user", user);
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicles[]>([]);
  const validationSchema = yup.object({
    vehicleName: yup.string().required("vehicleName is required"),
    vehicleNumber: yup.string().required("vehicleNumber is required"),
    vehicleType: yup.string().required("vehicleType is required"),
    ownerName: yup.string().required("ownerName is required"),
    mobileNumber: yup
      .string()
      .required("Mobile Number is required")
      .matches(/^[0-9]+$/, "Mobile Number must contain only digits")
      .min(10, "Mobile Number must be at least 10 digits")
      .max(10, "Mobile Number cannot exceed 10 digits"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<Vehicles>({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  useEffect(() => {
    if (item?._id) {
      setValue("vehicleName", item.vehicleName);
      setValue("vehicleNumber", item.vehicleNumber);
      setValue("vehicleType", item.vehicleType);
      setValue("ownerName", item.ownerName);
      setValue("mobileNumber", item.mobileNumber);
      trigger();
    } else {
      setValue("vehicleName", "");
      setValue("vehicleNumber", "");
      setValue("vehicleType", "");
      setValue("ownerName", "");
      setValue("mobileNumber", "");
    }
  }, [
    item?._id,
    item?.mobileNumber,
    item?.ownerName,
    item?.vehicleName,
    item?.vehicleNumber,
    item?.vehicleType,
    setValue,
    trigger,
  ]);

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

  const onSubmit = (data: Vehicles) => {
    const requestMethod = item?._id ? "put" : "post";
    let url = item?._id
      ? `/api/vehicle/updatevehicle?id=${encodeURIComponent(item?._id)}`
      : "/api/vehicle/add";

    const requestData = item?._id ? { ...data, id: item?._id } : data;
    requestData.userId = user._id;
    axios[requestMethod]<Vehicles>(url, requestData)
      .then((response) => {
        if (item?._id) {
          const updatedItems = vehicles.map((service) =>
            service._id === item?._id ? response.data : service
          );
          setVehicles(updatedItems);
          toast.success("Vehicle Update successfully!");
          router.refresh();
        } else {
          setVehicles([...vehicles, response.data]);
          toast.success("Vehicle save successfully!");
          router.refresh();
        }
        closeModal();
        setValue("vehicleName", "");
        setValue("vehicleNumber", "");
        setValue("vehicleType", "");
        setValue("ownerName", "");
        setValue("mobileNumber", "");
      })
      .catch((error) => {
        console.error("Error adding/updating item:", error.message);
      });
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-10"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex justify-center p-10">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-bgc-dark p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center font-bold border-b border-gray-200 pb-2">
                      <Dialog.Title>
                        {item?._id ? "Edit Vehicle" : "Add Vehicle"}
                      </Dialog.Title>
                      <Icon
                        icon="x"
                        className="h-5 w-5 lg:h-8 lg:w-8 cursor-pointer"
                        onClick={closeModal}
                      />
                    </div>

                    <Input
                      label="Vehicle Name"
                      placeholder="Enter Vehicle Name"
                      name="vehicleName"
                      register={register}
                      error={errors?.vehicleName?.message?.toString()}
                    />
                    <Input
                      label="Vehicle Number"
                      placeholder="Enter Vehicle Number"
                      name="vehicleNumber"
                      register={register}
                      error={errors?.vehicleNumber?.message?.toString()}
                    />
                    <Input
                      label="Vehicle Type"
                      placeholder="Enter Vehicle Type"
                      name="vehicleType"
                      register={register}
                      error={errors?.vehicleType?.message?.toString()}
                    />
                    <Input
                      label="Owner Name"
                      placeholder="Enter Owner Name"
                      name="ownerName"
                      register={register}
                      error={errors?.ownerName?.message?.toString()}
                    />
                    <Input
                      label="Mobile Number"
                      placeholder="Enter Mobile Number"
                      name="mobileNumber"
                      register={register}
                      error={errors?.mobileNumber?.message?.toString()}
                    />

                    <div className="flex justify-end gap-4">
                      <button
                        onClick={handleSubmit(onSubmit)}
                        className="bg-gbgc rounded-sm px-4 py-2 w-20 text-white transition duration-300 ease-in-out"
                      >
                        {item?._id ? "Update" : "Save"}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default EditVehicleModal;
