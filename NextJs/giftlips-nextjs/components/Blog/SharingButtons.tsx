import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

const SharingButtons = ({ data }: any) => {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2">
      <FacebookShareButton url={data?.link} quote={data?.excerpt?.rendered}>
        <i className="bi bi-facebook h4 text-primary"></i>
      </FacebookShareButton>

      <LinkedinShareButton
        url={data?.link}
        title={data?.title?.rendered}
        summary={data?.excerpt?.rendered}
        source={data?.link}
      >
        <i className="bi bi-linkedin h4 text-primary"></i>
      </LinkedinShareButton>

      {data?.yoast_head_json?.og_image && (
        <PinterestShareButton
          url={data?.link}
          media={data?.yoast_head_json.og_image[0].url}
          description={data?.excerpt?.rendered}
        >
          <i className="bi bi-pinterest h4 text-primary"></i>
        </PinterestShareButton>
      )}

      <RedditShareButton url={data?.link} title={data?.title?.rendered}>
        <i className="bi bi-reddit h4 text-primary"></i>
      </RedditShareButton>

      <TwitterShareButton
        url={data?.link}
        title={data?.title?.rendered}
        via={data?.link}
      >
        <i className="bi bi-twitter h4 text-primary"></i>
      </TwitterShareButton>

      <WhatsappShareButton url={data?.link} title={data?.title?.rendered}>
        <i className="bi bi-whatsapp h4 text-primary"></i>
      </WhatsappShareButton>

      <TelegramShareButton url={data?.link} title={data?.title?.rendered}>
        <i className="bi bi-telegram h4 text-primary"></i>
      </TelegramShareButton>

      <EmailShareButton
        url={data?.link}
        subject={data?.title?.rendered}
        body={data?.excerpt?.rendered}
      >
        <i className="bi bi-envelope-fill h4 text-primary"></i>
      </EmailShareButton>
    </div>
  );
};

export default SharingButtons;
