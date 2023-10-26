import Layout from "@/components/Layout";
import TemplateForm from "@/components/TemplateForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";

export default function Edit() {
  const router = useRouter();
  const session = useSession();
  const { id } = router.query;

  return (
    <>
      <Layout>
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
              Edit Templates
            </h1>
          </div>
        </div>

        <div className="rounded-lg bg-base-100 p-4 shadow-lg lg:col-start-8 lg:col-end-13">
          <TemplateForm templatesId={id} />
        </div>
      </Layout>
    </>
  );
}
