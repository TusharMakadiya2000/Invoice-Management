"use client";

import Link from "next/link";
import Icon from "./Icon";
import { Input } from "./Input";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import router from "next/router";
import axios from "axios";
import { useAppState } from "@/utils/useAppState";
import { IUser } from "../models/user";

function HeadingMenu() {
  const [{ user, showSidebar }, setAppState] = useAppState();

  const menus = ["Profile", "Logout"];
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      switch (path) {
        case "/dashboard":
          setPageTitle("Dashboard");
          break;
        case "/ourservices":
          setPageTitle("Our Services");
          break;
        case "/vehicles":
          setPageTitle("Vehicles");
          break;
        case "/users":
          setPageTitle("Users");
          break;
        case "/invoice":
          setPageTitle("Invoice");
          break;
        default:
          setPageTitle("");
          break;
      }
    }
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
  const handleLogout = async () => {
    await signOut({ redirect: false });

    if (await signOut.call(session?.status === "unauthenticated")) {
      router.push("/login");
    }
  };

  // const toggleSidebar = () => {
  //   setAppState({ showSidebar: !showSidebar });
  // };

  return (
    <>
      <div className="fixed top-0 right-0 w-[calc(100%-48px)] sm:w-[calc(100%-310px)] h-[60px] z-10 sm:h-[80px] text-text dark:text-text-dark bg-bgc dark:bg-bgc-dark px-3 sm:px-6 flex items-center justify-end">
        <div className="w-full flex items-center justify-between h-14 md:h-20 text-text dark:text-text-dark bg-bgc dark:bg-bgc-dark">
          <div className="flex items-center gap-1">
            {/* <div className="md:hidden block top-7 left-5">
              <button onClick={() => setIsOpen(!isOpen)}>
                <Icon icon="menu" className="h-6 w-6" />
              </button>
            </div> */}

            <div className="text-sm md:text-lg font-bold">{pageTitle}</div>
          </div>
          <div className="flex gap-2 md:gap-5 items-center">
            {/* <div className="h-10 !w-10 dark:bg-fgc-dark flex items-center justify-center rounded-full">
            <Icon
              icon="notification"
              className="h-6 w-6 lg:h-6 lg:w-6 dark:text-white"
            />
          </div> */}
            <div className="flex justify-center items-center">
              <Menu>
                <Menu.Button>
                  <div className="md:flex items-center">
                    <div className="border-dark">
                      {/* <Image
                        src="/user-circle.svg"
                        height={1600}
                        width={1600}
                        alt=""
                        className="w-11 h-11 rounded-full"
                      /> */}
                      <Icon
                        icon="user-circle"
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full text-text/80 dark:text-text-dark/60"
                      />
                    </div>
                    {/* <div className="py-2 hidden md:block text-left">
                                            <div className="">{user?.fullName}</div>
                                            <div className="text-text/50 dark:text-text-dark/50">
                                                {user?.email}
                                            </div>
                                        </div> */}
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute top-[80px] right-2 bg-white dark:bg-bgc-dark shadow-md p-2 rounded-br-md rounded-bl-md dark:shadow-shadow-dark font-semibold ">
                    <div className="w-[180px]">
                      <div className="border-b pb-2 border-border dark:border-border-dark !bg-opacity-100 phone:mx-5 phone:px-5 opacity-70">
                        <div className="font-normal text-sm">Signed in as</div>
                        <div
                          className="truncate font-semibold"
                          title={session.data?.user?.email || ""}
                        >
                          {session.data?.user?.email}
                        </div>
                      </div>
                      {menus.map((menu) => (
                        <Menu.Item key={menu}>
                          {({ active }) => (
                            <button
                              className={`w-full p-2 cursor-pointer rounded ${
                                active
                                  ? "bg-bgc2 text-white"
                                  : "hover:bg-bgc2 hover:text-white"
                              }`}
                              onClick={() => {
                                if (menu === "Logout") {
                                  handleLogout();
                                } else {
                                  setIsOpen(false);
                                }
                              }}
                            >
                              {menu}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeadingMenu;
