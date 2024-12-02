"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ReactToPrint from "react-to-print";
import Icon from "@/components/common/Icon";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextResponse } from "next/server";
import MyDialog from "@/components/common/DeleteConfirmation";
import React from "react";
import Image from "next/image";
import Button from "./Button";
import { Input } from "./Input";
import Pagination from "./Pagination";
import TableSkeleton from "./TableSkeleton";
import GridSkeleton from "./GridSkeleton";
import NotFound from "./NotFound";
import { useRouter } from "next/navigation";

/* -------------------- Define the Service type -------------------- */

type Address = {
    country: string;
    state: string;
    city: string;
    zipcode: number;
    address1: string;
    address2: string;
};

/* -------------------- Define the Service type -------------------- */
type Service = {
    title: string;
    serialNo: string;
    hsnSac: string;
    quantity: number;
    amount: number;
    gst: number;
};

/* -------------------- Define the FormData type -------------------- */
interface FormData {
    _id: string;
    userId?: string;
    invoiceID: number;
    customerName: string;
    mobileNumber: string;
    invoiceDate: null;
    address: Address;
    vehicleCompany: string;
    vehicleVariant: string;
    vehicleNo: string;
    kilometers: number;
    services: Service[];
}
interface OurInvoicesProps {}

const Invoices: React.FC<OurInvoicesProps> = () => {
    const router = useRouter();

    const [filter, setFilter] = useState<{
        sort: string;
        sortDirection: number;
        searchText: string;
        recordPerPage: number;
        page: number;
    }>({
        sort: "customerName",
        sortDirection: 1,
        searchText: "",
        recordPerPage: 12,
        page: 1,
    });
    const [list, setList] = useState<FormData[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);

    const [activeItem, setActiveItem] = useState<FormData>();
    const [showDeleteInvoice, setShowDeleteInvoice] = useState(false);
    const [invoiceIdToDelete, setInvoiceIdToDelete] = useState<string | null>(
        null
    );
    const [searchText, setSearchText] = useState<string>("");
    const [allfetchedData, setAllFetchedData] = useState<FormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("grid");

    const handleViewChange = (newView: string) => {
        setView(newView);
    };

    const handlePageChange = (newPage: number) => {
        filter.page = newPage;
        setFilter({ ...filter });
    };
    const handlePerPageChange = (newPerPage: number) => {
        setFilter({ ...filter, recordPerPage: newPerPage, page: 1 });
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios({
                url: "/api/invoice/get",
                method: "POST",
                data: filter,
            });
            console.log("response", response);
            setTotalRecords(response.data.count);
            setList(response.data.items);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);
    useEffect(() => {
        if (filter.searchText !== searchText) {
            const delayDebounceFn = setTimeout(() => {
                filter.page = 1;
                filter.searchText = searchText;
                setFilter({ ...filter });
            }, 1000);
            return () => clearTimeout(delayDebounceFn);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);
    const sortClick = (name: string) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            sort: name,
            sortDirection:
                prevFilter.sort === name && prevFilter.sortDirection === 1
                    ? -1
                    : 1,
        }));
    };

    const getSum = (item: FormData) => {
        return item?.services
            ?.reduce(
                (total, service) =>
                    total +
                    ((service.amount * service.quantity * service.gst) / 100 +
                        service.amount * service.quantity),
                0
            )
            ?.toFixed(2);
    };
    const confirmDelete = async (itemId: string) => {
        try {
            const response = await axios.delete(
                `/api/invoice/delete-invoice?id=${encodeURIComponent(itemId)}`
            );

            if (response.status >= 200 && response.status < 300) {
                setActiveItem(
                    (prevData) => list.filter((item) => item._id !== itemId)[0]
                );
                toast.success("Invoice successfully deleted.");
                fetchData();
            } else {
                console.error("Error deleting Invoice:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting Invoice:", error);
            return NextResponse.json({
                message: "Internal Server Error: ",
                status: 500,
            });
        } finally {
            setShowDeleteInvoice(false);
            setInvoiceIdToDelete(null);
        }
    };
    const handleDelete = async (itemId: string) => {
        setShowDeleteInvoice(true);
        setInvoiceIdToDelete(itemId);
    };

    const numberToWord = (am: number) => {
        var words = new Array();
        words[0] = "";
        words[1] = "One";
        words[2] = "Two";
        words[3] = "Three";
        words[4] = "Four";
        words[5] = "Five";
        words[6] = "Six";
        words[7] = "Seven";
        words[8] = "Eight";
        words[9] = "Nine";
        words[10] = "Ten";
        words[11] = "Eleven";
        words[12] = "Twelve";
        words[13] = "Thirteen";
        words[14] = "Fourteen";
        words[15] = "Fifteen";
        words[16] = "Sixteen";
        words[17] = "Seventeen";
        words[18] = "Eighteen";
        words[19] = "Nineteen";
        words[20] = "Twenty";
        words[30] = "Thirty";
        words[40] = "Forty";
        words[50] = "Fifty";
        words[60] = "Sixty";
        words[70] = "Seventy";
        words[80] = "Eighty";
        words[90] = "Ninety";
        let amount: any = am.toString();
        var atemp = amount.split(".");
        var number = atemp[0].split(",").join("");
        var n_length = number.length;
        var words_string = "";
        if (n_length <= 9) {
            var n_array: any = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
            var received_n_array = new Array();
            for (var i = 0; i < n_length; i++) {
                received_n_array[i] = number.substr(i, 1);
            }
            for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                n_array[i] = received_n_array[j];
            }
            for (var i = 0, j = 1; i < 9; i++, j++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    if (n_array[i] == 1) {
                        n_array[j] = 10 + parseInt(n_array[j]);
                        n_array[i] = 0;
                    }
                }
            }
            let value: any;
            for (var i = 0; i < 9; i++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    value = n_array[i] * 10;
                } else {
                    value = n_array[i];
                }
                if (value != 0) {
                    words_string += words[value] + " ";
                }
                if (
                    (i == 1 && value != 0) ||
                    (i == 0 && value != 0 && n_array[i + 1] == 0)
                ) {
                    words_string += "Crores ";
                }
                if (
                    (i == 3 && value != 0) ||
                    (i == 2 && value != 0 && n_array[i + 1] == 0)
                ) {
                    words_string += "Lakhs ";
                }
                if (
                    (i == 5 && value != 0) ||
                    (i == 4 && value != 0 && n_array[i + 1] == 0)
                ) {
                    words_string += "Thousand ";
                }
                if (
                    i == 6 &&
                    value != 0 &&
                    n_array[i + 1] != 0 &&
                    n_array[i + 2] != 0
                ) {
                    words_string += "Hundred "; // and
                } else if (i == 6 && value != 0) {
                    words_string += "Hundred ";
                }
            }
            words_string = words_string.split("  ").join(" ");
        }
        return words_string;
    };
    function numberToWordMain(n: any) {
        var nums = n.toFixed(2).toString().split(".");
        var whole = numberToWord(nums[0]);
        if (nums.length == 2) {
            var fraction = numberToWord(nums[1]);
            return whole + " Rupees " + "and " + fraction + " Paisa";
        } else {
            return whole + " Rupees ";
        }
    }

    const componentRef = React.useRef(null);
    const onBeforeGetContentResolve: any = React.useRef(null);

    const handleOnBeforeGetContent = React.useCallback(
        (index: number) => {
            return new Promise((resolve: any) => {
                onBeforeGetContentResolve.current = resolve;

                setActiveItem({ ...list[index] });
                setTimeout(() => {
                    resolve();
                }, 0);
            });
        },
        [list]
    );

    const reactToPrintContent = React.useCallback(() => {
        return componentRef.current;
    }, []);

    const generateWALink = (invoice: FormData) => {
        let totalAmount = 0;

        invoice.services.forEach((service) => {
            const subtotal =
                (service.amount * service.quantity * service.gst) / 100 +
                service.amount * service.quantity;
            totalAmount += subtotal;
        });
        const text = encodeURI(
            `Hey ${
                invoice.customerName
            }, \n\nYour invoice is generated. \n\n*Total Amount: ₹${totalAmount.toFixed(
                2
            )}* \n\n\_\`\`\`Umiya Alignment\`\`\`\_`
        );
        return `https://wa.me/${invoice.mobileNumber}?text=${text}`;
    };
    return (
        <>
            <div className="flex flex-col w-full gap-4">
                <div className="gap-5 flex flex-col-reverse md:flex-row md:justify-between md:items-center">
                    <div className="relative">
                        <Input
                            name="Search"
                            type="text"
                            placeholder="Search Invoice..."
                            defaultValue={searchText || ""}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                            }}
                            preIcon="search"
                        />
                        {searchText && (
                            <Icon
                                icon="x-mark"
                                className="h-5 w-5 text-textSecondary absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                                onClick={() => setSearchText("")}
                            />
                        )}
                    </div>
                    <div className="flex gap-4 justify-between">
                        <Button href="/invoice" variant="primary">
                            <Icon
                                icon="plus"
                                className="h-5 w-5 lg:h-5 lg:w-5"
                            />
                            Add Invoice
                        </Button>

                        <div className="flex justify-end">
                            <div className="bg-bgc dark:bg-bgc-dark flex rounded-md p-1">
                                <button
                                    className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
                                        view === "grid"
                                            ? "bg-primary text-white"
                                            : ""
                                    }`}
                                    onClick={() => handleViewChange("grid")}
                                >
                                    <Icon
                                        icon={
                                            view === "grid"
                                                ? "category"
                                                : "category"
                                        }
                                        className="h-6 w-6"
                                    />
                                    <span className="hidden md:block">
                                        Grid
                                    </span>
                                </button>
                                <button
                                    className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
                                        view === "list"
                                            ? "bg-primary text-white"
                                            : ""
                                    }`}
                                    onClick={() => handleViewChange("list")}
                                >
                                    <Icon
                                        icon={view === "list" ? "menu" : "menu"}
                                        className="h-6 w-6"
                                    />
                                    <span className="hidden md:block">
                                        List
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ------------------------------ <OurServiceTable /> ------------------------------ */}
                <div className="">
                    {view === "grid" ? (
                        <div className="w-full grid md:grid-cols-3 2xl:grid-cols-4 grid-cols-1 rounded-md gap-5">
                            {loading ? (
                                <GridSkeleton
                                    rowCount={Math.ceil(
                                        filter.recordPerPage / 4
                                    )}
                                    columnCount={4}
                                />
                            ) : (
                                <>
                                    {list?.length ? (
                                        <>
                                            {list.map((invoice, index) => (
                                                <div
                                                    key={index}
                                                    className="flex md:flex-col rounded-md overflow-hidden shadow-md w-full bg-bgc dark:bg-bgc-dark"
                                                >
                                                    <div className="flex justify-center bg-primary text-textSecondary/80 md:h-32 items-center">
                                                        <Icon
                                                            icon="vector"
                                                            className="h-20 w-32 md:h-20 md:w-20 text-white/80"
                                                        ></Icon>
                                                    </div>
                                                    <div className="flex flex-col w-full gap-1">
                                                        <div className="flex flex-col gap-0 px-2 pb-0">
                                                            <div className="md:text-xl font-bold text-primary">
                                                                {
                                                                    invoice.customerName
                                                                }
                                                            </div>
                                                            <div>
                                                                <p className="opacity-80">
                                                                    {
                                                                        invoice.vehicleCompany
                                                                    }
                                                                    &nbsp;-&nbsp;
                                                                    {
                                                                        invoice.vehicleVariant
                                                                    }
                                                                </p>
                                                                <p className="opacity-80">
                                                                    {
                                                                        invoice.vehicleNo
                                                                    }
                                                                </p>
                                                                <p className="opacity-80">
                                                                    Invoice No:{" "}
                                                                    <span className="italic">
                                                                        &nbsp;#
                                                                        {String(
                                                                            invoice.invoiceID
                                                                        ).padStart(
                                                                            6,
                                                                            "0"
                                                                        )}
                                                                    </span>
                                                                </p>
                                                                <p className=" font-bold">
                                                                    ₹{" "}
                                                                    {getSum(
                                                                        invoice
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="px-2">
                                                            <div className="flex justify-between gap-2 border-t border-border dark:border-border-dark py-1">
                                                                <div className="flex gap-2 items-center">
                                                                    <Link
                                                                        href={generateWALink(
                                                                            invoice
                                                                        )}
                                                                        target="_blank"
                                                                    >
                                                                        <Icon
                                                                            icon="whatsapp"
                                                                            data-tooltip-id="main-tooltip"
                                                                            data-tooltip-content="Send Message"
                                                                            className="bg-green-500 rounded h-5 w-5 lg:h-5 lg:w-5 outline-none text-white float-left"
                                                                        />
                                                                    </Link>
                                                                    <Link
                                                                        href={
                                                                            "tel:" +
                                                                            invoice.mobileNumber
                                                                        }
                                                                        target="_blank"
                                                                    >
                                                                        <Icon
                                                                            icon="phone"
                                                                            data-tooltip-id="main-tooltip"
                                                                            data-tooltip-content="Call"
                                                                            className="rounded h-5 w-5 lg:h-5 lg:w-5 outline-none float-left"
                                                                        />
                                                                    </Link>
                                                                    <span
                                                                        onClick={() =>
                                                                            setActiveItem(
                                                                                {
                                                                                    ...list[
                                                                                        +index
                                                                                    ],
                                                                                }
                                                                            )
                                                                        }
                                                                    >
                                                                        <div className="">
                                                                            <ReactToPrint
                                                                                content={
                                                                                    reactToPrintContent
                                                                                }
                                                                                documentTitle="Invoice"
                                                                                onBeforeGetContent={() =>
                                                                                    handleOnBeforeGetContent(
                                                                                        index
                                                                                    )
                                                                                }
                                                                                removeAfterPrint={
                                                                                    false
                                                                                }
                                                                                trigger={() => {
                                                                                    return (
                                                                                        <Icon
                                                                                            icon="arrow"
                                                                                            data-tooltip-id="main-tooltip"
                                                                                            data-tooltip-content="Download Invoice"
                                                                                            className=" h-5 w-5 lg:h-5 lg:w-5 outline-none hover:cursor-pointer float-left"
                                                                                        />
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-2 items-center">
                                                                    <Icon
                                                                        icon="trash"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                invoice._id
                                                                            )
                                                                        }
                                                                        data-tooltip-id="main-tooltip"
                                                                        data-tooltip-content="Delete Invoice"
                                                                        className="cursor-pointer text-red-400 outline-none h-5 w-5 lg:h-5 lg:w-5 float-left"
                                                                    />
                                                                    <Link
                                                                        href={
                                                                            "/invoice/" +
                                                                            invoice._id
                                                                        }
                                                                    >
                                                                        <Icon
                                                                            icon="pencil-square"
                                                                            data-tooltip-id="main-tooltip"
                                                                            data-tooltip-content="Edit Invoice"
                                                                            className="text-cyan-300 h-5 w-5 outline-none lg:h-5 lg:w-5 float-left"
                                                                        />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {/* {list.map((invoice, index) => (
                                                <div
                                                    key={index}
                                                    className="rounded-md overflow-hidden shadow-md w-full bg-bgc dark:bg-bgc-dark"
                                                >
                                                    <div className="flex justify-center bg-primary text-textSecondary/80 h-32 items-center">
                                                        <Icon
                                                            icon="vector"
                                                            className="h-20 w-20 text-white/80"
                                                        ></Icon>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex flex-col gap-1 p-2 pb-0">
                                                            <h3 className="text-xl font-bold text-primary">
                                                                {
                                                                    invoice.customerName
                                                                }
                                                            </h3>
                                                            <div>
                                                                <p className="">
                                                                    {
                                                                        invoice.vehicleCompany
                                                                    }
                                                                    -
                                                                    {
                                                                        invoice.vehicleVariant
                                                                    }
                                                                </p>
                                                                <p className="">
                                                                    {
                                                                        invoice.vehicleNo
                                                                    }
                                                                </p>
                                                                <p className=" opacity-80">
                                                                    Invoice No:{" "}
                                                                    <span className="italic">
                                                                        &nbsp;#
                                                                        {String(
                                                                            invoice.invoiceID
                                                                        ).padStart(
                                                                            6,
                                                                            "0"
                                                                        )}
                                                                    </span>
                                                                </p>
                                                                <p className=" font-bold">
                                                                    ₹{" "}
                                                                    {getSum(
                                                                        invoice
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between gap-2 border-t border-border dark:border-border-dark p-2">
                                                            <div className="flex gap-2 items-center">
                                                                <Link
                                                                    href={generateWALink(
                                                                        invoice
                                                                    )}
                                                                    target="_blank"
                                                                >
                                                                    <Icon
                                                                        icon="whatsapp"
                                                                        data-tooltip-id="main-tooltip"
                                                                        data-tooltip-content="Send Message"
                                                                        className="bg-green-500 rounded h-5 w-5 lg:h-5 lg:w-5 outline-none text-white float-left"
                                                                    />
                                                                </Link>
                                                                <Link
                                                                    href={
                                                                        "tel:" +
                                                                        invoice.mobileNumber
                                                                    }
                                                                    target="_blank"
                                                                >
                                                                    <Icon
                                                                        icon="phone"
                                                                        data-tooltip-id="main-tooltip"
                                                                        data-tooltip-content="Call"
                                                                        className="rounded h-5 w-5 lg:h-5 lg:w-5 outline-none float-left"
                                                                    />
                                                                </Link>
                                                                <span
                                                                    onClick={() =>
                                                                        setActiveItem(
                                                                            {
                                                                                ...list[
                                                                                    +index
                                                                                ],
                                                                            }
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="">
                                                                        <ReactToPrint
                                                                            content={
                                                                                reactToPrintContent
                                                                            }
                                                                            documentTitle="Invoice"
                                                                            onBeforeGetContent={() =>
                                                                                handleOnBeforeGetContent(
                                                                                    index
                                                                                )
                                                                            }
                                                                            removeAfterPrint={
                                                                                false
                                                                            }
                                                                            trigger={() => {
                                                                                return (
                                                                                    <Icon
                                                                                        icon="arrow"
                                                                                        data-tooltip-id="main-tooltip"
                                                                                        data-tooltip-content="Download Invoice"
                                                                                        className=" h-5 w-5 lg:h-5 lg:w-5 outline-none hover:cursor-pointer float-left"
                                                                                    />
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-2 items-center">
                                                                <Icon
                                                                    icon="trash"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            invoice._id
                                                                        )
                                                                    }
                                                                    data-tooltip-id="main-tooltip"
                                                                    data-tooltip-content="Delete Invoice"
                                                                    className="cursor-pointer text-red-400 outline-none h-5 w-5 lg:h-5 lg:w-5 float-left"
                                                                />
                                                                <Link
                                                                    href={
                                                                        "/invoice/" +
                                                                        invoice._id
                                                                    }
                                                                >
                                                                    <Icon
                                                                        icon="pencil-square"
                                                                        data-tooltip-id="main-tooltip"
                                                                        data-tooltip-content="Edit Invoice"
                                                                        className="text-cyan-300 h-5 w-5 outline-none lg:h-5 lg:w-5 float-left"
                                                                    />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))} */}
                                        </>
                                    ) : (
                                        <>
                                            <div className="md:col-span-3 2xl:col-span-4 col-span-1 text-center">
                                                <NotFound
                                                    type="invoice"
                                                    onClick={() => {
                                                        router.replace(
                                                            "/invoice"
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="overflow-auto md:w-full">
                                <table className="min-w-full bg-white dark:bg-fgc-dark">
                                    <thead>
                                        <tr className=" border-b-2 dark:bg-fgc-dark border-border dark:border-border-dark">
                                            <th className="py-2 px-4">
                                                Invoice Id
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-2 px-4"
                                                onClick={() => {
                                                    sortClick("customerName");
                                                }}
                                            >
                                                <div
                                                    className={`sort ${
                                                        filter.sort ===
                                                        "customerName"
                                                            ? filter.sortDirection ===
                                                              1
                                                                ? "asc"
                                                                : "desc"
                                                            : ""
                                                    }`}
                                                >
                                                    Customer Name
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-2 px-4"
                                                onClick={() => {
                                                    sortClick("vehicleNo");
                                                }}
                                            >
                                                <div
                                                    className={`sort ${
                                                        filter.sort ===
                                                        "vehicleNo"
                                                            ? filter.sortDirection ===
                                                              1
                                                                ? "asc"
                                                                : "desc"
                                                            : ""
                                                    }`}
                                                >
                                                    Vehicle Number
                                                </div>
                                            </th>
                                            {/* <th className="py-2 px-4">Vehicle Number</th> */}
                                            <th
                                                scope="col"
                                                className="py-2 px-4"
                                                onClick={() => {
                                                    sortClick("invoiceDate");
                                                }}
                                            >
                                                <div
                                                    className={`sort ${
                                                        filter.sort ===
                                                        "invoiceDate"
                                                            ? filter.sortDirection ===
                                                              1
                                                                ? "asc"
                                                                : "desc"
                                                            : ""
                                                    }`}
                                                >
                                                    Invoice Date
                                                </div>
                                            </th>
                                            {/* <th className="py-2 px-4">Invoice Date</th> */}
                                            <th className="py-2 px-4">
                                                Amount
                                            </th>
                                            <th className="py-2 px-4">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {loading ? (
                                            <TableSkeleton
                                                rowCount={filter.recordPerPage}
                                                columnCount={5}
                                            />
                                        ) : (
                                            <>
                                                {list?.length ? (
                                                    <>
                                                        {list.map(
                                                            (
                                                                invoice,
                                                                index
                                                            ) => (
                                                                <tr
                                                                    key={index}
                                                                    className="border-b border-border dark:border-border-dark"
                                                                >
                                                                    <td className="py-2 px-4 align-middle">
                                                                        {
                                                                            invoice.invoiceID
                                                                        }
                                                                    </td>
                                                                    <td className="py-2 px-4 align-middle max-w-[100px] truncate">
                                                                        {
                                                                            invoice.customerName
                                                                        }
                                                                    </td>
                                                                    <td className="py-2 px-4 align-middle max-w-[100px] truncate">
                                                                        {
                                                                            invoice.vehicleNo
                                                                        }
                                                                    </td>
                                                                    <td className="py-2 px-4 align-middle">
                                                                        {invoice.invoiceDate
                                                                            ? new Date(
                                                                                  invoice.invoiceDate
                                                                              ).toLocaleDateString(
                                                                                  "en-GB"
                                                                              )
                                                                            : "N/A"}
                                                                    </td>
                                                                    <td className="py-2 px-4 align-middle max-w-[100px] truncate">
                                                                        ₹{" "}
                                                                        {getSum(
                                                                            invoice
                                                                        )}
                                                                    </td>
                                                                    <td className="py-2 px-4">
                                                                        <div className="flex justify-center gap-2">
                                                                            <Icon
                                                                                icon="trash"
                                                                                onClick={() =>
                                                                                    handleDelete(
                                                                                        invoice._id
                                                                                    )
                                                                                }
                                                                                data-tooltip-id="main-tooltip"
                                                                                data-tooltip-content="Delete Invoice"
                                                                                className="text-red-500 h-5 w-5 lg:h-5 lg:w-5 outline-none cursor-pointer float-left"
                                                                            />
                                                                            <Link
                                                                                href={
                                                                                    "/invoice/" +
                                                                                    invoice._id
                                                                                }
                                                                            >
                                                                                <Icon
                                                                                    icon="pencil-square"
                                                                                    data-tooltip-id="main-tooltip"
                                                                                    data-tooltip-content="Edit Invoice"
                                                                                    className="text-cyan-300 h-5 w-5 lg:h-5 lg:w-5 outline-none float-left"
                                                                                />
                                                                            </Link>
                                                                            <span
                                                                                onClick={() =>
                                                                                    setActiveItem(
                                                                                        {
                                                                                            ...list[
                                                                                                +index
                                                                                            ],
                                                                                        }
                                                                                    )
                                                                                }
                                                                            >
                                                                                <ReactToPrint
                                                                                    content={
                                                                                        reactToPrintContent
                                                                                    }
                                                                                    documentTitle="Invoice"
                                                                                    onBeforeGetContent={() =>
                                                                                        handleOnBeforeGetContent(
                                                                                            index
                                                                                        )
                                                                                    }
                                                                                    removeAfterPrint
                                                                                    trigger={() => {
                                                                                        return (
                                                                                            <Icon
                                                                                                icon="arrow"
                                                                                                data-tooltip-id="main-tooltip"
                                                                                                data-tooltip-content="Download Invoice"
                                                                                                className="h-5 w-5 lg:h-5 lg:w-5 hover:cursor-pointer outline-none float-left"
                                                                                            />
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <tr>
                                                            <td colSpan={6}>
                                                                <NotFound
                                                                    type="invoice"
                                                                    onClick={() => {
                                                                        router.replace(
                                                                            "/invoice"
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ------------------------------ Delete Modal ------------------------------ */}
                    {showDeleteInvoice && (
                        <MyDialog
                            open={showDeleteInvoice}
                            onClose={() => setShowDeleteInvoice(false)}
                            onConfirm={() =>
                                confirmDelete(invoiceIdToDelete || "")
                            }
                        />
                    )}
                </div>
                {/* ------------------------------ Pagination ------------------------------ */}

                <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4">
                    <div className="">
                        <select
                            value={filter.recordPerPage}
                            onChange={(e) =>
                                handlePerPageChange(parseInt(e.target.value))
                            }
                            className="px-4 py-2 justify-between items-center bg-fgc dark:bg-fgc-dark  rounded-full block w-fit border border-border dark:border-border-dark outline-none focus:!border-borderFocus dark:focus:!border-borderFocus-dark"
                        >
                            <option value="10">10 per page</option>
                            <option value="20">20 per page</option>
                            <option value="50">50 per page</option>
                        </select>
                    </div>

                    <div className="w-fit">
                        <Pagination
                            currentPage={filter.page}
                            totalRecords={totalRecords}
                            onPageChange={handlePageChange}
                            perPage={filter.recordPerPage}
                        />
                    </div>
                </div>
            </div>

            {/* ------------------------------ Genarate Invoice ------------------------------ */}

            <div style={{ padding: "20px", display: "none" }}>
                <div
                    className="invoice-container"
                    ref={componentRef}
                    style={{ padding: "40px" }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            border: "3px solid black",
                            width: "100%",
                            alignItems: "center",
                            fontSize: "14px",
                        }}
                    >
                        <div
                            style={{
                                padding: "5px",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <div style={{ whiteSpace: "pre-line" }}>
                                <h1
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Umiya Alignment
                                </h1>
                                <div>Opp.-One Furniture,</div>
                                <div>Veraval Road, Keshod-362220.</div>
                                <div>
                                    <b>
                                        Mobile No:
                                        <Link href="tel:+917874457737">
                                            +91 78744 57737
                                        </Link>
                                    </b>
                                </div>
                            </div>
                            <Image
                                src="/umiya.png"
                                height={500}
                                width={500}
                                alt=""
                                style={{ width: "250px", height: "100px" }}
                            />
                        </div>
                        <table
                            style={{
                                minWidth: "100%",
                                borderCollapse: "collapse",
                                borderLeft: 0,
                            }}
                        >
                            <tbody>
                                <tr
                                    style={{
                                        borderTop: "2px solid black",
                                        borderBottom: "2px solid black",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <td style={{ padding: "5px" }}>
                                        <p>Debit Memo</p>
                                    </td>

                                    <td style={{ padding: "5px" }}>
                                        <p>SALES INVOICE</p>
                                    </td>
                                    <td style={{ padding: "5px" }}>
                                        <p>Original</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <table
                                style={{
                                    minWidth: "100%",
                                    borderCollapse: "collapse",
                                    borderLeft: 0,
                                    fontSize: "14px",
                                }}
                            >
                                <tbody style={{ textAlign: "center" }}>
                                    {/* Start Address tr */}
                                    <tr>
                                        <td
                                            colSpan={5}
                                            rowSpan={2}
                                            style={{
                                                borderRight: "2px solid black",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: "5px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                }}
                                                            >
                                                                <p
                                                                    style={{
                                                                        fontWeight:
                                                                            "bold",
                                                                    }}
                                                                >
                                                                    M/s:&nbsp;&nbsp;
                                                                </p>
                                                            </td>
                                                            <td>
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        gap: "5px",
                                                                        fontWeight:
                                                                            "bold",
                                                                        textTransform:
                                                                            "capitalize",
                                                                    }}
                                                                >
                                                                    {
                                                                        activeItem?.customerName
                                                                    }
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        gap: "5px",
                                                                    }}
                                                                >
                                                                    {
                                                                        activeItem
                                                                            ?.address
                                                                            ?.address1
                                                                    }
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        gap: "5px",
                                                                    }}
                                                                >
                                                                    <span>
                                                                        {
                                                                            activeItem
                                                                                ?.address
                                                                                ?.city
                                                                        }
                                                                        ,
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            activeItem
                                                                                ?.address
                                                                                ?.state
                                                                        }
                                                                        ,
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            activeItem
                                                                                ?.address
                                                                                ?.country
                                                                        }
                                                                        ,
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            activeItem
                                                                                ?.address
                                                                                ?.zipcode
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                <div
                                                    style={{
                                                        marginTop: "20px",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "5px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    width: "110px",
                                                                    display:
                                                                        "inline-block",
                                                                }}
                                                            >
                                                                Contact No.
                                                            </span>
                                                            :
                                                        </p>
                                                        <Link href="tel:{activeItem?.mobileNumber}">
                                                            {
                                                                activeItem?.mobileNumber
                                                            }
                                                        </Link>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            marginTop: "",
                                                        }}
                                                    >
                                                        <p>
                                                            <span
                                                                style={{
                                                                    width: "110px",
                                                                    display:
                                                                        "inline-block",
                                                                }}
                                                            >
                                                                Warranty No.
                                                            </span>
                                                            :
                                                        </p>
                                                        <p>
                                                            Place Of Supply :
                                                            24-Gujarat
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td
                                            colSpan={3}
                                            style={{ backgroundColor: "#eee" }}
                                        >
                                            <div>
                                                <div
                                                    style={{
                                                        padding: "5px",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            display: "flex",
                                                            gap: "5px",
                                                            marginBottom:
                                                                "-20px",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    width: "110px",
                                                                    display:
                                                                        "inline-block",
                                                                }}
                                                            >
                                                                Invoice No.
                                                            </span>
                                                            :
                                                        </p>
                                                        {activeItem?.invoiceID}
                                                    </span>
                                                    <br />
                                                    {activeItem?.invoiceDate && (
                                                        <span
                                                            style={{
                                                                display: "flex",
                                                                gap: "5px",
                                                            }}
                                                        >
                                                            <p
                                                                style={{
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        width: "110px",
                                                                        display:
                                                                            "inline-block",
                                                                    }}
                                                                >
                                                                    Invoice Date
                                                                </span>
                                                                :
                                                            </p>
                                                            {new Date(
                                                                activeItem?.invoiceDate
                                                            ).toLocaleDateString(
                                                                "en-GB"
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            colSpan={3}
                                            style={{
                                                borderTop: "2px solid black",
                                            }}
                                        >
                                            <div style={{}}>
                                                <div
                                                    style={{
                                                        paddingLeft: "5px",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "5px",
                                                            marginBottom:
                                                                "-20px",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    width: "92px",
                                                                    display:
                                                                        "inline-block",
                                                                }}
                                                            >
                                                                Vehicle Name
                                                            </span>
                                                            :
                                                        </p>
                                                        {
                                                            activeItem?.vehicleCompany
                                                        }
                                                        -
                                                        {
                                                            activeItem?.vehicleVariant
                                                        }
                                                    </div>
                                                    <br />
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "5px",
                                                            marginBottom:
                                                                "-20px",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    width: "92px",
                                                                    display:
                                                                        "inline-block",
                                                                }}
                                                            >
                                                                Vehicle No.
                                                            </span>
                                                            :
                                                        </p>
                                                        {activeItem?.vehicleNo}
                                                    </div>
                                                    <br />
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "5px",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    width: "92px",
                                                                    display:
                                                                        "inline-block",
                                                                }}
                                                            >
                                                                KM
                                                            </span>
                                                            :
                                                        </p>
                                                        {activeItem?.kilometers}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th
                                            style={{
                                                border: "2px solid black",
                                                padding: "8px 16px",
                                                textAlign: "center",
                                                borderLeft: "0",
                                            }}
                                        >
                                            Sr.
                                        </th>
                                        <th
                                            style={{
                                                border: "2px solid black",
                                                padding: "8px 16px",
                                                textAlign: "center",
                                            }}
                                        >
                                            Description of Goods
                                        </th>
                                        <th
                                            style={{
                                                border: "2px solid black",
                                                padding: "8px 16px",
                                                textAlign: "center",
                                            }}
                                        >
                                            Sr. No.
                                        </th>
                                        <th
                                            style={{
                                                border: "2px solid black",
                                                padding: "8px 16px",
                                                textAlign: "center",
                                            }}
                                        >
                                            HSN/SAC
                                        </th>
                                        <th
                                            style={{
                                                border: "2px solid black",
                                                padding: "8px 16px",
                                                textAlign: "center",
                                            }}
                                        >
                                            Quantity
                                        </th>
                                        <th
                                            style={{
                                                border: "2px solid black",
                                                padding: "8px 16px",
                                                textAlign: "center",
                                            }}
                                        >
                                            Rate
                                        </th>
                                        <th
                                            style={{
                                                border: "2px solid black",
                                                padding: "8px 16px",
                                                textAlign: "center",
                                            }}
                                        >
                                            GST%
                                        </th>
                                        <th
                                            style={{
                                                border: "2px solid black",
                                                padding: "8px 16px",
                                                textAlign: "center",
                                                borderRight: "0",
                                            }}
                                        >
                                            Amount
                                        </th>
                                    </tr>
                                    {activeItem?.services?.map(
                                        (service: any, index: any) => (
                                            <tr
                                                key={index}
                                                style={{ width: "100%" }}
                                            >
                                                <td
                                                    style={{
                                                        borderRight:
                                                            "2px solid black",
                                                        borderBottom:
                                                            "1px solid #ccc",
                                                        padding: "8px 16px",
                                                        textAlign: "center",
                                                        borderLeft: "0",
                                                    }}
                                                >
                                                    {index + 1}
                                                </td>
                                                <td
                                                    style={{
                                                        borderRight:
                                                            "2px solid black",
                                                        borderBottom:
                                                            "1px solid #ccc",
                                                        padding: "8px 16px",
                                                        textAlign: "center",
                                                        maxWidth: "300px",
                                                    }}
                                                >
                                                    {service.title}
                                                </td>
                                                <td
                                                    style={{
                                                        borderRight:
                                                            "2px solid black",
                                                        borderBottom:
                                                            "1px solid #ccc",
                                                        padding: "8px 16px",
                                                        textAlign: "center",
                                                        maxWidth: "130px",
                                                        overflow: "hidden",
                                                        overflowWrap:
                                                            "anywhere",
                                                    }}
                                                >
                                                    {service.serialNo}
                                                </td>
                                                <td
                                                    style={{
                                                        borderRight:
                                                            "2px solid black",
                                                        borderBottom:
                                                            "1px solid #ccc",
                                                        padding: "8px 16px",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {service.hsnSac}
                                                </td>
                                                <td
                                                    style={{
                                                        borderRight:
                                                            "2px solid black",
                                                        borderBottom:
                                                            "1px solid #ccc",
                                                        padding: "8px 16px",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {service.quantity.toFixed(
                                                        2
                                                    )}
                                                </td>
                                                <td
                                                    style={{
                                                        borderRight:
                                                            "2px solid black",
                                                        borderBottom:
                                                            "1px solid #ccc",
                                                        padding: "8px 16px",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {service.amount}
                                                </td>
                                                <td
                                                    style={{
                                                        borderRight:
                                                            "2px solid black",
                                                        borderBottom:
                                                            "1px solid #ccc",
                                                        padding: "8px 16px",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {service.gst}
                                                </td>
                                                <td
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #ccc",
                                                        padding: "8px",
                                                        textAlign: "right",
                                                        borderRight: "0",
                                                    }}
                                                >
                                                    {(
                                                        (service.amount *
                                                            service.quantity *
                                                            service.gst) /
                                                            100 +
                                                        service.amount *
                                                            service.quantity
                                                    ).toFixed(2)}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    <tr>
                                        <td
                                            colSpan={2}
                                            style={{
                                                fontWeight: "bold",
                                                border: "2px solid black",
                                                padding: "8px 16px",
                                                textAlign: "left",
                                                borderLeft: "0",
                                                fontSize: "12px",
                                                backgroundColor: "#eee",
                                            }}
                                        >
                                            GSTIN No. :
                                            <span className="ml-12">-</span>
                                        </td>
                                        <td
                                            colSpan={2}
                                            style={{
                                                border: "2px solid black",
                                                padding: "8px 16px",
                                                textAlign: "center",
                                            }}
                                        ></td>
                                        <td
                                            style={{
                                                border: "2px solid black",
                                                padding: "8px 16px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {activeItem?.services
                                                ?.reduce(
                                                    (total, service) =>
                                                        total +
                                                        service.quantity,
                                                    0
                                                )
                                                ?.toFixed(2)}
                                        </td>
                                        <td
                                            style={{
                                                border: "2px solid black",
                                                padding: "8px 16px",
                                                textAlign: "center",
                                            }}
                                        ></td>
                                        <td
                                            style={{
                                                border: "2px solid black",
                                                padding: "8px 16px",
                                                textAlign: "center",
                                            }}
                                        ></td>
                                        <td
                                            style={{
                                                border: "2px solid black",
                                                padding: "8px",
                                                textAlign: "end",
                                                borderRight: "0",
                                            }}
                                        >
                                            {activeItem && getSum(activeItem)}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td
                                            colSpan={5}
                                            style={{
                                                borderRight: "2px solid black",
                                                textAlign: "left",
                                                padding: "0px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    flex: "1 0 65%",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        padding: "5px",
                                                        minHeight: "50px",
                                                        display: "inline-block",
                                                        width: "100%",
                                                    }}
                                                >
                                                    Bill Amount (in words) :{" "}
                                                    <span
                                                        style={{
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {activeItem &&
                                                            numberToWordMain(
                                                                +getSum(
                                                                    activeItem
                                                                )
                                                            )}
                                                    </span>
                                                </span>
                                                <div
                                                    style={{
                                                        borderTop:
                                                            "2px solid black",
                                                        padding: "5px",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "5px",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    width: "110px",
                                                                    display:
                                                                        "inline-block",
                                                                }}
                                                            >
                                                                Bank & Branch
                                                            </span>
                                                            :
                                                        </p>
                                                        <span className="ml-12">
                                                            -
                                                        </span>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "5px",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    width: "110px",
                                                                    display:
                                                                        "inline-block",
                                                                }}
                                                            >
                                                                Account No.
                                                            </span>
                                                            :
                                                        </p>
                                                        <span className="ml-12">
                                                            -
                                                        </span>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "5px",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    width: "110px",
                                                                    display:
                                                                        "inline-block",
                                                                }}
                                                            >
                                                                IFSC Code
                                                            </span>
                                                            :
                                                        </p>
                                                        <span className="ml-12">
                                                            -
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td
                                            colSpan={3}
                                            style={{
                                                padding: "0px",
                                                textAlign: "left",
                                            }}
                                        >
                                            <div style={{ width: "100%" }}>
                                                <div
                                                    style={{
                                                        padding: "8px",
                                                        minHeight: "90px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Note :
                                                    </span>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        borderTop:
                                                            "2px solid black",
                                                        padding: "8px",
                                                        backgroundColor: "#eee",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Grand Total :
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {activeItem &&
                                                            getSum(activeItem)}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div
                            style={{
                                borderTop: "2px solid black",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                style={{
                                    padding: "5px",
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                    }}
                                >
                                    Terms & Condition :
                                </p>
                                <p
                                    style={{
                                        marginTop: "10px",
                                        fontSize: "12px",
                                    }}
                                >
                                    (1)ટાયર માં કંપની મેન્યુફેક્ચરીંગ ખામીની
                                    જવાબદારી કંપનીની રહેશે.
                                </p>
                                <p style={{ fontSize: "12px" }}>
                                    (2)કલેઇમમાં મોકલેલ ટાયર ટ્યુબનો ખર્ચ તથા
                                    ઘસારો ગ્રાહકે આપવાનો રહેશે.
                                </p>
                                <p style={{ fontSize: "12px" }}>
                                    (3)ટાયર-ટ્યુબ ક્લેઈમમાં મોકલ્યા બાદ કંપનીનો
                                    નિર્ણય ગ્રાહકે માન્ય રાખવાનો રહેશે.
                                </p>
                            </div>
                            <div
                                style={{
                                    paddingTop: "30px",
                                    fontWeight: "bold",
                                }}
                            >
                                <p
                                    style={{
                                        textAlign: "center",
                                        fontSize: "12px",
                                    }}
                                >
                                    E. & O.E.
                                </p>
                                <p style={{ fontSize: "12px" }}>
                                    Subject To KESHOD Jurisdiction Only.
                                </p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-around",
                                }}
                            >
                                <p
                                    style={{
                                        margin: "10px",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    For, Umiya Alignment
                                </p>
                                <p style={{ textAlign: "center" }}>
                                    (Authorised Signatory)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Invoices;
