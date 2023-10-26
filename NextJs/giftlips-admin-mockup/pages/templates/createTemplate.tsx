import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { BiArrowBack } from "react-icons/bi";
import TemplateForm from "@/components/TemplateForm";
import Layout from "@/components/Layout";

export default function CreateTemplate() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.data != undefined && session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, router]);
  return (
    <>
      <Layout>
        <Head>
          <title>Create Template</title>
        </Head>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="rounded-lg p-2 px-2 text-2xl text-textColor focus:border-transparent focus:outline-none focus-visible:border-transparent focus-visible:outline-none"
              onClick={() => {
                router.push("/templates");
              }}
            >
              <BiArrowBack />
            </button>

            <h1 className="text-2xl font-bold text-neutral-800">
              Create Templates
            </h1>
          </div>
        </div>

        <div className="rounded-lg bg-base-100 p-4 shadow-lg lg:col-start-8 lg:col-end-13">
          <TemplateForm />
        </div>
      </Layout>
    </>
  );
}
