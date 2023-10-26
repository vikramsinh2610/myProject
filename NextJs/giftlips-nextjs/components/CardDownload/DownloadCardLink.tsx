import Select from "react-select";
import { Button } from "react-bootstrap";
import { Feature } from "flagged";
import { filetypeOptions, pageSizeOptions } from "../../helpers/utils";
import Link from "next/link";

const defaultPageSize = pageSizeOptions[7] || { label: "A5", value: "A5" };

const DownloadCardLink = ({
  isLoading,
  colourStyles,
  setValue,
  watch,
  getValues,
  onExit,
  downloadAsSVG,
  downloadAsPNG,
  downloadAsJPEG,
  downloadAsPDF,
}: any) => {
  return (
    <div className="d-grid gap-2">
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={filetypeOptions[0]}
        options={filetypeOptions}
        styles={colourStyles}
        onChange={(newValue: any) => {
          setValue("filetype", newValue.value);
          if (getValues("filetype") !== "pdf")
            setValue("pageSize", defaultPageSize?.value);
        }}
      />

      {watch("filetype") === "pdf" && (
        <Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={defaultPageSize}
          options={pageSizeOptions}
          styles={colourStyles}
          onChange={(newValue: any) => setValue("pageSize", newValue.value)}
        />
      )}
      <Button
        variant="gl-primary"
        className="btn-gl-primary-linear-gradient px-13 px-sm-5"
        onClick={() => {
          if (getValues("filetype") === "svg") {
            downloadAsSVG();
          } else if (getValues("filetype") === "png") {
            downloadAsPNG();
          } else if (getValues("filetype") === "jpeg") {
            downloadAsJPEG();
          } else if (getValues("filetype") === "pdf") {
            let pageSize = getValues("pageSize") || defaultPageSize?.value;
            downloadAsPDF(pageSize);
          }
        }}
        disabled={isLoading?.buttons}
      >
        Download
      </Button>
      <Feature name="emailCard">
        <Button
          variant="secondary"
          onClick={() => {}}
          disabled={isLoading?.buttons}
        >
          Send e-card
        </Button>
      </Feature>
      <Button onClick={onExit} variant={"secondary"}>
        Go to my Cards
      </Button>
    </div>
  );
};

export default DownloadCardLink;
