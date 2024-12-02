"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Disclosure } from "@headlessui/react";
import Icon from "./Icon";

function Header() {
  return (
    <>
      <div className="flex w-full dark:bg-bgc-dark">
        <div className="flex h-full w-full justify-around items-center py-2 px-6 lg:px-0">
          <h1 className="font-semibold text-3xl dark:text-white">GarageApp</h1>

          <div className="hidden lg:flex lg:gap-4"></div>

          <div className="hidden lg:flex lg:gap-4">
            <Link
              href={"/register"}
              className="px-6 py-3 bg-primary rounded-2xl gap-2.5 text-white text-center text-base font-semibold hover:underline"
            >
              Register
            </Link>
            <Link
              href={"/login"}
              className="px-8 py-3 bg-primary rounded-2xl gap-2.5 text-center text-white text-base font-semibold hover:underline"
            >
              Login
            </Link>
          </div>

          <div className="flex lg:hidden lg:gap-4">
            <Disclosure as="nav" className="z-10">
              {({ open }) => (
                <>
                  <div className="mx-auto px-2 sm:px-8 lg:px-24 max-w-screen-2xl m-auto z-10">
                    <div className="relative flex h-16 items-center justify-between">
                      <div className="inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                          <span className="sr-only">Open main menu</span>
                          {open ? (
                            <Icon
                              icon="x-mark"
                              className="h-5 w-5 lg:h-8 lg:w-8"
                            />
                          ) : (
                            <Icon
                              icon="bars"
                              className="h-5 w-5 lg:h-8 lg:w-8 mt-3"
                            />
                          )}
                        </Disclosure.Button>
                      </div>
                    </div>
                  </div>

                  {
                    <Disclosure.Panel className="sm:hidden z-50 fixed top-0  buttom-0 left-0 bg-fgc dark:bg-fgc-dark h-screen w-[80%]">
                      <div className="flex justify-center space-y-1 px-4 pb-3 pt-4">
                        {" "}
                        <Link href={"/"}>
                          <Image
                            src={"/logo.svg"}
                            height={60}
                            width={40}
                            alt=""
                            className="h-full w-full justify-center "
                          />
                        </Link>
                      </div>
                      <div className="flex flex-col justify-between w-full h-full">
                        <div className="flex flex-col justify-between mb-20 px-7">
                          <Link
                            href={"/login"}
                            className="container w-full lg:w-auto whitespace-nowrap px-4 py-2.5  text-sm lg:text-base bg-white dark:bg-primary rounded-xl lg:rounded-2xl justify-center gap-2.5 font-semibold text-center"
                          >
                            Login
                          </Link>
                          <Link
                            href={"/email"}
                            className="w-full lg:w-auto whitespace-nowrap px-4 py-2.5 lg:px-8 lg:py-3 text-sm lg:text-base rounded-xl dark:bg-primary lg:rounded-2xl border border-white justify-center gap-2.5 text-white font-semibold text-center mt-4"
                          >
                            Register
                          </Link>
                        </div>
                      </div>
                    </Disclosure.Panel>
                  }
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
