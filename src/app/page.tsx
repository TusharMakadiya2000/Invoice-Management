import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

export default function Home() {
  return (
    <main className="relative bg-white">
      <Header />
      <div className="bg-gradient-primary dark:bg-fgc-dark px-6 lg:px-18">
        {/* Start Header */}

        {/* Start Hero */}
        <div className="container m-auto">
          <div className="w-full py-9 lg:py-18 justify-between items-center grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 bg-[url('/images/hero-bg.svg')] bg-no-repeat bg-left-bottom lg:bg-center">
            <div className="grow shrink flex-col justify-between items-start gap-10 flex max-w-2xl m-auto lg:m-0">
              <div className="grid gap-6">
                <div className="text-32 lg:text-6xl font-extrabold !leading-[120%]">
                  Creating the future of medicine.
                </div>
                <div className="text-textSecondary text-sm">
                  We connect patients from the Middle East with the best
                  specialized doctors worldwide.
                </div>
              </div>
              <div className="w-full lg:w-auto gap-4 flex flex-col lg:flex-row">
                {/* <Link
                  href={"/check-your-symptoms"}
                  className="flex items-center justify-center w-full lg:w-auto px-4 py-3.5 lg:px-8 lg:py-4 bg-fgc rounded-2xl text-white text-base font-semibold"
                >
                  Check your symptoms
                </Link> */}
                <Link
                  href={"/email"}
                  className="flex items-center justify-center w-full lg:w-auto px-4 py-3.5 lg:px-8 lg:py-4 bg-gradient-secondary rounded-2xl text-white text-base font-semibold"
                >
                  Register
                </Link>
                <Link
                  href={"/login"}
                  className="flex items-center justify-center w-full lg:w-auto px-4 py-3.5 lg:px-8 lg:py-4 bg-gradient-secondary rounded-2xl text-white text-base font-semibold"
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="my-5 lg:my-0 flex justify-center max-w-xl m-auto lg:m-0">
              <div className="w-[80%] lg:w-[526px]  p-8 lg:p-[60px] relative">
                <Image
                  src={"/home-frame.svg"}
                  height={60}
                  width={40}
                  alt=""
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Footer */}
      <Footer />
    </main>
  );
}
