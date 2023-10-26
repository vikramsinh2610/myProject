import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination/Pagination";
import { devLog } from "@/helpers/logger";
import http from "@/services/http.service";
import { useSession } from "next-auth/react";
import { MdDeleteForever } from "react-icons/md";
import FontModal from "@/components/FontModal";
import Swal from "sweetalert2";

export default function Fonts() {
  const session = useSession();
  const router = useRouter();
  const [progress, setProgress] = useState(30);

  const [tableFilter, setTableFilter] = useState("");
  const [fonts, setFonts] = useState([]);
  const [tablePage, setTablePage] = useState();
  const [tableItemsPerPage, setTableItemsPerPage] = useState(10);
  const [tableTotalPages, setTableTotalPages] = useState();
  const [showModal, setShowModal] = useState(false);

  const getFonts = useCallback(async () => {
    try {
      const response = await http.get(
        `/admin/fonts?search=${tableFilter}&limit=${tableItemsPerPage}&page=${tablePage}`
      );
      const data = response.data;
      devLog(data);
      if (data) {
        setFonts(data?.docs);
        setTableTotalPages(data?.totalPages);
      }
    } catch (e: any) {
      devLog(e);
    }
  }, [tableFilter, tableItemsPerPage, tablePage]);

  const removeFonts = async ({ fontId }: any) => {
    Swal.fire({
      icon: "error",
      title: "Are you sure?",
      text: "You are about to delete this font and you will not be able to recover it.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: { confirmButton: "bg-danger" },
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          const response = await http.put(`/admin/fonts/delete`, { fontId });
          if (response?.data) {
            void getFonts();
          }
        } catch (e: any) {
          console.error(e);
        }
      }
    });
  };

  useEffect(() => {
    getFonts();
  }, [tableFilter, tableItemsPerPage, tablePage]);

  useEffect(() => {
    if (session.data != undefined && session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, router]);

  useEffect(() => {
    setProgress(100);
  }, []);

  return (
    <>
      <Layout>
        <Head>
          <title>Fonts</title>
        </Head>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-5">
          <div className="">
            <h1 className="text-2xl font-bold text-neutral-800">Templates</h1>
          </div>
          <div className="relative flex h-10 min-w-[70px] items-center">
            <button
              className="text-md flex h-10 items-center justify-center rounded-lg bg-themeColor p-1 px-6 text-white"
              onClick={() => setShowModal(!showModal)}
            >
              Add new Fonts
            </button>
          </div>
        </div>
        <div className="rounded-lg bg-base-100 p-4 shadow-lg lg:col-start-8 lg:col-end-13">
          <div className="relative flex h-10 min-w-[200px] items-center justify-end">
            <input
              type="text"
              placeholder="Search"
              value={tableFilter}
              className="h-10 min-w-[200px] rounded-lg bg-gray-100 p-2 px-4 pr-12 text-sm text-gray-500 focus:border-transparent focus:outline-none focus-visible:border-transparent focus-visible:outline-none"
              onChange={(e: any) => setTableFilter(e.target.value)}
            />
          </div>
          <table className="table-normal mb-5 table w-full">
            <thead className="sticky top-0 border-b-2 border-solid border-gray-200">
              <tr>
                <th className="bg-transparent bg-white normal-case text-textColor">
                  Name
                </th>
                <th className="bg-transparent bg-white normal-case text-textColor">
                  Url
                </th>
                <th className="bg-transparent bg-white normal-case text-textColor"></th>
              </tr>
            </thead>
            <tbody>
              {fonts?.length > 0 &&
                fonts.map((item: any, id: any) => (
                  <tr key={id} className="bg-white">
                    <td
                      scope="row"
                      key={item?._id}
                      className="bg-white py-2.5 text-sm text-gray-500"
                    >
                      {item?.name}
                    </td>
                    <td className="py-2.5 text-sm text-gray-500">
                      {item?.url}
                    </td>
                    <td className="py-2.5 text-sm text-gray-500">
                      <>
                        <button
                          className="flex h-8 w-8 items-center justify-center gap-2 rounded-lg border border-solid border-themeColor p-1 text-themeColor"
                          onClick={() => removeFonts(item?._id)}
                        >
                          <MdDeleteForever className="h-5 w-5" />
                        </button>
                      </>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="flex flex-wrap items-center justify-between gap-2 ">
            <Pagination
              total={tableTotalPages}
              onPageChange={(page: any) => setTablePage(page)}
              page={tablePage}
              pageSize={tableItemsPerPage}
            />
            <div className="flex items-center gap-2 ">
              <label htmlFor="Item per Page" className="text-sm text-textColor">
                Item per Page
              </label>
              <select
                name="Item per Page"
                id="GraphView"
                className="h-10 min-w-[100px] cursor-pointer rounded-lg bg-gray-100 p-2 px-4 text-sm text-gray-500 focus:border-transparent focus:outline-none focus-visible:border-transparent focus-visible:outline-none"
                onChange={(e: any) => setTableItemsPerPage(e.target.value)}
              >
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
        </div>
      </Layout>
      {showModal && (
        <FontModal setShowModal={setShowModal} getFonts={getFonts} />
      )}
    </>
  );
}
