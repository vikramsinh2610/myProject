import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import http from "@/services/http.service";
import Pagination from "@/components/Pagination/Pagination";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function Users() {
  const session = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableFilter, setTableFilter] = useState("");
  const [tableItemsPerPage, setTableItemsPerPage] = useState(10);
  const [tablePage, setTablePage] = useState(1);
  const [tableTotalPages, setTableTotalPages] = useState(1);

  const getUser = useCallback(async () => {
    try {
      setTableLoading(true);
      const response = await http.get(
        `/admin/users?search=${tableFilter}&limit=${tableItemsPerPage}&page=${tablePage}`
      );
      const data = response?.data;
      if (data?.docs.length > 0) {
        setTableTotalPages(data.totalDocs);
        setUsers(
          response.data.docs.map((i: any) => {
            return {
              id: i._id,
              firstName: i.firstName || "",
              lastName: i.lastName || "",
              email: i.email || "",
              isStaff: i.isStaff,
            };
          })
        );
      }
    } catch (e: any) {
      console.error(e.response);
    }
  }, [tableFilter, tableItemsPerPage, tablePage]);

  const changeRole = async (userId: string, isStaff: boolean) => {
    Swal.fire({
      icon: "error",
      title: "Are you sure?",
      text: "You are about to change a user role.",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      customClass: { confirmButton: "bg-danger" },
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          setTableLoading(true);
          const response = await http.put(`/admin/users/${userId}`, {
            isStaff,
          });
          if (response?.data) {
            setUsers(
              users.map((i: any) => {
                if (i.id === userId) {
                  return { ...i, isStaff };
                }
                return i;
              })
            );
          }
        } catch (e: any) {
          console.error(e);
        }
      }
    });
  };

  useEffect(() => {
    getUser();
  }, [tableFilter, tableItemsPerPage, tablePage]);
  useEffect(() => {
    if (session.data != undefined && session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, router]);

  return (
    <>
      <Layout>
        <Head>
          <title>Users</title>
        </Head>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-5">
          <div className="">
            <h1 className="text-2xl font-bold text-neutral-800">Users</h1>
          </div>
          <div className="relative flex h-10 min-w-[200px] items-center">
            <input
              type="text"
              placeholder="Search"
              value={tableFilter}
              className="h-10 min-w-[200px] rounded-lg bg-white p-2 px-4 pr-12 text-sm text-gray-500 shadow-lg focus:border-transparent focus:outline-none focus-visible:border-transparent focus-visible:outline-none"
              onChange={(e: any) => setTableFilter(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-lg bg-base-100 p-4 shadow-lg lg:col-start-8 lg:col-end-13">
          <div className="table-responsive mb-5 overflow-x-auto">
            <table className="table-normal mb-5 table w-full">
              <thead className="sticky top-0 border-b-2 border-solid border-gray-200">
                <tr>
                  <th className="bg-transparent bg-white normal-case text-textColor">
                    First Name
                  </th>
                  <th className="bg-transparent bg-white normal-case text-textColor">
                    Last Name
                  </th>
                  <th className="bg-transparent bg-white normal-case text-textColor">
                    Email
                  </th>
                  <th className="bg-transparent bg-white normal-case text-textColor">
                    Role
                  </th>
                  <th className="bg-transparent bg-white normal-case text-textColor"></th>
                </tr>
              </thead>
              <tbody>
                {users?.length > 0 &&
                  users.map((item: any, id: any) => (
                    <tr key={id} className="bg-white">
                      <td
                        scope="row"
                        key={item?._id}
                        className="bg-white py-2.5 text-sm text-gray-500"
                      >
                        {item?.firstName}
                      </td>
                      <td className="py-2.5 text-sm text-gray-500">
                        {item?.lastName}
                      </td>
                      <td className="py-2.5 text-sm text-gray-500">
                        {item?.email}
                      </td>
                      <td className="py-2.5 text-sm text-gray-500">
                        <span
                          className={`inline-block min-w-[70px] rounded px-2 py-1 text-center font-medium ${
                            item?.isStaff
                              ? "bg-lightPurple text-purple"
                              : "bg-lightGreen text-green"
                          }`}
                        >
                          {item?.isStaff ? "Staff" : "Regular"}
                        </span>
                      </td>
                      <td className="py-2.5 text-sm text-gray-500">
                        <div className="flex gap-3">
                          <button
                            className="flex h-9 items-center justify-center rounded-lg border border-solid border-themeColor bg-white p-2 px-4 text-sm font-bold text-themeColor"
                            onClick={() => changeRole(item.id, !item.isStaff)}
                          >
                            Change Role
                          </button>
                          <button
                            className="flex h-9 items-center justify-center rounded-lg bg-themeColor p-2 px-4 text-sm text-white"
                            onClick={() => {
                              router.push(`/users/${item.id}/card`);
                            }}
                          >
                            Cards
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
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
    </>
  );
}
