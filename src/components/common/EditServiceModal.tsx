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
import { useAppState } from "@/utils/useAppState";
import { IUser } from "../models/user";

/* ------------------------------ State for form data ------------------------------ */

interface Service {
  _id?: string;
  userId?: string;
  service: string;
  note: string;
  charge: number;
  gst: number;
}
interface MyDialogProps {
  isOpen: boolean;
  setIsOpen: (item: boolean) => void;
  item: Service | null;
}

const EditServiceModal: React.FC<MyDialogProps> = ({
  isOpen,
  setIsOpen,
  item,
}) => {
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
  };
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [{ user }, setAppState] = useAppState();

  /* ------------------------------ Validation Schema ------------------------------ */

  const validationSchema = yup.object({
    service: yup.string().required("Service is required"),
    note: yup.string().required("Note is required"),
    charge: yup
      .number()
      .required("charge is required")
      .typeError("charge must be a number")
      .min(1, "charge must be at least 1"),

    gst: yup
      .number()
      .required("GST is required")
      .typeError("GST must be a number")
      .min(1, "GST must be at least 1")
      .max(100),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<Service>({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

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

  useEffect(() => {
    if (item?._id) {
      setValue("service", item.service);
      setValue("note", item.note);
      setValue("charge", item.charge);
      setValue("gst", item.gst);
      trigger();
    } else {
      setValue("service", "");
      setValue("note", "");
      setValue("charge", 0);
      setValue("gst", 0);
    }
  }, [
    item?._id,
    item?.charge,
    item?.gst,
    item?.note,
    item?.service,
    setValue,
    trigger,
  ]);

  const onSubmit = (data: Service) => {
    const requestMethod = item?._id ? "put" : "post";
    let url = item?._id
      ? `/api/service/updateService?id=${encodeURIComponent(item?._id)}`
      : "/api/service/add";

    const requestData = item?._id ? { ...data, id: item?._id } : data;
    requestData.userId = user._id;
    axios[requestMethod]<Service>(url, requestData)
      .then((response) => {
        if (item?._id) {
          const updatedItems = services.map((service) =>
            service._id === item?._id ? response.data : service
          );
          setServices(updatedItems);
          toast.success("Service Update successfully!");
        } else {
          setServices([...services, response.data]);
          toast.success("Service save successfully!");
        }
        closeModal();
        setValue("service", "");
        setValue("note", "");
        setValue("charge", 0);
        setValue("gst", 0);
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
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
                        {item?._id ? "Edit Service" : "Add Service"}
                      </Dialog.Title>
                      <Icon
                        icon="x"
                        className="h-5 w-5 lg:h-8 lg:w-8 cursor-pointer"
                        onClick={closeModal}
                      />
                    </div>

                    <Input
                      label="Service"
                      placeholder="Enter service"
                      name="service"
                      register={register}
                      error={errors?.service?.message?.toString()}
                    />
                    <Input
                      label="Note"
                      placeholder="Enter note"
                      name="note"
                      register={register}
                      error={errors?.note?.message?.toString()}
                    />
                    <Input
                      label="Charge"
                      placeholder={
                        getValues("charge") === 0 ? "Enter Charge" : ""
                      }
                      name="charge"
                      register={register}
                      error={errors?.charge?.message?.toString()}
                    />
                    <Input
                      label="GST (%)"
                      placeholder={getValues("gst") === 0 ? "Enter GST" : ""}
                      name="gst"
                      register={register}
                      error={errors?.gst?.message?.toString()}
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
export default EditServiceModal;
