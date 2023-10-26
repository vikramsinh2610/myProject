import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { SlCalender } from "react-icons/sl";
import http from "@/services/http.service";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Image from "next/image";
import { devLog } from "@/helpers/logger";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

export default function Home() {
  const session = useSession();
  const router = useRouter();

  const [templates, setTemplates] = useState<any>([]);
  const [totalTemplates, setTotalTemplates] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [totalUser, setTotalUser] = useState<number>(0);
  const [graphToggle, setGraphToggle] = useState<string>("weekly");

  const [graphLabel, setGraphLabel] = useState<any>([]);
  const [graphData, setGraphData] = useState<any>([]);

  const getPopularTemplateData = async () => {
    const response = await http.get("/admin/getPopularTemplate");
    const data = await response.data.data;

    setTotalTemplates(Object.keys(data).length);
    setTemplates(data);
  };

  useEffect(() => {
    getPopularTemplateData();
  }, []);

  useEffect(() => {
    let endDate1 = "";
    let startDate1 = "";

    (async () => {
      startDate1 = moment().format("DD/MM/YYYY");

      if (graphToggle === "weekly") {
        endDate1 = moment().subtract(6, "days").format("DD/MM/YYYY");
      } else if (graphToggle === "monthly") {
        endDate1 = moment().subtract(1, "months").format("DD/MM/YYYY");
      }

      try {
        let dateData = {
          startDate: endDate1,
          endDate: startDate1,
        };
        let response = await http.post("/admin/userStatistics", dateData);
        const data = await response?.data;

        let chartLabel = [];
        let chartDataData = [];

        if (data?.data.length > 0) {
          data.dates.map((item: any) => chartLabel.push(item?.date));
          setGraphLabel(chartLabel);
          data.dates.map((item: any) => chartDataData.push(item?.count));
          setGraphData(chartDataData);
        } else {
          const start = moment(endDate1, "DD-MM-YYYY");
          const end = moment(startDate1, "DD-MM-YYYY");
          let now = start.clone();

          while (now.isSameOrBefore(end)) {
            chartLabel.push(now.format("DD-MM-YYYY"));
            now.add(1, "days");
          }

          setGraphLabel(chartLabel);
          chartLabel.map((item: any) => chartDataData.push(0));
          setGraphData(chartDataData);
        }
      } catch (e: any) {
        devLog(e);
      }
    })();
  }, [graphToggle]);

  return (
    <Layout>
      <Head>
        <title>Dashboard</title>
      </Head>

      <div className="mb-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-5">
          <div className="">
            <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-textColor ">
            <SlCalender className="h-4 w-4 text-themeColor" /> August 1, 2020 -
            August 31, 2020
          </div>
        </div>
        <div className="my-2 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-row items-center gap-4 rounded-lg bg-base-100 p-4 shadow-lg">
            <p className="flex h-16 w-16 grow-0 basis-16 items-center justify-center rounded-lg bg-lightPurple p-2 text-2xl font-bold text-purple">
              {totalUser}
            </p>
            <div>
              <h2 className="text-lg font-medium text-black">
                User Registrations
              </h2>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4 rounded-lg bg-base-100 p-4 shadow-lg">
            <p className="flex h-16 w-16 grow-0 basis-16 items-center justify-center rounded-lg bg-lightGreen p-2 text-2xl font-bold text-green">
              10
            </p>
            <div>
              <h2 className="text-lg font-medium text-black">Active Users</h2>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4 rounded-lg bg-base-100 p-4 shadow-lg">
            <p className="flex h-16 w-16 grow-0 basis-16 items-center justify-center rounded-lg bg-lightPink p-2 text-2xl font-bold text-themeColor">
              {totalTemplates}
            </p>
            <div>
              <h2 className="text-lg font-medium text-black">
                Popular Templates
              </h2>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="my-2 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="rounded-lg bg-base-100 p-4 shadow-lg lg:col-start-1 lg:col-end-8">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-5">
                <h1 className="text-xl font-bold text-neutral-800">
                  User Registrations
                </h1>
                <select
                  name="Graph View"
                  id="GraphView"
                  className="h-10 min-w-[120px] cursor-pointer rounded-lg bg-gray-100 p-2 px-4 text-sm text-gray-500 focus:border-transparent focus:outline-none focus-visible:border-transparent focus-visible:outline-none"
                  onChange={(e) => setGraphToggle(e.target.value)}
                >
                  <option value="weekly">Weekly View</option>
                  <option value="monthly">Month View</option>
                </select>
              </div>
              <div>
                <Bar
                  data={{
                    labels: graphLabel,
                    datasets: [
                      {
                        data: graphData,
                        backgroundColor: [
                          "#ff9936",
                          "#2085d8",
                          "#acff52",
                          "#fff000",
                          "#9e36ff",
                        ],
                        borderColor: [
                          "#ff9936",
                          "#2085d8",
                          "#acff52",
                          "#fff000",
                          "#9e36ff",
                        ],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="rounded-lg bg-base-100 p-4 shadow-lg lg:col-start-8 lg:col-end-13">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-5">
                <div className="">
                  <h1 className="text-xl font-bold text-neutral-800">
                    Templates List
                  </h1>
                </div>
                <div className="relative flex h-10 min-w-[200px] items-center">
                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    className="h-10 min-w-[200px] rounded-lg bg-gray-100 p-2 px-4 pr-12 text-sm text-gray-500 focus:border-transparent focus:outline-none focus-visible:border-transparent focus-visible:outline-none"
                    onChange={(e: any) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="table-responsive mb-5 max-h-[400px] overflow-x-auto">
                <table className="table-normal mb-5 table w-full">
                  <thead className="sticky top-0 border-b-2 border-solid border-gray-200">
                    <tr>
                      <th className="bg-transparent bg-white normal-case text-textColor">
                        Image
                      </th>
                      <th className="bg-transparent bg-white normal-case text-textColor">
                        Title
                      </th>
                      <th className="bg-transparent bg-white normal-case text-textColor">
                        Popularity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates?.length > 0 &&
                      templates
                        .filter((post: any) => {
                          if (search === "") {
                            return post;
                          } else if (
                            post.title
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          ) {
                            return post;
                          }
                        })
                        .map((item: any, id: any) => (
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
                              {item.title}
                            </td>
                            <td className="py-2.5 text-sm text-gray-500">
                              {item.popular}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
