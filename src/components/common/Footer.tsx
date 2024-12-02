import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div className="p-9 px-4 lg:p-18 dark:bg-bgc-dark">
        <div className="container m-auto self-stretch justify-between items-start grid lg:grid-cols-2 gap-10">
          <div className="flex-col w-full lg:w-4/6 justify-start items-start inline-flex">
            <div className="flex-col justify-start items-start gap-3 lg:gap-8 flex">
              <div className="flex-col justify-start items-start gap-6 flex">
                <div className="w-32 flex flex-row">
                  <h1 className="font-semibold text-3xl">GarageApp</h1>
                </div>
                <div className="text-textSecondary text-xs lg:text-base">
                  Heltyfi is an organization with a vision, a vision to
                  transform healthcare delivery nationally and internationally
                  and to use Al to make healthcare more accessible and
                  affordable.
                </div>
              </div>
              <div className="justify-start items-start gap-3 inline-flex">
                <div className="w-9 h-9 relative">
                  <Link
                    href={"#"}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border-opacity-20 border border-slate-700"
                  >
                    <Image
                      src={"/images/insta-footer.svg"}
                      height={60}
                      width={40}
                      alt=""
                      className="h-4 w-auto"
                    />
                  </Link>
                </div>
                <div className="w-9 h-9 relative">
                  <Link
                    href={"#"}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border-opacity-20 border border-slate-700"
                  >
                    <Image
                      src={"/images/twitter-x-footer.svg"}
                      height={60}
                      width={40}
                      alt=""
                      className="h-4 w-auto"
                    />
                  </Link>
                </div>
                <div className="w-9 h-9 relative">
                  <Link
                    href={"#"}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border-opacity-20 border border-slate-700"
                  >
                    <Image
                      src={"/images/linkedin.svg"}
                      height={60}
                      width={40}
                      alt=""
                      className="h-4 w-auto"
                    />
                  </Link>
                </div>
                <div className="w-9 h-9 relative">
                  <Link
                    href={"#"}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border-opacity-20 border border-slate-700"
                  >
                    <Image
                      src={"/images/youtube.svg"}
                      height={60}
                      width={40}
                      alt=""
                      className="h-4 w-auto"
                    />
                  </Link>
                </div>
                <div className="w-9 h-9 relative">
                  <Link
                    href={"#"}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border-opacity-20 border border-slate-700"
                  >
                    <Image
                      src={"/images/facebook.svg"}
                      height={60}
                      width={40}
                      alt=""
                      className="h-4 w-auto"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="justify-between items-start grid grid-cols-3 lg:grid-cols-3 gap-10 lg:gap-0">
            <div className="w-auto lg:w-44 flex-col justify-start items-start gap-3 lg:gap-8 inline-flex">
              <div className="w-auto lg:w-44 text-sm lg:text-xl font-semibold">
                Company
              </div>
            </div>
            <div className="w-auto lg:w-44 flex-col justify-start items-start gap-3 lg:gap-8 inline-flex">
              <div className="w-auto lg:w-44 text-sm lg:text-xl font-semibold">
                About
              </div>
            </div>
            <div className="w-auto lg:w-44 flex-col justify-start items-start gap-3 lg:gap-8 inline-flex">
              <div className="w-auto lg:w-44 text-sm lg:text-xl font-semibold">
                Support
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-9 py-4 lg:p-8 dark:bg-fgc-dark">
        <div className="container m-auto">
          <div className="w-full self-stretch items-center inline-flex justify-center">
            <div className=" text-base  text-center">
              Copyright © GarageApp {new Date().getFullYear()}. All rights
              reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
