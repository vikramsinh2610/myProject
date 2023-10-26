import Dropzone, { Preview } from "react-dropzone-uploader";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { getPresignedUrl } from "../../services/uploader.service";

const uuidv4 = require("uuid").v4;
const MAX_DURATION = 60;

const ProfileUploadDropzone = ({
  setUserProfileUrl,
  setProfileImage,
  initialFiles = [],
}: any) => {
  const session = useSession();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const getUploadParams = async (data: any) => {
    let file: any = data.file;
    let meta = data.meta;

    if (uploadedFiles.includes(file.name)) {
      data.remove();
      return {
        method: "PUT",
        body: file,
        meta: { fileUrl: "" },
        url: "",
      };
    }
    if (
      meta?.duration &&
      meta.duration > MAX_DURATION &&
      meta.duration !== Infinity
    ) {
      return {
        method: "PUT",
        body: file,
        meta: { fileUrl: "" },
        url: "",
      };
    }

    if (session.status !== "authenticated") {
      return null;
    } else {
      let ext = file?.name?.split(".")?.pop();
      let uploadKey = `profile/${uuidv4()}.${ext}`;

      try {
        let s3Data = await getPresignedUrl(uploadKey, file.type);
        let uploaded = uploadedFiles;
        uploaded.push(file.name);
        setUploadedFiles(uploaded);
        setUserProfileUrl(s3Data.uploadUrl?.split("?")[0]);

        return {
          method: "PUT",
          body: file,
          meta: { fileUrl: s3Data.fileUrl },
          url: s3Data.uploadUrl,
        };
      } catch (e: any) {
        if (e.response.data.code === "LIMIT_EXCEEDED") {
          console.log(e.response.data.code);
        }
        return null;
      }
    }
  };

  const handleSubmit = (files: any, allFiles: any) => {
    console.log(files.map((f: any) => f.meta));
    // allFiles.forEach((f: any) => f.remove());
  };

  const handleChangeStatus = ({ meta }: any, status: any) => {
    if (status === "done") setProfileImage(meta.previewUrl);
  };

  const Layout = ({
    input,
    dropzoneProps,
    files,
    previews,
    extra: { maxFiles },
  }: any) => {
    return (
      <div className="dropzoneInput">
        {files.length < maxFiles && input}
        {/* {previews} */}
      </div>
    );
  };

  return (
    <Dropzone
      //@ts-ignore
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      initialFiles={initialFiles}
      accept="image/*"
      // autoUpload={false}
      // maxFiles={1}
      // multiple={false}
      inputContent=""
      LayoutComponent={Layout}
    />
  );
};

export default ProfileUploadDropzone;
