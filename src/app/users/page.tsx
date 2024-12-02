"use client";

import Sidebar from "@/components/common/sidebar";
import Header from "@/components/common/NavBar";
import { useSession } from "next-auth/react";
import UsersTable from "@/components/common/UsersTable";
const Dashboard = () => {
  const session = useSession();
  return (
    <>
      <div className="flex">
        <Sidebar />

        <div className="w-full flex flex-col place-items-end dark:bg-fgc-dark">
          <Header />
          <div className="p-2 md:p-4 w-full  text-sm sm:w-[calc(100%-310px)] mt-[60px] sm:mt-[80px]">
            <UsersTable data={[]} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
