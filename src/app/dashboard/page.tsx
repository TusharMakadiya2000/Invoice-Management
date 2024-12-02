"use client";

import Sidebar from "@/components/common/sidebar";
import Header from "@/components/common/NavBar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAppState } from "@/utils/useAppState";
import Link from "next/link";
import Icon from "@/components/common/Icon";
import axios from "axios";
const Dashboard = () => {
  const [{ user }, setAppState] = useAppState();

  const session = useSession();
  const [totalInvoice, setTotalInvoice] = useState(0);

  useEffect(() => {
    const fetchInvoiceCount = async () => {
      try {
        const response = await axios.post("/api/dashboard/get-count");
        setTotalInvoice(response.data.totalInvoice);
      } catch (error) {
        console.error("Error fetching invoice count:", error);
      }
    };

    fetchInvoiceCount();
  }, []);
  const [items, setItems] = useState([
    // {
    //   title: "Total Vehicles",
    //   name: "vehicles",
    //   count: 20,
    //   icon: "car-svgrepo-com",
    //   link: "/vehicles",
    // },
    {
      title: "Total Invoice",
      name: "invoice",
      // count: totalInvoice,
      icon: "invoice",
      link: "/invoices",
    },
    // {
    //   title: "Our Services",
    //   name: "ourservices",
    //   count: 50,
    //   icon: "service",
    //   link: "/ourservices",
    // },
  ]);
  return (
    <>
      <div className="flex">
        <Sidebar />

        <div className="w-full flex flex-col place-items-end">
          <Header />
          <div className="font-bold flex flex-col gap-2 p-4 w-full sm:w-[calc(100%-310px)] mt-[60px] sm:mt-[80px]">
            <div className="text-xl ">Welcome, {user?.fullName}</div>
            <div className="flex w-full gap-5 flex-wrap mt-5">
              {items.map((item: any, index: number) => (
                <Link
                  href={item.link || ""}
                  key={"ditem_" + index}
                  className="bg-bgc dark:bg-bgc-dark flex px-6 py-4 rounded-lg gap-0 md:gap-5 items-center hover:text-primary w-full md:w-[250px]"
                >
                  <div className="w-16">
                    <Icon
                      icon={item.icon}
                      className="h-10 w-10 md:h-12 md:w-12"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2 grow">
                    <div className="opacity-70">{item.title}</div>
                    <div className="text-4xl font-bold">{totalInvoice}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
