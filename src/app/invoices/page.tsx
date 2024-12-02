"use client";

import Sidebar from "@/components/common/sidebar";
import Header from "@/components/common/NavBar";
import { useSession } from "next-auth/react";
import InvoicesTable from "@/components/common/InvoiceTable";
const Invoice = () => {
  // const session = await getServerSession(authOptions);
  const session = useSession();
  return (
    <>
      <div className="flex">
        <Sidebar />

        <div className="w-full flex flex-col place-items-end dark:bg-fgc-dark">
          <Header />
          <div className="p-2 md:p-4 w-full  text-sm sm:w-[calc(100%-310px)] mt-[60px] sm:mt-[80px]">
            <InvoicesTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
