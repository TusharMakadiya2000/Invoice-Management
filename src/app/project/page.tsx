"use client";
import Sidebar from "@/components/common/sidebar";
import HeadingMenu from "@/components/common/NavBar";
import Select from "@/components/common/Select";
import { useState } from "react";

const Dashboard = () => {
  const [Project] = useState([{ text: "Newest Project", value: "NEW" }]);
  const [List] = useState([{ text: "List View", value: "View" }]);
  const [Days] = useState([{ text: "This month", value: "DAYS" }]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="w-full flex flex-col">
        <div>
          <HeadingMenu />
        </div>
        <div className="font-bold text-2xl p-8 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="">Projects</span>

            <div className="flex space-x-4">
              <Select
                name={"project"}
                items={Project}
                className="w-1/2 flex absolute"
              />
              <Select name={"list"} items={List} className="w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-10 py-[33px]">
            <Select
              name={"days"}
              items={Days}
              className="w-1/2 !border-none ring-"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
