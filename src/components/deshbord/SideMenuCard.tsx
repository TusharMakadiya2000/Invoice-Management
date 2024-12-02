"use client";
import React, { useState } from "react";
import Icon from "../common/Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideMenuCard = () => {
    const location = usePathname();
    console.log("location", location);
    const [activePage] = useState(location.replace("/", ""));

    return (
        <div className="text-sm px-6 py-5  border rounded-2xl bg-white">
            <div className=" grid text-fgc gap-10 cursor-pointer">
                <div className="flex items-center ">
                    <Link href={"/profile"}>
                        <Icon
                            icon={activePage === "profile" ? "home" : "home-o"}
                            className={`h-3.5 w-3.5 lg:h-8 lg:w-8`}
                        />
                        <span className="ml-4 text-textSecondary">Home</span>
                    </Link>
                </div>
                <div className="flex items-center">
                    <Link href={"/doctor-appointment"}>
                        <Icon
                            icon={activePage === "doctor-appointment" ? "calendar" : "calendar-o"}
                            className={`h-3.5 w-3.5 lg:h-8 lg:w-8`}
                        />
                        <span className="ml-4 text-textSecondary">
                            Appointments
                        </span>
                    </Link>
                </div>
                <div className="flex items-center">
                    <Link href={"/transaction-history"}>
                        <Icon
                            icon={activePage === "transaction-history" ? "transactions" : "transactions-o"}
                            className={`h-3.5 w-3.5 lg:h-8 lg:w-8`}
                        />
                        <span className="ml-4 text-textSecondary">
                            Transaction History
                        </span>
                    </Link>
                </div>
                <div className="flex items-center">
                    <Link href={"meeting-history"}>
                        <Icon
                            icon={activePage === "meeting-history" ? "meeting" : "meeting-o"}
                            className={`h-3.5 w-3.5 lg:h-8 lg:w-8`}
                        />
                        <span className="ml-4 text-textSecondary">
                            Meeting History
                        </span>
                    </Link>
                </div>
                <div className="flex items-center">
                    <Link href={"/upcoming-meeting"}>
                        <Icon
                            icon={activePage === "upcoming-meeting" ? "upcoming-meeting" : "upcoming-meeting-o"}
                            className={`h-3.5 w-3.5 lg:h-8 lg:w-8`}
                        />
                        <span className="ml-4 text-textSecondary">
                            Upcoming Meeting
                        </span>
                    </Link>
                </div>
                <div className="flex items-center">
                    <Link href={"/message"}>
                        <Icon
                            icon={activePage === "message" ? "messages" : "messages-o"}
                            className={`h-3.5 w-3.5 lg:h-8 lg:w-8`}
                        />
                        <span className="ml-4 text-textSecondary">Message</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SideMenuCard;
