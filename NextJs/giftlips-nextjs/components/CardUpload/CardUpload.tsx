import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import CardFileDropzone from "../CardFileDropzone/CardFileDropzone";
import { useModalContext, useUserContext } from "../../context/contextLib";
import Upload from "../../public/static/img/svg/uploadicon.svg";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AudioRecorder from "../Recorder/AudioRecorder";
import VideoRecorder from "../Recorder/VideoRecorder";

const CardUpload = ({ cardData, handleClose }: any) => {
  const { setSavedCard } = useUserContext();
  const { setShowUpgradeModal } = useModalContext();
  const [loader, setLoader] = useState(false);
  const [isValidate, setIsValidate] = useState("");
  const [initialEntries, setInitialEntries] = useState<any[]>([]);
  const [fileUploads, setFileUploads] = useState<any[]>([]);

  const clickUploadFile = () => {
    let _dzuInput: any = document.querySelector("input.dzu-input");

    if (_dzuInput) {
      _dzuInput.click();
    }
  };

  const removeInitialFile = (file: File) => {
    const filteredFileUpload = fileUploads.filter(
      (item) => item.name !== file.name
    );
    setFileUploads(filteredFileUpload);

    if (initialEntries[0] && file.name === initialEntries[0].name) {
      setInitialEntries([]);
    }
  };

  const getUploadParams = async (file: File) => {
    try {
      if (initialEntries.length === 0) {
        setFileUploads([...fileUploads, file]);
        setInitialEntries([file]);
      } else {
        let r = initialEntries;
        r.push(file);
        setFileUploads([...fileUploads, file]);
        setInitialEntries(r);
      }
    } catch (e: any) {
      if (e.response.data.code === "LIMIT_EXCEEDED") {
        handleClose();

        setTimeout(() => {
          setSavedCard(cardData);
          setShowUpgradeModal(true);
        });
      }

      return null;
    }
  };

  return (
    <>
<ToastContainer />
      {cardData && (
        <Container>
          <Row>
            <Col>
              <>
                {initialEntries && (
                  <CardFileDropzone
                    handleClose={handleClose}
                    initialFiles={initialEntries}
                    cardData={cardData}
                    showAddFilesButton={false}
                    removeInitialFile={(file: File) => removeInitialFile(file)}
                    setIsValidate={(message: string) => setIsValidate(message)}
                    isValidate={isValidate}
                    setLoader={setLoader}
                    fileUploads={fileUploads}
                    setFileUploads={setFileUploads}
                  />
                )}

                <div className="d-grid gap-2 mt-4">
                  {fileUploads.length === 0 && (
                    <>
                      <VideoRecorder
                        fileName={`video-recording-${fileUploads.length + 1}`}
                        stopAndUpload={getUploadParams}
                      />

                      <AudioRecorder
                        fileName={`audio-recording-${fileUploads.length + 1}`}
                        stopAndUpload={getUploadParams}
                      />

                      {isValidate === "" ? (
                        <Button
                          variant={"secondary"}
                          onClick={clickUploadFile}
                          disabled={fileUploads.length !== 0}
                        >
                          <div style={{ width: "170px" }} className="mx-auto">
                            <Image
                              className="tw-me-[16px] tw-ms-[12px] tw-inline tw-h-5 tw-w-5"
                              src={Upload}
                              alt="img"
                            />
                            <span>Upload videos</span>
                          </div>
                        </Button>
                      ) : (
                        <Button
                          variant={"error"}
                          disabled={true}
                          style={{
                            color: "red",
                          }}
                        >
                          {isValidate}
                        </Button>
                      )}
                    </>
                  )}

                  {fileUploads.length > 0 && (
                    <Button
                      variant={"success"}
                      onClick={handleClose}
                      disabled={!loader ? false : true}
                    >
                      {loader && (
                        <span
                          style={{
                            marginLeft: "12px",
                            marginRight: "10px",
                          }}
                        >
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        </span>
                      )}

                      {!loader ? "Generate preview" : "Uploading..."}
                    </Button>
                  )}
                </div>
              </>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};
export default CardUpload;
