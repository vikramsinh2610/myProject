import Image from "next/image";

const LogoIcon = "/static/img/logos/logo.webp";
import { useMediaQuery } from "react-responsive";

const DownloadCardPreview = ({ cardData }: any) => {
  return (
    <div className="image-container mb-2">
      <div
        className="bg-gl-gray-4"
        style={{
          backgroundColor: "#495057",
        }}
      >
        <div className="h-100">
          <Image
            src={cardData?.coverUrl || cardData?.template?.coverUrl || LogoIcon}
            width={cardData.template.width}
            height={cardData.template.height}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = LogoIcon;
            }}
            className="d-block mx-auto img-fluid img-responsive h-100"
            alt="Cover Image"
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadCardPreview;
