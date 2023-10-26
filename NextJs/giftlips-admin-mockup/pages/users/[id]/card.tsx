import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination/Pagination";
import http from "@/services/http.service";
import moment from "moment";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useCallback, useState } from "react";
import { BiArrowBack } from "react-icons/bi";

export default function Card() {
  const session = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [users, setUsers] = useState<any>({});
  const [tableFilter, setTableFilter] = useState("");
  const [tableItemsPerPage, setTableItemsPerPage] = useState(10);
  const [tablePage, setTablePage] = useState(1);
  const [tableTotalPages, setTableTotalPages] = useState(1);
  const [cards, setCards] = useState<any[]>([]);

  const getUser = async () => {
    try {
      const user = await http.put(`/admin/users/${id}`);
      console.log(user);

      if (user) {
        setUsers(user?.data);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const getCards = useCallback(async () => {
    try {
      const response = await http.get(
        `/admin/users/${id}/cards?search=${tableFilter}&limit=${tableItemsPerPage}&page=${tablePage}`
      );
      if (response?.data) {
        setTableTotalPages(response.data.totalDocs);
        setCards(
          response.data.docs.map((i: any) => {
            return {
              id: i._id,
              coverUrl: i.template.coverUrl,
              title: i.title || "",
              description: i.description || "",
              status: i.status,
              expiryAt: i.expiryAt
                ? moment(i.expiryAt).format("YYYY-MM-DD")
                : "",
              usage: i.usage.invites || 0,
              limit: i.limits.invites || "",
            };
          })
        );
      }
    } catch (e: any) {
      console.error(e);
    }
  }, [id, tableFilter, tableItemsPerPage, tablePage]);

  useEffect(() => {
    if (session.data != undefined && session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, router]);

  useEffect(() => {
    getCards();
  }, [tableFilter, tableItemsPerPage, tablePage, id]);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Layout>
      <Head>
        <title>User Card</title>
      </Head>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded-lg p-2 px-2 text-2xl text-textColor focus:border-transparent focus:outline-none focus-visible:border-transparent focus-visible:outline-none"
            onClick={() => {
              router.push("/users");
            }}
          >
            <BiArrowBack />
          </button>
          <h1 className="text-2xl font-bold text-neutral-800">
            {users?.firstName || users?.email}&apos;s Cards
          </h1>
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
        <div className="table-responsive mb-5 overflow-x-auto">
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
                <th className="bg-transparent bg-white normal-case text-textColor">
                  Status
                </th>
                <th className="bg-transparent bg-white normal-case text-textColor">
                  Valid Until
                </th>
                <th className="bg-transparent bg-white normal-case text-textColor">
                  Usage
                </th>
                <th className="bg-transparent bg-white normal-case text-textColor">
                  Limit
                </th>
              </tr>
            </thead>
            <tbody>
              {cards?.length > 0 &&
                cards.map((item: any, id: any) => (
                  <tr key={id} className="bg-white">
                    <th
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
                    </th>
                    <td className="py-2.5 text-sm text-gray-500">
                      {item?.title}
                    </td>
                    <td className="py-2.5 text-sm text-gray-500">
                      {item?.description}
                    </td>
                    <td className="py-2.5 text-sm text-gray-500">
                      {item?.status}
                    </td>
                    <td className="py-2.5 text-sm text-gray-500">
                      {moment(item?.expiryAt).format("YYYY-MM-DD")}
                    </td>
                    <td className="py-2.5 text-sm text-gray-500">
                      {item?.usage}
                    </td>
                    <td className="py-2.5 text-sm text-gray-500">
                      {item?.limit}
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
