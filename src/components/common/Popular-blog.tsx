// Import the necessary dependencies
import React from "react";
import Image from "next/image";
import { PopularBlogCardType } from "../utils/types";

const PopularBlogCard: React.FC<{ item: PopularBlogCardType }> = ({ item }) => {
    return (
        <div className={`grid grid-cols-1`}>
            <div className={`col-span-1 border rounded-3xl bg-fgc/10 `}>
                <div>
                    <Image
                        alt=""
                        className={`w-full`}
                        src={`/images/ourteam/${item.image}`}
                        width={100}
                        height={100}
                        sizes="100vw"
                    />
                </div>
                <div className="text-center  bg-fgc rounded-b-2xl text-white px-5 py-4">
                    <div
                        className={`font-semibold text-xl mb-1`}
                        dangerouslySetInnerHTML={{ __html: item.name }}
                    ></div>
                    <div
                        className="mb-2 text-base"
                        dangerouslySetInnerHTML={{ __html: item.title }}
                    ></div>
                    <div className="font-bold text-base relative border rounded-lg py-2 grid">
                        <span className="absolute py-2">
                            <svg
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clip-path="url(#clip0_30_6968)">
                                    <path
                                        d="M15.959 11.1562V15C15.959 15.1687 15.8902 15.325 15.7777 15.4437C15.6902 15.525 13.6777 17.5 10.334 17.5C6.99023 17.5 4.97773 15.525 4.89023 15.4437C4.77773 15.325 4.70898 15.1687 4.70898 15V11.1562L9.49648 13.55C9.75273 13.6812 10.0465 13.75 10.334 13.75C10.6215 13.75 10.9152 13.6812 11.1715 13.55L15.959 11.1562ZM19.084 12.6737V8.19875L19.3634 8.05875C19.5752 7.95312 19.709 7.73687 19.709 7.5C19.709 7.26312 19.5752 7.04687 19.3634 6.94062L10.6134 2.56562C10.4377 2.4775 10.2302 2.4775 10.054 2.56562L1.30398 6.94062C1.09273 7.04687 0.958984 7.26312 0.958984 7.5C0.958984 7.73687 1.09273 7.95312 1.30461 8.05937L10.0546 12.4344C10.1421 12.4781 10.2384 12.5 10.334 12.5C10.4296 12.5 10.5259 12.4781 10.6134 12.4344L17.834 8.82375V12.6737C17.4621 12.8906 17.209 13.2887 17.209 13.75C17.209 14.4394 17.7696 15 18.459 15C19.1484 15 19.709 14.4394 19.709 13.75C19.709 13.2894 19.4559 12.8906 19.084 12.6737Z"
                                        fill="white"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_30_6968">
                                        <rect
                                            width="20"
                                            height="20"
                                            fill="white"
                                            transform="translate(0.333984)"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        </span>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: item.description,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopularBlogCard;
