"use client";
import { Fragment, useEffect, useState } from "react";
import Icon from "@/components/common/Icon";
import MyDialog from "@/components/common/DeleteConfirmation";
import { FiDelete, FiEdit } from "react-icons/fi";
import { NextResponse } from "next/server";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Button from "./Button";
import { Input } from "./Input";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface UserDetails {
  data: Array<{
    fullName: string;
    businessName: string;
    email: string;
  }>;
}
const OurUserDetails: React.FC<UserDetails> = () => {
  const [isEditItem, setIsEditItem] = useState(false);

  const [fetchedData, setFetchedData] = useState<Array<any>>([]);
  const [allfetchedData, setAllFetchedData] = useState<UserDetails[]>([]);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const fetchData = async () => {
    try {
      const response = await axios({
        url: "/api/user/get",
        method: "POST",
        data: { searchText: searchTerm },
      });
      const fetchedData = response.data;
      console.log("fetchedData", fetchedData);
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
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const confirmDelete = async (userId: string) => {
    try {
      const response = await axios.delete(
        `/api/user/deleteuser?id=${encodeURIComponent(userId)}`
      );

      if (response.status >= 200 && response.status < 300) {
        setFetchedData((prevData) =>
          prevData.filter((item) => item._id !== userId)
        );
        toast.success("User successfully deleted.");
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
      setShowDeleteUser(false);
      setUserIdToDelete(null);
    }
  };
  const handleDelete = async (userId: string) => {
    setShowDeleteUser(true);
    setUserIdToDelete(userId);
  };

  const searchData = (searchTerm: string) => {
    const filteredData = allfetchedData.reduce(
      (accumulator: any, userDetails: any) => {
        if (
          userDetails.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          userDetails.businessName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          accumulator.push(userDetails);
        }
        return accumulator;
      },
      []
    );
    setFetchedData(filteredData);
  };

  return (
    <>
      <div className="w-full dark:bg-fgc-dark">
        <div className="p-4 gap-5 flex flex-col-reverse md:flex-row md:justify-between md:items-center">
          {/* <Icon icon="search-normal" className="h-5 w-5 lg:h-8 lg:w-8" /> */}
          <Input
            name="Search"
            type="text"
            placeholder="Search Users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            preIcon="search"
          />
          <Button href="/user" variant="primary">
            <Icon icon="plus" className="h-5 w-5 lg:h-5 lg:w-5" />
            Add User
          </Button>
        </div>
        <div>
          {/* ------------------------------ <OurServiceTable /> ------------------------------ */}
          <div className="mt-5 ">
            <div className="flex justify-end p-5">
              <div className="overflow-auto md:w-full">
                <table className="min-w-full bg-white dark:bg-fgc-dark">
                  <thead>
                    <tr className=" border-b-2 dark:bg-fgc-dark border-border dark:border-border-dark">
                      <th className="py-2 px-4">Full Name</th>
                      <th className="py-2 px-4">Business Name</th>
                      <th className="py-2 px-4">Email</th>

                      <th className="py-2 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {fetchedData
                      .slice()
                      .reverse()
                      .map((user, index) => (
                        <tr
                          key={index}
                          className="border-b border-border dark:border-border-dark"
                        >
                          <td className="py-2 px-4 align-middle">
                            {user.fullName}
                          </td>
                          <td className="py-2 px-4 align-middle">
                            {user.businessName}
                          </td>
                          <td className="py-2 px-4 align-middle">
                            {user.email}
                          </td>
                          <td className="py-2 px-4 flex justify-center gap-2">
                            <button onClick={() => handleDelete(user._id)}>
                              <FiDelete
                                data-tooltip-id="my-tooltip-2"
                                className="text-red-500"
                              />
                            </button>
                            <button>
                              <Link href={"/user/" + user._id}>
                                <FiEdit
                                  data-tooltip-id="my-tooltip-1"
                                  className="text-cyan-300"
                                />
                              </Link>
                            </button>
                            <ReactTooltip
                              id="my-tooltip-1"
                              place="bottom"
                              variant="info"
                              content="Edit User Details"
                            />
                            <ReactTooltip
                              id="my-tooltip-2"
                              place="bottom"
                              variant="info"
                              content="Delete User Details"
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {/* ------------------------------ Delete Modal ------------------------------ */}
              {showDeleteUser && (
                <MyDialog
                  open={showDeleteUser}
                  onClose={() => setShowDeleteUser(false)}
                  onConfirm={() => confirmDelete(userIdToDelete || "")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurUserDetails;
