import http from "@/services/http.service";
import { getPresignedUrl } from "@/services/upload.service";
import React from "react";
import Dropzone from "react-dropzone-uploader";
import { MdOutlineClose } from "react-icons/md";

export default function FontModal({ setShowModal, getFonts }: any) {
  const createFont = async (name: string, url: string) => {
    try {
      await http.post(`/admin/fonts`, { name, url });
    } catch (e) {
      console.error(e);
    } finally {
    }
  };

  const removeFont = async (url: string) => {
    try {
      await http.put(`/admin/fonts/delete`, { url });
    } catch (e) {
      console.error(e);
    }
  };

  const getUploadParams = async ({ meta, file }: any) => {
    const uploadKey = `fonts/${file.name}`;
    let s3Data = await getPresignedUrl(uploadKey, file.type);

    return {
      method: "PUT",
      body: file,
      meta: { fileUrl: s3Data.fileUrl },
      url: s3Data.uploadUrl,
    };
  };

  const handleChangeStatus = async ({ meta, file }: any, status: any) => {
    if (status === "done") {
      await createFont(meta.name, meta.fileUrl);
      void getFonts();
    }

    if (status === "removed") {
      await removeFont(meta.fileUrl);
      void getFonts();
    }
  };

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-25 p-4"
      onClick={() => setShowModal(false)}
    >
      <div
        className="h-80 w-full max-w-[400px] rounded rounded-2xl bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between rounded-t border-b border-solid border-gray-300 p-5">
          <h3 className="text-xl font-bold text-neutral-800">Font Uploader</h3>
          <button
            className="justify-content-center flex h-6 w-6 items-center gap-2 p-1 text-black "
            onClick={() => setShowModal(false)}
          >
            <MdOutlineClose />
          </button>
        </div>
        <div className="relative flex-auto p-5">
          <Dropzone
            //@ts-ignore
            getUploadParams={getUploadParams}
            //@ts-ignore
            onChangeStatus={handleChangeStatus}
            accept=".otf,.ttf,.woff,.woff2"
            submitButtonDisabled
            inputContent="Drag font files or Click to Browse"
          />
        </div>
      </div>
    </div>
  );
}
