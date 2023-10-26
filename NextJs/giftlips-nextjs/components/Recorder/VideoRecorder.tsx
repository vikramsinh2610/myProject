import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { MdFiberManualRecord, MdStop } from "react-icons/md";
import { ReactMediaRecorderRenderProps } from "react-media-recorder-2";
import { devLog } from "../../helpers/logger";
import Video from "../../public/static/img/svg/video.svg";
import Image from "next/image";
import { Button } from "react-bootstrap";

const ReactMediaRecorder = dynamic(
  () => import("react-media-recorder-2").then((m) => m.ReactMediaRecorder),
  {
    ssr: false,
  }
);

interface VideoRecorderProps {
  fileName: string;
  stopAndUpload: (file: File) => void;
}

const VideoRecorder = ({ fileName, stopAndUpload }: VideoRecorderProps) => {
  const [show, setShow] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const isPreparingToRecord = useRef(false);
  const isRecording = useRef(false);
  const hasRecording = useRef(false);

  const onStop = async (blobUrl: string, blob: Blob) => {
    devLog("onStop", hasRecording.current);

    if (hasRecording.current) {
      const file = new File([blob], `${fileName}.mp4`, {
        type: 'video/mp4',
        lastModified: Date.now(),
      });

      devLog(file);
      hasRecording.current = false;
      stopAndUpload(file);
    }
  };

  const MediaRecorder = ({
    startRecording,
    stopRecording,
    previewStream,
    status,
    error,
  }: ReactMediaRecorderRenderProps) => {
    useEffect(() => {
      if (previewStream && videoRef.current) {
        videoRef.current.srcObject = previewStream;
      }
    }, [previewStream]);

    const preRecordingCountdown = () => {
      isPreparingToRecord.current = true;

      let number = 3;

      const interval = setInterval(async () => {
        devLog("preRecordingCountdown", number, isPreparingToRecord.current);

        if (isPreparingToRecord.current) {
          if (number > 0) {
            if (countdownRef.current) {
              countdownRef.current.innerHTML = `<div class="tw-p-2">Starting in <br /> <b>${number}</b></div>`;
            }

            number -= 1;
          } else {
            recordingCountdown();
            clearInterval(interval);
          }
        } else {
          if (countdownRef.current) {
            countdownRef.current.innerHTML = "";
          }

          clearInterval(interval);
        }
      }, 1000);
    };

    const recordingCountdown = () => {
      if (countdownRef.current) {
        countdownRef.current.innerHTML = "";
      }

      isPreparingToRecord.current = false;
      stopRecording();
      startRecording();
      isRecording.current = true;

      let number = 60;

      const interval = setInterval(() => {
        devLog("recordingCountdown", number, isRecording.current);

        if (isRecording.current) {
          hasRecording.current = true;

          if (number > 0) {
            number -= 1;

            if (countdownRef.current) {
              countdownRef.current.innerHTML = `<div class="tw-p-2"><b>00:${
                number < 10 ? "0" : ""
              }${number}</b></div>`;
            }
          } else {
            if (countdownRef.current) {
              countdownRef.current.innerHTML = "";
            }

            stopRecording();
            isRecording.current = false;
            setShow(false);
            clearInterval(interval);
          }
        } else {
          if (countdownRef.current) {
            countdownRef.current.innerHTML = "";
          }

          stopRecording();
          setShow(false);
          clearInterval(interval);
        }
      }, 1000);
    };

    return (
      <>
        {!show ? (
          <Button
            variant={"secondary"}
            onClick={() => {
              startRecording();
              setShow(true);
            }}
          >
            <div style={{ width: "170px" }} className="mx-auto">
              <Image
                className="tw-me-[8px] tw-inline tw-h-8 tw-w-8"
                src={Video}
                alt="img"
              />
              <span>Record video</span>
            </div>
          </Button>
        ) : (
          <div className="tw-dui-modal-open tw-dui-modal tw-dui-modal-bottom sm:tw-dui-modal-middle">
            <div className="tw-dui-modal-box tw-relative tw-w-full tw-max-w-4xl tw-p-0">
              <label
                onClick={() => {
                  isPreparingToRecord.current = false;
                  isRecording.current = false;
                  stopRecording();
                  setShow(false);
                }}
                className="tw-dui-btn-sm tw-dui-btn-circle tw-dui-btn tw-absolute tw-right-2 tw-top-2 tw-z-20"
              >
                ✕
              </label>

              {!error && (status === "idle" || status === "recording") ? (
                <div className="tw-relative">
                  <div
                    ref={countdownRef}
                    className="tw-absolute tw-left-1/2 tw-top-0 tw-z-10 tw-w-full -tw-translate-x-1/2 tw-transform tw-bg-[rgba(0,0,0,.25)] tw-text-white"
                  />

                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="tw-h-full tw-min-h-[384px] tw-w-full tw-bg-black"
                  />

                  <div className="tw-absolute tw-bottom-4 tw-left-1/2 tw-flex -tw-translate-x-1/2 tw-transform tw-justify-center">
                    {isRecording.current ? (
                      <button
                        onClick={() => {
                          isPreparingToRecord.current = false;
                          isRecording.current = false;
                          stopRecording();
                          setShow(false);
                        }}
                        title="Stop Recording"
                      >
                        <MdStop className="tw-h-12 tw-w-12 tw-rounded-full tw-border tw-bg-white tw-text-red-500" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (!isPreparingToRecord.current) {
                            preRecordingCountdown();
                          }
                        }}
                        title="Start Recording"
                      >
                        <MdFiberManualRecord className="tw-h-12 tw-w-12 tw-rounded-full tw-border tw-bg-white tw-text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="tw-flex tw-min-h-[384px] tw-items-center tw-justify-center tw-bg-black tw-p-4 tw-text-white">
                  {error === "permission_denied" && (
                    <>
                      Permission denied by browser, <br /> please grant access
                      and reload page.
                    </>
                  )}

                  {error === "no_specified_media_found" && (
                    <>No specified media found.</>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <ReactMediaRecorder
      video
      audio
      stopStreamsOnStop
      onStop={onStop}
      render={MediaRecorder}
    />
  );
};

export default VideoRecorder;
