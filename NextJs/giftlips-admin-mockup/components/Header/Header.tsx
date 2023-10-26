import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { HiMenu } from "react-icons/hi";
import { IoMdLogOut } from "react-icons/io";
import { signOut } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";

export default function Header({ toggleSidebar, sidebarIsOpen }: any) {
  const router = useRouter();
  const { user }: any = useAuth();

  const handleLogout = async () => {
    localStorage.clear();
    signOut();
    router.push("/login");
  };
  return (
    <div className="navbar sticky w-full bg-base-300 p-0 shadow-md shadow-base-300 top-0 z-50">
      <div className="navbar justify-between bg-base-100">
        <label
          htmlFor="my-drawer-3"
          className="btn-ghost btn-square btn hover:bg-transparent"
          onClick={toggleSidebar}
        >
          <HiMenu className="h-6 w-6" />
        </label>
        <div className="navbar-end w-full gap-8">
          {!sidebarIsOpen && (
            <div className="dropdown-end dropdown">
              <label
                tabIndex={0}
                className="flex cursor-pointer items-center gap-1.5 font-medium text-gray-500"
              >
                <div className="mr-2 h-10 w-10 overflow-hidden rounded-full border-2 border-solid border-white shadow-xl">
                  <Image
                    src={user?.user?.profilePhoto}
                    alt="Profile"
                    width={60}
                    height={60}
                  />
                </div>
                {user?.user?.firstName}
                {user?.user?.lastName}
              </label>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-themeColor text-xl text-white"
          >
            <IoMdLogOut />
          </button>
        </div>
      </div>
    </div>
  );
}
