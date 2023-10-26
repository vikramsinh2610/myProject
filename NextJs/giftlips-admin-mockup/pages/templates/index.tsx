import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination/Pagination";
import http from "@/services/http.service";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function Templates() {
  const session = useSession();
  const router = useRouter();

  const [tableFilter, setTableFilter] = useState("");
  const [templatesData, setTemplatesData] = useState([]);
  const [tableItemsPerPage, setTableItemsPerPage] = useState(10);
  const [tablePage, setTablePage] = useState(1);
  const [tableTotalPages, setTableTotalPages] = useState(1);
  const [progress, setProgress] = useState(30);

  const getTemplates = async () => {
    try {
      const response = await http.get(
        `/admin/templates?search=${tableFilter}&page=${tablePage}&limit=${tableItemsPerPage}`
      );
      const data = response?.data;
      console.log(data);

      if (data?.docs?.length > 0) {
        setTemplatesData(data?.docs);
        setTableTotalPages(data?.totalDocs);
      }
    } catch (error: any) {
      console.error(error.response);
    }
  };

  useEffect(() => {
    getTemplates();
  }, [tableFilter, tableItemsPerPage, tablePage]);

  useEffect(() => {
    if (session.data != undefined && session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, router]);

  useEffect(() => {
    setProgress(100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (e: any, _id: any) => {
    Swal.fire({
      icon: "error",
      title: "Are you sure?",
      text: "You are about to delete this template and you will not be able to recover it.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: { confirmButton: "bg-danger" },
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          const response = await http.delete(`/admin/templates/${_id}`);
          if (response?.data) {
            toast.success("Template delete Successfully");
            void getTemplates();
          }
        } catch (e: any) {
          console.error(e);
        }
      }
    });
  };

  return (
    <Layout>
      <Head>
        <title>Templates</title>
      </Head>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-5">
        <div className="">
          <h1 className="text-2xl font-bold text-neutral-800">Templates</h1>
        </div>
        <div className="relative flex h-10 min-w-[70px] items-center">
          <button
            className="text-md flex h-10 items-center justify-center rounded-lg bg-themeColor p-1 px-6 text-white"
            onClick={() => {
              router.push("/templates/createTemplate");
            }}
          >
            Create new templates
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
        <div className="table-responsive mb-5 mt-5 overflow-x-auto">
          <table className="table-normal mb-5 table w-full">
            <thead className="sticky top-0 border-b-2 border-solid border-gray-200">
              <tr>
                <th className="bg-transparent bg-white normal-case text-textColor">
                  Cover Url
                </th>
                <th className="bg-transparent bg-white normal-case text-textColor">
                  Title
                </th>
                <th className="bg-transparent bg-white normal-case text-textColor">
                  Description
                </th>
                <th className="bg-transparent bg-white normal-case text-textColor"></th>
              </tr>
            </thead>
            <tbody>
              {templatesData?.length > 0 &&
                templatesData.map((item: any, id: any) => (
                  <tr key={id} className="bg-white">
                    <td
                      scope="row"
                      key={item?._id}
                      className="bg-white py-2.5 text-sm text-gray-500"
                    >
                      <Image
                        src={item?.coverUrl}
                        alt="Template Image"
                        width={45}
                        height={45}
                        className="rounded-md border border-solid"
                      />
                    </td>
                    <td className="py-2.5 text-sm text-gray-500">
                      {item?.title}
                    </td>
                    <td className="py-2.5 text-sm text-gray-500">
                      {item?.description}
                    </td>

                    <td className="gap-1 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          className="flex h-8 w-8 items-center justify-center gap-2 rounded-lg border border-solid border-textColor p-1 text-textColor"
                          onClick={() => {
                            router.push(`/templates/${item?._id}/edit`);
                          }}
                        >
                          <MdEdit className="h-5 w-5" />
                        </button>
                        <button
                          className="flex h-8 w-8 items-center justify-center gap-2 rounded-lg border border-solid border-themeColor p-1 text-themeColor"
                          onClick={(e: any) => handleDelete(e, item?._id)}
                        >
                          <MdDeleteForever className="h-5 w-5" />
                        </button>
                      </div>
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
      </div>
    </Layout>
  );
}
