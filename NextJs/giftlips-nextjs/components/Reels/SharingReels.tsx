import {
  EmailShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";
import { devLog } from "../../helpers/logger";
import {
  FaWhatsapp,
  FaTelegram,
  FaPinterest,
  FaLinkedin,
} from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
const SharingButtons = ({ data, cardData }: any) => {
  devLog(data, cardData);

  return (
    <div className="tw-flex tw-items-center tw-justify-center tw-gap-3">
      <WhatsappShareButton className="tw-flex tw-items-center"
        url={data}
        title={cardData?.message || cardData.title}
      >
        <FaWhatsapp className="tw-fill-[#ed1d24] tw-h-6 tw-w-6" />
      </WhatsappShareButton>
      <TelegramShareButton
         className="tw-flex tw-items-center"
        url={data}
        title={cardData?.message || cardData.title}
      >
        <FaTelegram className="tw-fill-[#ed1d24] tw-h-6 tw-w-6" />
      </TelegramShareButton>
      <PinterestShareButton
        className="tw-flex tw-items-center"
        url={data}
        media={cardData?.template?.coverUrl}
        description={cardData?.message || cardData.title}
      >
        <FaPinterest className="tw-fill-[#ed1d24] tw-h-6 tw-w-6" />
      </PinterestShareButton>
      <LinkedinShareButton
         className="tw-flex tw-items-center"
        url={data}
        title={cardData?.message || cardData.title}
        source={data}
      >
        <FaLinkedin className="tw-fill-[#ed1d24] tw-h-6 tw-w-6" />
      </LinkedinShareButton>
      <EmailShareButton
        className="tw-flex tw-items-center"
        url={data}
        subject={cardData?.message || cardData.title}
      >
        <AiOutlineMail className="tw-fill-[#ed1d24] tw-h-6 tw-w-6" />
      </EmailShareButton>
    </div>
  );
};

export default SharingButtons;
