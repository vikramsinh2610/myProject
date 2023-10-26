import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { TbTemplate } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import { BsFonts } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import logo from "@/assets/images/logo.webp";
import logoIcon from "@/assets/images/logo-icon.png";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const sidebarLinks = [
  {
    key: "Dashboard",
    label: "Dashboard",
    path: "/",
    icon: <AiOutlineDashboard />,
  },
  {
    key: "Templates",
    label: "Templates",
    path: "/templates",
    icon: <TbTemplate />,
  },
  {
    key: "Fonts",
    label: "Fonts",
    path: "/fonts",
    icon: <BsFonts />,
  },
  {
    key: "Users",
    label: "Users",
    path: "/users",
    icon: <FiUsers />,
  },
  {
    key: "Account",
    label: "Account",
    path: "/profile",
    icon: <CgProfile />,
  },
];

export default function Sidebar({ sidebarIsOpen, btnToggle }: any) {
  const router = useRouter();
  const { user }: any = useAuth();

  return (
    <div
      className={`duration-800 fixed z-20 h-full overflow-hidden border-r border-dashed border-lightGray bg-white transition ease-out md:relative ${
        sidebarIsOpen
          ? "w-64 shrink-0 grow-0 basis-64 -translate-x-64 md:w-64 md:translate-x-0"
          : "w-64 shrink-0 grow-0 basis-64 translate-x-0 md:w-20 md:basis-20 md:translate-x-0"
      }`}
    >
      <span
        onClick={() => btnToggle()}
        className="min-h-8 absolute top-3 right-3 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-solid border-red-200 bg-transparent p-1 text-textColor md:hidden"
      >
        <RxCross1 />
      </span>
      <div className="mt-10 border-b border-solid border-gray-200 p-3 py-5 md:mt-0 md:border-none md:py-7">
        <Image
          src={logo}
          alt="Picture of the author"
          style={{ width: "175px", margin: "0 auto" }}
          className={`"w-40" ${sidebarIsOpen ? "block" : "block md:hidden"}`}
        />
        <Image
          src={logoIcon}
          alt="Picture of the author"
          style={{ width: "175px", margin: "0 auto" }}
          className={`"w-40" ${sidebarIsOpen ? "hidden" : "hidden md:block"}`}
        />
      </div>

      <div className="mt-3 flex w-64 flex-col md:mt-6">
        <div
          className={`"text-center text-textColor" mt-5 text-center text-xl font-bold md:mt-0 ${
            sidebarIsOpen ? "block" : "block md:hidden"
          }`}
        >
          <div className="m-auto mb-2 h-28 w-28 overflow-hidden rounded-full border-2 border-solid border-white shadow-xl">
            <Image
              src={user?.user?.profilePhoto}
              alt="Profile"
              width={60}
              height={60}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          {user?.user?.firstName} {user?.user?.lastName}
        </div>
        <ul className="mt-8 flex flex-col gap-2 md:mt-12">
          {sidebarLinks.map((item, id) => {
            return (
              <Link
                // className={router.pathname == item?.path ? "active" : ""}
                key={id}
                href={item?.path}
                className={`hover-no-underline text-md flex items-center gap-4 border-l-4 border-solid  px-6 py-2.5 font-medium transition duration-300 ease-out  ${
                  router.asPath === item.path
                    ? "border-themeColor bg-lightPink text-themeColor"
                    : "border-transparent bg-transparent text-gray-500 hover:border-themeColor hover:bg-lightPink hover:text-themeColor"
                }`}
              >
                <span
                  className={`text-[22px] transition duration-150 ease-out group-hover:text-themeColor  ${
                    router.asPath === item.path
                      ? "text-themeColor"
                      : "text-textColor group-hover:text-themeColor"
                  }`}
                >
                  {item?.icon}
                </span>
                <span
                  className={`"w-40" ${
                    sidebarIsOpen ? "block" : "block md:hidden"
                  }`}
                >
                  {item?.label}
                </span>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
