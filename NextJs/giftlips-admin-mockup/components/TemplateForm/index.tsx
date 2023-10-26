import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CreatableSelect from "react-select/creatable";
import Image from "next/image";
import Dropzone from "react-dropzone-uploader";
import http from "@/services/http.service";
import { v4 as uuidv4 } from "uuid";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import { getPresignedUrl } from "@/services/upload.service";

export default function TemplateForm({ templatesId }: any) {
  const [gradient, setGradient] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [height, setHeight] = useState<string>("200");
  const [width, setWidth] = useState<string>("200");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [assets, setAssets] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [qrWidth, setQrWidth] = useState<string>("72");
  const [qrX, setQrX] = useState<string>("305");
  const [qrY, setQrY] = useState<string>("118");
  const [qrFrame, setQrFrame] = useState("");
  const [qrFrameColor, setQrFrameColor] = useState("#000000");
  const [qrGradient, setQrGradient] = useState(false);
  const [qrGradientType, setQrGradientType] = useState("");

  const [qrColor01, setQrColor01] = useState("#000000");
  const [qrColor02, setQrColor02] = useState("#000000");
  const [coverFile, setCoverFile] = useState("");
  const [assetFile, setAssetFile] = useState("");

  const getTemplates = async () => {
    if (templatesId) {
      try {
        const response = await http.put(`/admin/templates/${templatesId}`);
        const data = response?.data;

        setTitle(data.title);
        setDescription(data.description);
        setHeight(data.height);
        setWidth(data.width);
        setCoverUrl(data.coverUrl);
        setAssets(data.assets);
        setAttributes(data.attributes);
        setCategories(data.categories);
        setTags(data.tags);
        setQrWidth(data.qrWidth);
        setQrX(data.qrX);
        setQrY(data.qrY);
        setQrFrame(data.qrFrame);
        setQrFrameColor(data.qrFrameColor);
        setQrGradient(data.qrGradient);
        setQrGradientType(
          data.qrGradientType === undefined ? "" : data.qrGradientType
        );
        setQrColor01(data.qrColor01);
        setQrColor02(data.qrColor02);

        const coverFile = await fetch(data.coverUrl).then((r) => r.text());
        setCoverFile(coverFile);

        const assetFile = await fetch(data.assets[0].url).then((r) => r.text());
        setAssetFile(assetFile);
      } catch (error: any) {
        console.error(error.response);
      }
    }
  };

  const getAssetUploadParams = async ({ meta, file }: any) => {
    const uploadKey = `templates/${uuidv4()}.svg`;
    const s3Data = await getPresignedUrl(uploadKey, file.type);

    if (s3Data?.fileUrl) {
      setAssets([{ url: s3Data?.fileUrl }]);
    }

    return {
      method: "PUT",
      body: file,
      meta: { fileUrl: s3Data.fileUrl },
      url: s3Data.uploadUrl,
    };
  };

  const handleAssetChangeStatus = async ({ meta, file }: any, status: any) => {
    if (status === "done") {
      const coverFile = await fetch(meta.previewUrl).then((r) => r.text());
      setAssets([{ url: meta.fileUrl }]);
      setAssetFile(coverFile);
    }

    if (status === "removed") {
      setAssets([]);
      setAssetFile("");
    }
  };

  const getCoverUploadParams = async ({ meta, file }: any) => {
    const uploadKey = `templates/${file.name}`;
    const s3Data = await getPresignedUrl(uploadKey, file.type);

    if (s3Data?.fileUrl) {
      setCoverUrl(s3Data?.fileUrl);
    }

    return {
      method: "PUT",
      body: file,
      meta: { fileUrl: s3Data.fileUrl },
      url: s3Data.uploadUrl,
    };
  };

  const handleCoverChangeStatus = async ({ meta, file }: any, status: any) => {
    if (status === "done") {
      const coverFile = await fetch(meta.previewUrl).then((r) => r.text());
      setCoverUrl(meta.fileUrl);
      setCoverFile(coverFile);
    }

    if (status === "removed") {
      setCoverUrl("");
      setCoverFile("");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const templateData = {
        title,
        description,
        height,
        width,
        coverUrl,
        assets,
        // variables,
        attributes,
        categories,
        tags,
        qrWidth,
        qrX,
        qrY,
        qrFrame,
        qrFrameColor,
        qrGradient,
        qrGradientType,
        qrColor01,
        qrColor02,
      };
      let response;
      if (templatesId) {
        response = await http.put(
          `/admin/templates/${templatesId}`,
          templateData
        );
        toast.success(`${title} Template is Updated`);
      } else {
        response = await http.post(`/admin/templates`, templateData);
        toast.success(`Template is created`);
      }

      if (response.status) {
        router.push("/templates");
      } else {
        if (!templatesId) {
          setTitle("");
          setDescription("");
          setHeight("200");
          setWidth("200");
          setCoverUrl("");
          setAssets([]);
          // setVariables([])
          setAttributes([]);
          setCategories([]);
          setTags([]);
          setQrWidth("72");
          setQrX("305");
          setQrY("118");
          setQrFrame("");
          setQrFrameColor("#000000");
          setQrGradient(false);
          setQrGradientType("");
          setQrColor01("#000000");
          setQrColor02("#000000");
          setCoverFile("");
          setAssetFile("");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getTemplates();
  }, [templatesId]);

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <div className="form-control mb-5 w-full">
                <label
                  className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor"
                  htmlFor="Name"
                >
                  Name
                </label>
                <input
                  id="Name"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Template Name"
                  className="input-bordered input h-11 w-full py-2.5 text-sm font-semibold normal-case text-black focus:border-textColor focus:outline-none"
                />
              </div>
              <div className="form-control mb-5 w-full">
                <label
                  className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor"
                  htmlFor="Description"
                >
                  Description
                </label>
                <textarea
                  id="Description"
                  rows={24}
                  cols={50}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description"
                  className="input-bordered input h-24 w-full rounded-lg py-2.5 text-sm font-semibold normal-case text-black focus:border-textColor focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-3 sm:gap-5">
              <div className="form-control mb-5 w-full">
                <label
                  className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor"
                  htmlFor="Attributes"
                >
                  Attributes
                </label>
                <CreatableSelect
                  className="selectBox"
                  id="Attributes"
                  value={attributes.map((i: any) => {
                    return { label: i, value: i };
                  })}
                  onChange={(e: any) =>
                    setAttributes(e.map((i: any) => i.value))
                  }
                />
              </div>
              <div className="form-control mb-5 w-full">
                <label
                  className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor"
                  htmlFor="Categories"
                >
                  Categories
                </label>
                <CreatableSelect
                  value={categories.map((i: any) => {
                    return { label: i, value: i };
                  })}
                  onChange={(e: any) =>
                    setCategories(e.map((i: any) => i.value))
                  }
                  className="selectBox"
                  id="Categories"
                />
              </div>
              <div className="form-control mb-5 w-full">
                <label
                  className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor"
                  htmlFor="Tags"
                >
                  Tags
                </label>
                <CreatableSelect
                  value={tags.map((i: any) => {
                    return { label: i, value: i };
                  })}
                  onChange={(e: any) => setTags(e.map((i: any) => i.value))}
                  className="selectBox"
                  id="Tags"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-5">
            <div className="form-control mb-5 w-full">
              <label
                className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor"
                htmlFor="Width"
              >
                Width
              </label>
              <input
                id="Width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Enter Template Width"
                className="input-bordered input h-11 w-full py-2.5 text-sm font-semibold normal-case text-black focus:border-textColor focus:outline-none"
              />
            </div>
            <div className="form-control mb-5 w-full">
              <label
                className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor"
                htmlFor="Height"
              >
                Height
              </label>
              <input
                id="Height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter Template Height"
                className="input-bordered input h-11 w-full py-2.5 text-sm font-semibold normal-case text-black focus:border-textColor focus:outline-none"
              />
            </div>
          </div>
          {assetFile === "" ? (
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-1 sm:gap-5 lg:grid-cols-1">
              <div className="form-control mb-5 w-full">
                <label className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor">
                  Assets Cover
                </label>
                <Dropzone
                  //@ts-ignore
                  getUploadParams={getAssetUploadParams}
                  //@ts-ignore
                  onChangeStatus={handleAssetChangeStatus}
                  accept=".svg"
                  submitButtonDisabled
                  maxFiles={1}
                  multiple={false}
                  inputContent="Drag a SVG file or Click to Browse"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <div className="mb-3">
                  <div className="mb-2 flex justify-between">
                    <h6 className="font-semibold normal-case text-textColor">
                      Assets URL
                    </h6>
                    <button
                      className="flex h-8 w-8 items-center justify-center gap-2 rounded-lg border border-solid border-black p-1 "
                      onClick={() => setAssetFile("")}
                    >
                      <MdDeleteForever className="h-5 w-5" />
                    </button>
                  </div>
                  <input
                    className="input-bordered input h-11 w-full py-2.5 text-sm font-semibold normal-case text-black focus:border-textColor focus:outline-none"
                    value={assets[0].url}
                    disabled
                  />
                </div>
                <div className="grid grid-cols-1 gap-0 sm:grid-cols-1 sm:gap-3 lg:grid-cols-2">
                  <div className="relative mb-3 h-full min-h-[300px] w-full">
                    <Image src={assets[0]?.url} fill alt="assets image" />
                  </div>
                  <div className="my-3">
                    <textarea
                      className="input-bordered input h-24 w-full rounded-lg py-2.5 text-sm font-semibold normal-case focus:border-textColor focus:outline-none"
                      rows={50}
                      cols={60}
                      defaultValue={assetFile}
                      style={{ height: "480px" }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {coverFile === "" ? (
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-5 lg:grid-cols-1">
              <div className="form-control mb-5 w-full">
                <label className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor">
                  Upload Cover
                </label>
                <Dropzone
                  //@ts-ignore
                  getUploadParams={getCoverUploadParams}
                  //@ts-ignore
                  onChangeStatus={handleCoverChangeStatus}
                  accept=".svg"
                  submitButtonDisabled
                  maxFiles={1}
                  multiple={false}
                  inputContent="Drag a SVG file or Click to Browse"
                  className="fileInput"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <div className="mb-3">
                  <div className="mb-2 flex justify-between">
                    <h6 className="font-semibold normal-case text-textColor">
                      Cover URL
                    </h6>
                    <button
                      className="flex h-8 w-8 items-center justify-center gap-2 rounded-lg border border-solid border-black p-1 "
                      onClick={() => setCoverFile("")}
                    >
                      <MdDeleteForever className="h-5 w-5" />
                    </button>
                  </div>
                  <input
                    className="input-bordered input h-11 w-full py-2.5 text-sm font-semibold normal-case text-black focus:border-textColor focus:outline-none"
                    value={coverUrl}
                    disabled
                  />
                </div>
                <div className="grid grid-cols-1 gap-0 sm:grid-cols-1 sm:gap-5 lg:grid-cols-2">
                  <div className="relative mb-3 h-full min-h-[300px] w-full">
                    <Image src={assets[0].url} fill alt="cover image" />
                  </div>
                  <div className="my-3">
                    <textarea
                      className="input-bordered input h-24 w-full rounded-lg py-2.5 text-sm font-semibold normal-case focus:border-textColor focus:outline-none"
                      defaultValue={coverFile}
                      style={{ height: "480px" }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="mb-5">
            <h4 className="my-2.5 mt-4 font-bold normal-case text-black">
              QR Code
            </h4>
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-3 sm:gap-5">
              <div className="form-control mb-5 w-full">
                <label
                  className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor"
                  htmlFor="QrWidth"
                >
                  Width (px)
                </label>
                <input
                  type="number"
                  min={72}
                  value={qrWidth}
                  onChange={(e) => setQrWidth(e.target.value)}
                  placeholder="Enter QR code width"
                  required
                  className="input-bordered input h-11 w-full py-2.5 text-sm font-semibold normal-case text-black focus:border-textColor focus:outline-none"
                />
              </div>
              <div className="form-control mb-5 w-full">
                <label
                  className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor"
                  htmlFor="QrX"
                >
                  X Position
                </label>
                <input
                  type="number"
                  id="QrX"
                  value={qrX}
                  onChange={(e) => setQrX(e.target.value)}
                  placeholder="QR X Position"
                  className="input-bordered input h-11 w-full py-2.5 text-sm font-semibold normal-case text-black focus:border-textColor focus:outline-none"
                />
              </div>
              <div className="form-control mb-5 w-full">
                <label
                  className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor"
                  htmlFor="QrY"
                >
                  Y Position
                </label>
                <input
                  id="QrY"
                  type="number"
                  value={qrY}
                  onChange={(e) => setQrY(e.target.value)}
                  placeholder="QR Y Position"
                  className="input-bordered input h-11 w-full py-2.5 text-sm font-semibold normal-case text-black focus:border-textColor focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="form-control mb-5 w-full">
            <label className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor">
              Frame
            </label>
            <select
              className="h-10 min-w-[100px] cursor-pointer rounded-lg bg-gray-100 p-2 px-4 text-sm text-black focus:border-transparent focus:outline-none focus-visible:border-transparent focus-visible:outline-none"
              value={qrFrame}
              onChange={(e: any) => setQrFrame(e.target.value)}
            >
              <option value="">None</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="form-control mb-5 w-full">
            <label className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor">
              Frame Color
            </label>
            <input
              type="color"
              value={qrFrameColor}
              onChange={(e) => setQrFrameColor(e.target.value)}
            />
          </div>
          <div className="form-group mb-5 flex w-full items-center gap-2">
            <input
              type="checkbox"
              id="html"
              checked={gradient}
              onChange={(event: any) =>
                setGradient(event.currentTarget.checked)
              }
            />
            <label
              htmlFor="html"
              className="label p-0 text-sm font-semibold normal-case text-textColor"
            >
              Gradient
            </label>
          </div>

          <div className="form-control mb-5 w-full">
            <label className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor">
              Gradient Type
            </label>
            <select
              className="h-10 min-w-[100px] cursor-pointer rounded-lg bg-gray-100 p-2 px-4 text-sm text-black focus:border-transparent focus:outline-none focus-visible:border-transparent focus-visible:outline-none"
              value={qrGradientType}
              onChange={(e: any) => setQrGradient(e.target.value)}
            >
              <option value="None">None</option>
              <option value="0">Left-Right</option>
              <option value="1">Top-Bottom</option>
              <option value="2">NW-SE</option>
              <option value="3">SW-Ne</option>
              <option value="4">Radial</option>
            </select>
          </div>
          <div className="flex  gap-6">
            <div className="form-control mb-5">
              <label className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor">
                Color 01
              </label>
              <input
                type="color"
                value={qrColor01}
                onChange={(e) => setQrColor01(e.target.value)}
              />
            </div>
            <div className="form-control mb-5">
              <label className="label mb-1 p-0 text-sm font-semibold normal-case text-textColor">
                Color 2
              </label>
              <input
                type="color"
                value={qrColor02}
                onChange={(e) => setQrColor02(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-5">
            <button className="text-md flex h-10 min-w-[150px] items-center justify-center rounded-lg bg-themeColor p-3 px-4 text-white">
              {templatesId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
