"use client";
import { useEffect, useState } from "react";
import Header from "@/components/common/NavBar";
import Sidebar from "@/components/common/sidebar";
import { Input } from "@/components/common/Input";
import Icon from "@/components/common/Icon";
import EditVehicleModal from "@/components/common/EditVehicleModal";
import MyDialog from "@/components/common/DeleteConfirmation";
import { FiDelete, FiEdit } from "react-icons/fi";
import { NextResponse } from "next/server";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useSession } from "next-auth/react";
import { useAppState } from "@/utils/useAppState";
import { IUser } from "@/components/models/user";

/* ------------------------------ State for form data ------------------------------ */

interface Vehicle {
  userId: string;
  _id: string;
  vehicleName: string;
  vehicleNumber: string;
  vehicleType: string;
  ownerName: string;
  mobileNumber: string;
}
interface VehicleProps {}
const Vehicles: React.FC<VehicleProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditItem, setIsEditItem] = useState(false);
  const [activeItem, setActiveItem] = useState<Vehicle | null>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [{ user }, setAppState] = useAppState();
  const [fetchedData, setFetchedData] = useState<Vehicle[]>([]);
  const [allfetchedData, setAllFetchedData] = useState<Vehicle[]>([]);
  const [showDeleteVehicle, setShowDeleteVehicle] = useState(false);
  const [vehicleIdToDelete, setVehicleIdToDelete] = useState<string | null>(
    null
  );

  const filteredData =
    user?.role === "super admin"
      ? fetchedData
      : fetchedData.filter((vehicle) => vehicle.userId === user?._id);

  const [searchTerm, setSearchTerm] = useState<string>("");
  /* ------------------------------ Get Vehicle Data ------------------------------ */

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
        url: "/api/vehicle/get",
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

  /* ------------------------------ Delete Vehicle ------------------------------ */

  const confirmDelete = async (vehicleId: string) => {
    try {
      const response = await axios.delete(
        `/api/vehicle/deletevehicle?id=${encodeURIComponent(vehicleId)}`
      );

      if (response.status >= 200 && response.status < 300) {
        setFetchedData((prevData) =>
          prevData.filter((item) => item._id !== vehicleId)
        );
        toast.success("Vehicle successfully deleted.");
      } else {
        console.error("Error deleting Vehicle:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting Vehicle:", error);
      return NextResponse.json({
        message: "Internal Server Error: ",
        status: 500,
      });
    } finally {
      setShowDeleteVehicle(false);
      setVehicleIdToDelete(null);
    }
  };
  const handleDelete = async (vehicleId: string) => {
    setShowDeleteVehicle(true);
    setVehicleIdToDelete(vehicleId);
  };

  /* ------------------------------ Set Search On Fields ------------------------------ */

  const searchData = (searchTerm: string) => {
    const filteredData = allfetchedData.filter(
      (vehicle) =>
        vehicle.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFetchedData(filteredData);
  };
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="w-full flex flex-col place-items-end dark:bg-fgc-dark">
          <Header />
          <div className="sm:p-8 p-4 w-full text-sm sm:w-[calc(100%-310px)] mt-[60px] sm:mt-[80px]">
            <div className="p-4 gap-5 flex flex-col-reverse md:flex-row md:justify-between md:items-center">
              <Input
                name="Search"
                type="text"
                placeholder="Search Vehicles..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                preIcon="search"
              />
              <div
                className="w-auto flex justify-center items-center p-2 px-3 rounded-full text-black font-semibold bg-primary dark:bg-bgc-dark cursor-pointer"
                onClick={() => {
                  setIsEditItem(true);
                  setActiveItem(null);
                }}
              >
                <button className="flex items-center text-white dark:text-white gap-1">
                  <Icon icon="plus" className="h-5 w-5 lg:h-5 lg:w-5" />
                  Add Vehicles
                </button>
              </div>
            </div>
            <div>
              {/* ------------------------------ <OurServiceTable /> ------------------------------ */}
              <div className="mt-5 ">
                <div className="flex justify-end p-5">
                  <div className="overflow-auto md:w-full">
                    <table className="min-w-full bg-white dark:bg-fgc-dark">
                      <thead>
                        <tr className=" border-b dark:bg-fgc-dark dark:border-bgc-dark">
                          <th className="py-2 px-4  ">Vehicle Name</th>
                          <th className="py-2 px-4 ">Vehicle Number</th>
                          <th className="py-2 px-4 ">Vehicle Type</th>
                          <th className="py-2 px-4 ">Owner Name</th>
                          <th className="py-2 px-4 ">Mobile Number</th>
                          <th className="py-2 px-4 ">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {filteredData
                          .slice()
                          .reverse()
                          .map((Vehicle, index) => (
                            <tr
                              key={index}
                              className="border-b dark:border-bgc-dark"
                            >
                              <td className="py-2 px-4 align-middle">
                                {Vehicle.vehicleName}
                              </td>
                              <td className="py-2 px-4 align-middle">
                                {Vehicle.vehicleNumber}
                              </td>
                              <td className="py-2 px-4 align-middle">
                                {Vehicle.vehicleType}
                              </td>
                              <td className="py-2 px-4 align-middle">
                                {Vehicle.ownerName}
                              </td>
                              <td className="py-2 px-4 align-middle">
                                {Vehicle.mobileNumber}
                              </td>
                              <td className="py-2 px-4 flex justify-center gap-2">
                                <button
                                  onClick={() => handleDelete(Vehicle._id)}
                                >
                                  <FiDelete
                                    data-tooltip-id="my-tooltip-2"
                                    className="text-red-500"
                                  />
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveItem(Vehicle);
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
                                  content="Edit Vehicle Details"
                                />
                                <ReactTooltip
                                  id="my-tooltip-2"
                                  place="bottom"
                                  variant="info"
                                  content="Delete Vehicle Details"
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  {showDeleteVehicle && (
                    <MyDialog
                      open={showDeleteVehicle}
                      onClose={() => setShowDeleteVehicle(false)}
                      onConfirm={() => confirmDelete(vehicleIdToDelete || "")}
                    />
                  )}
                </div>
              </div>
            </div>
            <EditVehicleModal
              isOpen={isEditItem}
              setIsOpen={setIsEditItem}
              item={activeItem}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Vehicles;
