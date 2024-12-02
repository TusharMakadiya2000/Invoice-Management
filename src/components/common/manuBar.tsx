"use client";

import Icon from "./Icon";
import { useState, useEffect } from "react";
// import { Fragment, useState } from "react";
// import { Menu, Transition } from "@headlessui/react";

function HeadingMenu() {
  const menus = ["Profile", "Logout"];
  const [darkmode, setDarkmode] = useState(false);

  //   const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (localStorage.theme === "dark") {
      setThemeMode(true);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setThemeMode(true);
    }
  }, []);

  const setThemeMode = (isDark: any) => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDarkmode(isDark);
  };

  const toggleDarkMode = () => {
    setThemeMode(!darkmode);
  };
  return (
    <>
      <div className="w-full h-[80px] text-text dark:text-text-dark bg-gbgc dark:bg-bgc-dark px-1">
        <div className="py-4 px-4 flex flex-row items-center justify-between">
          <div className="h-11 w-11 flex items-center justify-center rounded-full">
            <Icon
              icon="view-list"
              className="h-6 w-6 lg:h-6 lg:w-6 text-white dark:text-white"
            />
          </div>
          <div className="font-bold text-white px-3.5">Our Services</div>
          <div
            className="h-11 w-11 flex items-center justify-center rounded-full"
            onClick={toggleDarkMode}
          >
            <Icon
              icon="sun"
              className="h-6 w-6 lg:h-6 lg:w-6 text-white dark:text-white"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default HeadingMenu;
