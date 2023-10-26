import { useEffect, useState } from "react";
import Dropzone from "react-dropzone-uploader";
import { getExtension } from "../../helpers/common";
import { useModalContext, useUserContext } from "../../context/contextLib";
import { formatBytes, formatDuration } from "../../helpers/utils";
import {
  createCardEntry,
  createAnonymousEntry,
  deleteCardEntryImage,
  getPresignedUrl,
} from "../../services/uploader.service";
import { useSession } from "next-auth/react";

const uuidv4 = require("uuid").v4;
const MAX_DURATION = 60;

interface InterfaceDropzone {
  cardData: any;
  handleClose: any;
  showAddFilesButton?: boolean;
  initialFiles?: any[];
  removeInitialFile?: (file: File) => void;
  setIsValidate?: any;
  isValidate?: string;
  setLoader: any;
  fileUploads: any;
  setFileUploads: any;
}

const CardFileDropzone = ({
  handleClose,
  cardData,
  showAddFilesButton = true,
  initialFiles = [],
  removeInitialFile = () => {},
  setIsValidate = () => {},
  isValidate = "",
  setLoader,
  fileUploads,
  setFileUploads,
}: InterfaceDropzone) => {
  const session = useSession();
  const { setSavedCard, setSavedCardId } = useUserContext();
  const { setShowUpgradeModal } = useModalContext();
  const [largeFileName, setLargeFileName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [invitedUser, setInvitedUser] = useState();

  useEffect(() => {
    let orderId: any = localStorage.getItem("Inviteduser");
    setInvitedUser(orderId);
  }, []);

  const generateVideoThumbnail = (file: File) => {
    return new Promise((resolve) => {
      let canvas = document.createElement("canvas");
      const video = document.createElement("video");

      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);

      video.onloadeddata = () => {
        let ctx: any = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.pause();

        let ImageUrl = canvas.toDataURL("image/png");

        return resolve(ImageUrl);
      };
    });
  };

  const dataURLtoFile = (dataUrl: any, filename: any) => {
    var arr = dataUrl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: "image/png" });
  };

  const getUploadParams = async (data: any) => {
    setLoader(true);
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
      setSavedCardId(cardData._id);
      let ext = getExtension(file.name);
      let uploadKey = `cards/${cardData._id}/${uuidv4()}.${ext}`;

      try {
        if (file.type.match("video.*")) {
          let s3Data = await getPresignedUrl(uploadKey, file.type);
          let uploaded = uploadedFiles;
          uploaded.push(file.name);
          setUploadedFiles(uploaded);
          setFileUploads([...fileUploads, file]);
          let thumbnailKey = `thumbnail/${cardData._id}/${uuidv4()}.png`;
          let thumbnail = await generateVideoThumbnail(file);
          let fileData = dataURLtoFile(thumbnail, "Thumbnail.png");
          let s3ThumbnailData = await getPresignedUrl(
            thumbnailKey,
            fileData.type
          );
          await fetch(s3ThumbnailData.uploadUrl, {
            method: "PUT",
            body: fileData,
            headers: {
              "Content-Type": "image/png",
            },
          });
          let entity = await createAnonymousEntry(
            cardData._id,
            s3Data.fileUrl,
            file,
            s3ThumbnailData.fileUrl,
            invitedUser
          );
          setTimeout(() => setLoader(false), 2800);

          return {
            method: "PUT",
            body: file,
            meta: { fileUrl: s3Data.fileUrl, entityId: entity?.data?._id },
            url: s3Data.uploadUrl,
          };
          
        } else {
          let s3Data = await getPresignedUrl(uploadKey, file.type);
          let entity = await createAnonymousEntry(
            cardData._id,
            s3Data.fileUrl,
            file,
            null,
            invitedUser
          );
          let uploaded = uploadedFiles;
          uploaded.push(file.name);
          setUploadedFiles(uploaded);
          setFileUploads([...fileUploads, file]);

          return {
            method: "PUT",
            body: file,
            meta: { fileUrl: s3Data.fileUrl, entityId: entity?.data?._id },
            url: s3Data.uploadUrl,
          };
        }
      } catch (e: any) {
        if (e.response.data.code === "LIMIT_EXCEEDED") {
          handleClose();
          setTimeout(() => {
            setSavedCard(cardData);
            setShowUpgradeModal(false);
          });
        }
        return null;
      }
    } else {
      let ext = getExtension(file.name);
      let uploadKey = `cards/${cardData._id}/${uuidv4()}.${ext}`;

      try {
        if (file.type.match("video.*")) {
          let s3Data = await getPresignedUrl(uploadKey, file.type);
          let uploaded = uploadedFiles;
          uploaded.push(file.name);
          setUploadedFiles(uploaded);
          setFileUploads([...fileUploads, file]);
          let thumbnailKey = `thumbnail/${cardData._id}/${uuidv4()}.png`;
          let thumbnail = await generateVideoThumbnail(file);
          let fileData = dataURLtoFile(thumbnail, "Thumbnail.png");
          let s3ThumbnailData = await getPresignedUrl(
            thumbnailKey,
            fileData.type
          );
          await fetch(s3ThumbnailData.uploadUrl, {
            method: "PUT",
            body: fileData,
            headers: {
              "Content-Type": "image/png",
            },
          });
          let entity = await createCardEntry(
            cardData._id,
            s3Data.fileUrl,
            file,
            s3ThumbnailData.fileUrl
          );
          setTimeout(() => setLoader(false), 2800);

          return {
            method: "PUT",
            body: file,
            meta: { fileUrl: s3Data.fileUrl, entityId: entity?.data?._id },
            url: s3Data.uploadUrl,
          };
        } else {
          let s3Data = await getPresignedUrl(uploadKey, file.type);
          let entity = await createCardEntry(
            cardData._id,
            s3Data.fileUrl,
            file,
            null
          );

          let uploaded = uploadedFiles;
          uploaded.push(file.name);
          setUploadedFiles(uploaded);
          setFileUploads([...fileUploads, file]);
          setTimeout(() => setLoader(false), 2800);

          return {
            method: "PUT",
            body: file,
            meta: { fileUrl: s3Data.fileUrl, entityId: entity?.data?._id },
            url: s3Data.uploadUrl,
          };
        }
      } catch (e: any) {
        if (e.response.data.code === "LIMIT_EXCEEDED") {
          handleClose();
          setTimeout(() => {
            setSavedCard(cardData);
            setShowUpgradeModal(false);
          });
        }
        return null;
      }
    }
  };

  const handleChangeStatus = (data: any, status: any) => {
    let meta = data.meta;
    if (status === "removed" && meta.entityId !== undefined) {
      deleteCardEntryImage(meta.entityId);
      removeInitialFile(meta);
    }

    if (status === "removed") {
      if (meta?.name === largeFileName) {
        setIsValidate("");
        setLargeFileName("");
      }
    } else {
      try {
        if (
          meta?.duration &&
          meta.duration > MAX_DURATION &&
          meta.duration !== Infinity
        ) {
          setIsValidate(" File duration more than 1 minute");
          setLargeFileName(meta?.name);
        }
      } catch (e: any) {}
    }

    setTimeout(() => {
      let _submitBtn: any = document.querySelector(".dzu-submitButton");
      let _dropzoneContainer: any = document.querySelector(".dzu-dropzone");

      if (_submitBtn) {
        if (_dropzoneContainer) {
          _dropzoneContainer.classList.add("with-border");
        }
      } else {
        if (_dropzoneContainer) {
          _dropzoneContainer.classList.remove("with-border");
        }
      }
    }, 300);
  };

  const PreviewComponent = ({
    className,
    imageClassName,
    style,
    imageStyle,
    fileWithMeta: { cancel, remove, restart },
    meta: {
      name = "",
      percent = 0,
      size = 0,
      previewUrl,
      status,
      duration,
      validationError,
    },
    isUpload,
    canCancel,
    canRemove,
    canRestart,
    extra: { minSizeBytes },
  }: any) => {
    const cancelImg = "/static/img/svg/react-dropzone-uploader/cancel.svg";
    const removeImg = "/static/img/svg/trash.svg";
    const restartImg = "/static/img/svg/react-dropzone-uploader/restart.svg";
    const iconByFn = {
      cancel: { backgroundImage: `url(${cancelImg})` },
      remove: { backgroundImage: `url(${removeImg})` },
      restart: { backgroundImage: `url(${restartImg})` },
    };

    let title = `${name || "?"}, ${formatBytes(size)}`;

    if (duration && duration !== Infinity) {
      title = `${title}, ${formatDuration(duration)}`;
    }

    if (status === "error_file_size" || status === "error_validation") {
      return (
        <div className={className} style={style}>
          <span className="dzu-previewFileNameError">{title}</span>
          {status === "error_file_size" && (
            <span>
              {size < minSizeBytes ? "File too small" : "File too big"}
            </span>
          )}
          {status === "error_validation" && (
            <span>{String(validationError)}</span>
          )}
          {canRemove && (
            <span
              className="dzu-previewButton trash-icon"
              style={iconByFn.remove}
              onClick={remove}
            />
          )}
        </div>
      );
    }

    if (
      status === "error_upload_params" ||
      status === "exception_upload" ||
      status === "error_upload"
    ) {
      title = `${title} (upload failed)`;
    }

    if (status === "aborted") {
      title = `${title} (cancelled)`;
    }

    return (
      status !== "preparing" &&
      status !== "getting_upload_params" && (
        <div className={className} style={style}>
          {previewUrl && (
            <span className={`dzu-previewFileName d-md-flex`}>
              <div
                className={`d-md-flex justify-content-md-center`}
                style={{ maxWidth: 96, maxHeight: 64, width: 96 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={imageClassName + " img-fluid rounded"}
                  style={imageStyle}
                  src={previewUrl}
                  alt={title}
                  title={title}
                />
              </div>

              <span className={`mx-md-5 invisible`}>0:00</span>

              <span className={`file-title ms-md-2`}>{name || "?"}</span>
            </span>
          )}

          {!previewUrl && (
            <span className="dzu-previewFileName">
              <span className={`mx-md-5`}>
                {duration && duration !== Infinity
                  ? formatDuration(duration)
                  : "-"}
              </span>
              <span className={`d-md-none`}>,&nbsp;</span>

              <span className={`file-title`}>{name || "?"}</span>
            </span>
          )}

          <div className="dzu-previewStatusContainer">
            {isUpload && isValidate === "" && (
              <>
                <progress
                  max={100}
                  className={
                    status === "done" || status === "headers_received"
                      ? "d-none"
                      : ""
                  }
                  value={
                    status === "done" || status === "headers_received"
                      ? 100
                      : percent
                  }
                />

                <span className={`me-md-5`}>
                  {status === "done" || status === "headers_received"
                    ? formatBytes(size)
                    : ""}
                </span>
              </>
            )}

            {status === "uploading" && canCancel && (
              <span
                className="dzu-previewButton"
                style={iconByFn.cancel}
                onClick={cancel}
              />
            )}
            {status !== "preparing" &&
              status !== "getting_upload_params" &&
              status !== "uploading" &&
              canRemove && (
                <span
                  className="dzu-previewButton trash-icon"
                  style={iconByFn.remove}
                  onClick={remove}
                />
              )}
            {[
              "error_upload_params",
              "exception_upload",
              "error_upload",
              "aborted",
              "ready",
            ].includes(status) &&
              canRestart && (
                <span
                  className="dzu-previewButton"
                  style={iconByFn.restart}
                  onClick={restart}
                />
              )}
          </div>
        </div>
      )
    );
  };

  const InputComponent = ({
    className,
    labelClassName,
    labelWithFilesClassName,
    style,
    labelStyle,
    labelWithFilesStyle,
    getFilesFromEvent,
    accept,
    multiple,
    disabled,
    content,
    withFilesContent,
    onFiles,
    files,
  }: any) => {
    return (
      <label
        className={
          files.length > 0
            ? labelWithFilesClassName +
              ` ${!showAddFilesButton ? "d-none" : ""}`
            : labelClassName
        }
        style={files.length > 0 ? labelWithFilesStyle : labelStyle}
      >
        {files.length > 0 ? withFilesContent : content}

        <input
          className={className}
          style={style}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={async (e) => {
            const target = e.target;
            const chosenFiles = await getFilesFromEvent(e);
            onFiles(chosenFiles);
            //@ts-ignore
            target.value = null;
          }}
        />
      </label>
    );
  };

  return (
    <Dropzone
      //@ts-ignore
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      initialFiles={initialFiles}
      accept="video/mov,video/mp4,video/x-m4v,audio/webm,video/*, audio/*"
      maxFiles={1}
      multiple={false}
      PreviewComponent={PreviewComponent}
      InputComponent={InputComponent}
      SubmitButtonComponent={() => <></>}
      inputContent={(allFiles, extra) => {
        if (extra.reject) {
          return "Only video files allowed!";
        }

        return (
          <div>
            <span className="fw-middle text-center fw-semibold text-gl-black-2 fs-6">
              Add your video to your greeting card. <br />
              Drop your video like it&apos;s hot!
            </span>
          </div>
        );
      }}
      styles={{
        dropzoneReject: {
          borderColor: "#F19373",
          backgroundColor: "#F1BDAB",
        },
        inputLabel: (files, extra) =>
          extra.reject ? { color: "#A02800" } : {},
      }}
    />
  );
};

export default CardFileDropzone;
