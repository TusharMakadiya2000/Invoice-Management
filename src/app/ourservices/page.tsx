"use client";
import { useEffect, useState } from "react";
import Header from "@/components/common/NavBar";
import Sidebar from "@/components/common/sidebar";
import Icon from "@/components/common/Icon";
import EditServiceModal from "@/components/common/EditServiceModal";
import MyDialog from "@/components/common/DeleteConfirmation";
import { FiDelete, FiEdit } from "react-icons/fi";
import { NextResponse } from "next/server";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/common/Input";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useAppState } from "@/utils/useAppState";
import { IUser } from "@/components/models/user";
interface Service {
  _id: string;
  userId: string;
  service: string;
  note: string;
  charge: number;
  gst: number;
}
interface OurServicesProps {}
const OurServices: React.FC<OurServicesProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditItem, setIsEditItem] = useState(false);
  const [activeItem, setActiveItem] = useState<Service | null>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [fetchedData, setFetchedData] = useState<Service[]>([]);
  const [allfetchedData, setAllFetchedData] = useState<Service[]>([]);
  const [showDeleteService, setShowDeleteService] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [{ user }, setAppState] = useAppState();

  const filteredData =
    user?.role === "super admin"
      ? fetchedData
      : fetchedData.filter((ourservice) => ourservice.userId === user?._id);

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
  const userId = user?._id;
  console.log("userId", userId);
  const fetchData = async () => {
    try {
      const response = await axios({
        url: "/api/service/get",
        method: "POST",
        data: { searchText: searchTerm },
      });
      const fetchedData = response.data;
      setAllFetchedData(response.data);
      if (searchTerm) {
        setAllFetchedData(response.data);
      } else {
        setFetchedData(fetchedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!isEditItem) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditItem]);
  useEffect(() => {
    searchData(searchTerm);
    const delayDebounceFn = setTimeout(() => {
      fetchData();
      // Send Axios request here
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const confirmDelete = async (serviceId: string) => {
    try {
      const response = await axios.delete(
        `/api/service/deleteservice?id=${encodeURIComponent(serviceId)}`
      );

      if (response.status >= 200 && response.status < 300) {
        setFetchedData((prevData) =>
          prevData.filter((item) => item._id !== serviceId)
        );
        toast.success("Service successfully deleted.");
      } else {
        console.error("Error deleting Service:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting Service:", error);
      return NextResponse.json({
        message: "Internal Server Error: ",
        status: 500,
      });
    } finally {
      setShowDeleteService(false);
      setServiceIdToDelete(null);
    }
  };
  const handleDelete = async (serviceId: string) => {
    setShowDeleteService(true);
    setServiceIdToDelete(serviceId);
  };
  const searchData = (searchTerm: string) => {
    const filteredData = allfetchedData.filter(
      (service) =>
        service.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.note.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFetchedData(filteredData);
  };

  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <div className="w-full flex flex-col place-items-end dark:bg-fgc-dark">
          <Header />
          <div className="sm:p-8 p-4 w-full text-sm sm:w-[calc(100%-310px)] mt-[60px] sm:mt-[80px]">
            <div className="p-4 gap-5 flex flex-col-reverse md:flex-row md:justify-between md:items-center">
              {/* <Icon icon="search-normal" className="h-5 w-5 lg:h-8 lg:w-8" /> */}
              <Input
                name="Search"
                type="text"
                placeholder="Search Services..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                preIcon="search"
              />
              <div
                className="w-auto flex justify-center items-center px-3 py-2 rounded-full text-black font-semibold bg-primary dark:bg-bgc-dark cursor-pointer"
                onClick={() => {
                  setIsEditItem(true);
                  setActiveItem(null);
                }}
              >
                <button className="flex items-center text-white dark:text-white gap-1">
                  <Icon icon="plus" className="h-5 w-5 lg:h-5 lg:w-5" /> Add
                  Service
                </button>
              </div>
            </div>
            {/*------------------------------ <Start: OurServiceTable /> ------------------------------ */}
            <div>
              <div className="mt-5 ">
                <div className="flex justify-end p-5">
                  <div className="overflow-auto md:w-full">
                    <table className="min-w-full bg-white dark:bg-fgc-dark">
                      <thead>
                        <tr className=" border-b dark:bg-fgc-dark dark:border-bgc-dark">
                          <th className="py-2 px-4">Service</th>
                          <th className="py-2 px-4 whitespace-nowrap">Note</th>
                          <th className="py-2 px-4">Charge</th>
                          <th className="py-2 px-4">GST (%)</th>
                          <th className="py-2 px-4">Total Amount</th>
                          <th className="py-2 px-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {filteredData
                          .slice()
                          .reverse()
                          .map((service, index) => (
                            <tr
                              key={index}
                              className="border-b dark:border-bgc-dark"
                            >
                              <td className="py-2 px-4 align-middle">
                                {service.service}
                              </td>
                              <td
                                className="py-2 px-4 align-middle max-w-[100px] truncate"
                                title={service.note}
                              >
                                {service.note}
                              </td>
                              <td className="py-2 px-4 align-middle">
                                {service.charge}
                              </td>
                              <td className="py-2 px-4 align-middle">
                                {service.gst}
                              </td>
                              <td className="py-2 px-4 align-middle">
                                {(service.charge * service.gst) / 100 +
                                  service.charge}
                              </td>
                              <td className="py-2 px-4 flex justify-center gap-2">
                                <button
                                  onClick={() => handleDelete(service._id)}
                                >
                                  <FiDelete
                                    data-tooltip-id="my-tooltip-2"
                                    className="text-red-500"
                                  />
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveItem(service);
                                    setIsEditItem(true);
                                  }}
                                >
                                  <FiEdit
                                    data-tooltip-id="my-tooltip-1"
                                    className="text-cyan-300"
                                  />
                                </button>
                                <ReactTooltip
                                  id="my-tooltip-1"
                                  place="bottom"
                                  variant="info"
                                  content="Edit Service Details"
                                />
                                <ReactTooltip
                                  id="my-tooltip-2"
                                  place="bottom"
                                  variant="info"
                                  content="Delete Service Details"
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  {showDeleteService && (
                    <MyDialog
                      open={showDeleteService}
                      onClose={() => setShowDeleteService(false)}
                      onConfirm={() => confirmDelete(serviceIdToDelete || "")}
                    />
                  )}
                </div>
              </div>
            </div>
            {/*------------------------------ <End: OurServiceTable /> ------------------------------ */}
            {/*------------------------------ <Start: OurServiceModal /> ------------------------------ */}
            <EditServiceModal
              isOpen={isEditItem}
              setIsOpen={setIsEditItem}
              item={activeItem}
            />
            {/*------------------------------ <End: OurServiceModal /> ------------------------------ */}
          </div>
        </div>
      </div>
    </>
  );
};

export default OurServices;
