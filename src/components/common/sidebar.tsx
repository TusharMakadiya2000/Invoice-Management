"use client";
import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { useAppState } from "@/utils/useAppState";
import axios from "axios";
import { IUser } from "@/components/models/user";

interface SidebarProps {}

const Sidebar = ({}: SidebarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [{ user }, setAppState] = useAppState();
    useEffect(() => {
        setAppState({ user: "user object" });
        // eslint-disable-next-line
    }, []);

    const router = useRouter();
    const [darkmode, setDarkmode] = useState(false);
    const session = useSession();
    const [pageName, setPageName] = useState("");
    const pathname = usePathname();
    const [menuList, setMenuList] = useState([
        {
            title: "Dashboard",
            name: "dashboard",
            link: "/dashboard",
            icon: "category",
        },
        // {
        //   title: "vehicles",
        //   name: "vehicles",
        //   link: "/vehicles",
        //   icon: "car-svgrepo-com",
        // },
        {
            title: "Invoices",
            name: "invoices",
            link: "/invoices",
            icon: "invoice",
        },
        // {
        //   title: "OurService",
        //   name: "ourService",
        //   link: "/ourservices",
        //   icon: "service",
        // },
        { title: "Users", name: "users", link: "/users", icon: "profile" },
    ]);

    useEffect(() => {
        setPageName(pathname.replace("/", ""));
    }, [pathname]);

    useEffect(() => {
        if (localStorage.theme === "dark") {
            setThemeMode(true);
        }
        if (
            window.matchMedia("(prefers-color-scheme: dark)").matches ||
            localStorage?.theme === undefined
        ) {
            setThemeMode(true);
        }
    }, []);

    const setThemeMode = (isDark: boolean) => {
        if (
            !("theme" in localStorage) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            document.documentElement.classList.add("dark");
            isDark = true;
        }
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        setDarkmode(isDark);
    };

    const handleLogout = async () => {
        await signOut({ redirect: false });

        if (await signOut.call(session?.status === "unauthenticated")) {
            router.push("/login");
        }
    };

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
        if (user) {
            const updatedMenuList = menuList.filter((item) => {
                return !(item.name === "users" && !isSuperAdmin);
            });
            setMenuList(updatedMenuList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // useEffect(() => {
    //     getUserDetails();
    //     // eslint-disable-next-line
    // }, []);

    const isSuperAdmin = () => {
        return user?.role === "SA";
    };

    return (
        <>
            <div className="fixed top-0 left-0 z-10 px-3 sm:hidden text-white flex items-center h-[60px] bg-bgc dark:bg-bgc-dark">
                <button onClick={() => setIsOpen(!isOpen)}>
                    <Icon
                        icon="bars"
                        className="h-6 w-6 text-black dark:text-white"
                    />
                </button>
            </div>

            <div
                className={`${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }  lg:translate-x-0 top-0 left-0 z-50 text-text dark:text-text-dark bg-bgc dark:bg-bgc-dark transition-transform ease-in-out duration-300 transform fixed md:min-h-screen w-[310px]`}
            >
                <div className="w-full md:w-[310px] text-text dark:text-text-dark bg-bgc dark:bg-bgc-dark min-h-screen text-center ">
                    <div className="flex px-6 pb-0 sm:pb-9">
                        <div className="flex md:px-3.5 w-full grow">
                            <div className="flex items-center py-2.5 justify-between w-full grow">
                                <div className="w-36 md:w-48">
                                    <Image
                                        src="/garage-logo-with-text.svg"
                                        height={999}
                                        width={999}
                                        alt=""
                                    />
                                </div>
                                <Icon
                                    onClick={() => setIsOpen(false)}
                                    icon={"x"}
                                    className="block md:!hidden h-5 w-5"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="lg:flex lg:gap-4 flex-col">
                        <nav className="flex flex-col">
                            <ul
                                id="navigation"
                                className="flex flex-col gap-0 sm:gap-2.5 mb-12 grow h-[calc(100vh-250px)] sm:h-[calc(100vh-310px)]"
                            >
                                {menuList.map((item: any) =>
                                    !isSuperAdmin() &&
                                    item.name === "users" ? null : (
                                        <div className=" px-6" key={item.name}>
                                            <Link
                                                href={item.link}
                                                className={`flex gap-3.5 items-center py-2.5 w-64 h-[51px] transition-all duration-300 rounded-lg font-semibold font-text px-3.5 hover:bg-primary hover:text-white ${
                                                    pageName === item.name &&
                                                    "bg-primary text-white"
                                                }`}
                                                onClick={() =>
                                                    setIsOpen(!isOpen)
                                                }
                                            >
                                                <Icon
                                                    icon={item.icon}
                                                    className="h-5 w-5 lg:h-8 lg:w-8"
                                                />
                                                {item.title}
                                            </Link>
                                        </div>
                                    )
                                )}
                            </ul>
                            <div className="flex flex-col gap-0 sm:gap-2.5">
                                <div className="px-6">
                                    <div className="flex gap-3.5 items-center justify-between py-2.5 w-full md:w-64 h-[51px] font-semibold px-3.5">
                                        <div className="flex items-center gap-3.5">
                                            <Icon
                                                icon="moon"
                                                className="h-5 w-5 lg:h-8 lg:w-8"
                                            />
                                            <div className="py-1">
                                                Dark Mode
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Switch
                                                checked={darkmode}
                                                onChange={(isChecked) => {
                                                    localStorage.setItem(
                                                        "theme",
                                                        isChecked
                                                            ? "dark"
                                                            : "light"
                                                    );
                                                    setThemeMode(isChecked);
                                                }}
                                                className={`${
                                                    darkmode
                                                        ? "bg-primary"
                                                        : "bg-gray-200"
                                                } relative inline-flex items-center h-6 rounded-full w-11`}
                                            >
                                                <span
                                                    className={`${
                                                        darkmode
                                                            ? "translate-x-6"
                                                            : "translate-x-1"
                                                    } inline-block w-4 h-4 transform bg-white rounded-full`}
                                                />
                                            </Switch>
                                        </div>
                                    </div>
                                </div>
                                <div className=" px-6">
                                    <div
                                        className="flex gap-3.5 items-center py-2.5 w-64 h-[51px] transition-all duration-300 hover:py-2.5 hover:w-64 hover:h-[51px] hover:rounded-lg hover:text-white hover:font-semibold font-semibold font-text hover:bg-primary px-3.5 cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        <Icon
                                            icon="logout"
                                            className="h-5 w-5 lg:h-8 lg:w-8"
                                        />
                                        <Link href="/login" className="py-1">
                                            Logout
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
