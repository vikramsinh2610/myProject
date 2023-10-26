import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import { useSession } from "next-auth/react";

export default function Layout({ children }) {
  const session = useSession();
  const router = useRouter();

  const [sidebarIsOpen, setSidebarOpen] = useState<boolean>(true);
  const toggleSidebar = (): void => setSidebarOpen(!sidebarIsOpen);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, router]);

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarIsOpen={sidebarIsOpen} btnToggle={toggleSidebar} />
        <div
          className={`"h-screen " flex-grow overflow-y-auto overflow-x-hidden bg-bgColor
          ${sidebarIsOpen ? "" : ""}
          `}
        >
          <Header toggleSidebar={toggleSidebar} sidebarIsOpen={sidebarIsOpen} />
          <div className="relative flex h-template flex-col justify-between">
            <main className="p-6">
              {session.status === "loading" && <div>Loading...</div>}
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
