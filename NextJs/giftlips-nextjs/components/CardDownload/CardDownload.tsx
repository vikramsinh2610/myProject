import { Button, Col, Row } from "react-bootstrap";
// import DownloadCardPreview from "../../../pages/Dashboard/components/DownloadCardPreview";
// import DownloadCardLink from "../../../pages/Dashboard/components/DownloadCardLink";
import { Feature } from "flagged";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { saveAs } from "file-saver";
import http from "../../services/http.service";
import DownloadCardPreview from "./DownloadCardPreview";
import DownloadCardLink from "./DownloadCardLink";
import { devLog } from "../../helpers/logger";
import moment from "moment/moment";

const CardDownload = ({ cardData, onExit }: any) => {
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<any>({
    buttons: false,
  });

  const {
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      filetype: "pdf",
    },
  });

  const downloadAsSVG = async () => {
    setProgress(30);
    setIsLoading((before: any) => ({ ...before, buttons: true }));
    let response = await http.post(
      `/cards/${cardData._id}/download/`,
      { file_type: "svg" },
      { responseType: "blob" }
    );
    saveAs(response.data);
    if (response?.data)
      setTimeout(() => {
        setProgress(100);
        setIsLoading((before: any) => ({ ...before, buttons: false }));
      });
  };

  const downloadAsJPEG = async () => {
    setProgress(30);
    setIsLoading((before: any) => ({ ...before, buttons: true }));
    let response = await http.post(
      `/cards/${cardData._id}/download/`,
      { file_type: "jpeg", resize: 1, jpeg_quality: 100 },
      { responseType: "blob" }
    );
    saveAs(response.data);
    if (response?.data)
      setTimeout(() => {
        setProgress(100);
        setIsLoading((before: any) => ({ ...before, buttons: false }));
      });
  };

  const downloadAsPNG = async () => {
    setProgress(30);
    setIsLoading((before: any) => ({ ...before, buttons: true }));
    let response = await http.post(
      `/cards/${cardData._id}/download/`,
      { file_type: "png", resize: 1, jpeg_quality: 100 },
      { responseType: "blob" }
    );
    saveAs(response.data);
    if (response?.data)
      setTimeout(() => {
        setProgress(100);
        setIsLoading((before: any) => ({ ...before, buttons: false }));
      });
  };

  const downloadAsPDF = async (pageSize: any) => {
    setProgress(30);
    setIsLoading((before: any) => ({ ...before, buttons: true }));
    let response = await http.post(
      `/cards/${cardData._id}/download/`,
      { file_type: "pdf", pageSize },
      { responseType: "blob" }
    );
    saveAs(response.data);
    devLog("getCards response", response);
    if (response?.data)
      setTimeout(() => {
        setProgress(100);
        setIsLoading((before: any) => ({ ...before, buttons: false }));
      });
  };

  const colourStyles = {
    control: (styles: any) => ({ ...styles, backgroundColor: "white" }),
    option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? "#ff003f"
          : isFocused
          ? "white"
          : undefined,
        color: isDisabled
          ? "#ccc"
          : isSelected
          ? "white"
          : isFocused
          ? "black"
          : data.color,
        cursor: isDisabled ? "not-allowed" : "pointer",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled ? data.color : undefined,
        },
      };
    },
    input: (styles: any) => ({ ...styles }),
    placeholder: (styles: any) => ({ ...styles }),
    singleValue: (styles: any, { data }: any) => ({ ...styles }),
  };

  return (
    <Fragment>
      <div className="container">
        <Row>
          <Col>
            <DownloadCardPreview cardData={cardData} />
            <p>
              You can scan the QR code on your greeting card to access your
              videos!
            </p>

            <DownloadCardLink
              isLoading={isLoading}
              colourStyles={colourStyles}
              setValue={setValue}
              watch={watch}
              getValues={getValues}
              onExit={onExit}
              downloadAsSVG={downloadAsSVG}
              downloadAsPNG={downloadAsPNG}
              downloadAsJPEG={downloadAsJPEG}
              downloadAsPDF={downloadAsPDF}
            />
            <Feature name="emailCard">
              <hr />
              <Button
                className="btn btn-gl-secondary px-13 px-sm-5"
                onClick={() => {}}
                disabled={isLoading?.buttons}
              >
                Send e-card
              </Button>
            </Feature>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default CardDownload;
