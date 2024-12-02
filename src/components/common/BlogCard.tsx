// Import the necessary dependencies
import React from "react";
import Image from "next/image";
import { blogListType } from "../utils/types";
import Link from "next/link";

const BlogCard: React.FC<{ item: blogListType }> = ({ item }) => {
    return (
        <div className={`grid grid-cols-1`}>
            <div
                className={`col-span-1 relative border overflow-hidden rounded-xl `}
            >
                <div className="overflow-hidden">
                    <Image
                        alt=""
                        className={`w-full `}
                        src={`/images/blog/${item.image}`}
                        width={100}
                        height={100}
                        sizes="100vw"
                    />
                </div>

                <div className="px-5 py-4">
                    <div className="flex">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8 2V5"
                                    stroke="#4179BD"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M16 2V5"
                                    stroke="#4179BD"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                                    fill="#4179BD"
                                />
                                <path
                                    d="M15.6937 13.6992H15.7027"
                                    stroke="white"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M15.6937 16.6992H15.7027"
                                    stroke="white"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M11.9945 13.6992H12.0035"
                                    stroke="white"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M11.9945 16.6992H12.0035"
                                    stroke="white"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M8.29529 13.6992H8.30427"
                                    stroke="white"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M8.29529 16.6992H8.30427"
                                    stroke="white"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M3.5 9.09H20.5"
                                    stroke="white"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </svg>
                        <span className={"px-2 flex-1 "}>{item.date}</span>
                        <span
                            className={`rounded-xl border px-3 py-1 ${
                                item.status === "success"
                                    ? "bg-green/10 text-green"
                                    : item.status === "error"
                                    ? " bg-red-700/10 text-red-600"
                                    : item.status === "warning"
                                    ? "bg-amber-700/10 text-amber-500"
                                    : ""
                            }`}
                        >
                            {item.name}
                        </span>
                    </div>

                    <div className={`font-semibold text-xl mt-4 `}>
                        {item.title}
                    </div>
                    <div className="text-base text-textSecondary mt-5">
                        {item.description}
                    </div>
                    <Link
                        href={"/blog/" + item.id}
                        className="text-fgc grid grid-cols-2 mt-[30px] font-medium"
                    >
                        Know more
                        <span className="col-span-1 text-end font-bold">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
