import { Suspense, useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { Badge, Button, Col, Container, Modal, Row } from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/router";
import http from "../../../services/http.service";
import get from "../../../services/get.card.service";
import { findAndSetSvg } from "../../../helpers/utils";
import { useModalContext, useUserContext } from "../../../context/contextLib";
import GLReels from "../../../components/Reels/GLReels";
import SVGLoaderEditor from "../../../components/SVGLoaderEditor/SVGLoaderEditor";
import CardUpload from "../../../components/CardUpload/CardUpload";
import AppLayout from "../../../components/layout/AppLayout";
import { useSession } from "next-auth/react";
import { devLog } from "../../../helpers/logger";
import Addons from "../../../components/Addons/Addons";
import Image from "next/image";
import card from "../../../public/static/img/svg/printnship.svg";
import { NextSeo } from "next-seo";
import CopyClipboard from "../../../components/CopyClipboard/CopyClipboard";
import Share from "../../../components/Blog/Share";
import Form from "react-bootstrap/Form";
import SharingReels from "../../../components/Reels/SharingReels";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EntryGallery from "../../../components/Gallery/Entries";

const CardEdit = ({ data }: any) => {
  const session: any = useSession();
  const { setSavedCard }: any = useUserContext();
  const { setShowUpgradeModal }: any = useModalContext();
  const router = useRouter();
  const { id, redirect_url }: any = router.query;
  const [svgSrc, setSvgSrc] = useState<any>(null);
  const [cardData, setCardData] = useState<any>(data);
  const [cardEntries, setCardEntries] = useState<any>([]);
  const [isOnPageLoading, setIsOnPageLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUpgrade, setIsUpgrade] = useState(false);
  const [message, setMessage] = useState("");
  const [glPlans, setGlPlans] = useState<any>(null);
  const [showBack, setShowBack] = useState("");
  const [showStep2, setShowStep2] = useState("");
  const [video, setVideo] = useState("");
  const [invitedLinkData, setInvitedLinkData] = useState<any>();
  const [invitedUser, setInvitedUser] = useState();
  const [showInvite, setShowInvite] = useState(false);
  const [showInviteOther, setShowInviteOther] = useState(false);
  const [loaderInvite, setLoaderInvite] = useState(false);
  const [inviteData, setInviteData] = useState({ title: "", name: "" });
  const [inviteDataOtherData, setInvitedOtherData] = useState<any>();
  const [isMssg, setIsmsg] = useState<any>();
  const [msg, setmsg] = useState<any>();

  const invitedLinks = async () => {
    try {
      let invitedLink: any = await http.get(
        `/card-invites/${cardData?._id}/invitedcardlink`
      );
      if (invitedLink.data.data === null) {
        setInvitedLinkData({});
      } else {
        setInvitedLinkData(invitedLink?.data?.data);
      }
    } catch (e: any) {
      console.log(e?.response?.data?.message);
    }
  };

  const submitInvite = async (e: any) => {
    e.preventDefault();
    setLoaderInvite(true);

    if (Object?.keys(invitedLinkData)?.length === 0) {
      try {
        await http.put(`/public/cards/${cardData._id}/`, {
          title: inviteData.title,
          name: inviteData.name,
        });
        const response = await http.post(`/card-invites/inviteOthers`, {
          cardId: cardData?._id,
          name: inviteData.name,
        });
        setInvitedOtherData(response?.data?.cardInvite);
        setInvitedLinkData(response?.data?.cardInvite);
        setShowInviteOther(true);
        setLoaderInvite(false);
      } catch (e: any) {
        showToastMessage(e?.response?.data?.message);
      }
    } else {
      setShowInviteOther(true);
      setLoaderInvite(false);
    }
  };

  const showToastMessage = (error: any) => {
    toast.error(error, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showErrorMessage = () => {
    toast.success("You are not owner of this card", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleChange = (e: any) => {
    setInviteData({
      ...inviteData,
      [e.target.name]: e.target.value,
    });
  };

  const getPlans = async () => {
    try {
      const res = await http.get("/billing/plans");
      setGlPlans(res.data);
    } catch (e: any) {
      console.log(e.response);
    }
  };

  useEffect(() => {
    void getPlans();
    let invitedUser: any = localStorage.getItem("Inviteduser");
    setInvitedUser(invitedUser);
    if (invitedUser !== null) {
      setShowStep2("show");
    }
    invitedLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (redirect_url) {
        window.location.assign(redirect_url);
      }
    }, 500);
  }, [redirect_url]);

  useEffect(() => {
    if (router.isReady && session.status !== "loading") {
      void getCard();
      void getCardEntries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, session.status]);

  const getCard = async () => {
    try {
      let response = await get.get(`/cards/${id}`);
      setCardData(response?.data);
      setMessage(response?.data?.message);
      let svg = await findAndSetSvg(response?.data);
      setProgress(30);
      setTimeout(() => {
        setSvgSrc(svg);
        setIsOnPageLoading(false);
        setProgress(100);
      });
    } catch (e: any) {
      devLog(e.response);
    }
  };

  const getCardEntries = async () => {
    try {
      let response = await get.get(`/entries?cardId=${id}`);

      if (session.status === "unauthenticated") {
        let anonymousEntry = JSON.parse(
          localStorage.getItem("anonymousEntry") || ""
        );

        let updatedAnonymousEntry;

        response?.data?.map((entry: any) => {
          if (entry?._id === anonymousEntry?._id) {
            updatedAnonymousEntry = entry;
          }
        });

        localStorage.setItem(
          "anonymousEntry",
          JSON.stringify(updatedAnonymousEntry)
        );

        setCardEntries([updatedAnonymousEntry]);
      } else {
        setCardEntries(response?.data);
      }

      let message = await get.get(`/cards/${id}`);
      setMessage(message?.data?.message);

      if (
        response?.data[0]?.url != "" &&
        response?.data[0]?.url !== undefined
      ) {
        setVideo(response?.data[0]?.url);
      }
    } catch (e: any) {
      devLog(e.response);
    }
  };

  const onEditDesign = async (e: any, url: string, data: any) => {
    let response = await http.post(`/public/cards/${cardData._id}/assets`, {
      assets: [{ url: url }],
    });

    await http.put(`/public/cards/${cardData._id}`, {
      message: data.message,
      qrImage: data.qrImage,
      coverUrl: url,
    });

    setCardData(response.data);
    setMessage(data?.message);
    let nextToggle: any = document.querySelector(
      ".accordion-item:nth-child(2) button"
    );

    if (nextToggle) {
      nextToggle.click();
    }
  };

  const PrintAndShipButton = () => {
    return (
      <Button
        variant="success"
        onClick={() => {
          setIsUpgrade(true);
          setIsmsg("");
        }}
        disabled={
          invitedUser !== null ||
          message === "" ||
          message === undefined ||
          message === "Your message here..."
            ? true
            : false
        }
        className="d-flex justify-content-center align-items-center gap-2"
      >
        <Image src={card} alt="img" height={32} width={32} /> Print & ship
      </Button>
    );
  };

  const ExtendcardButton = () => {
    return (
      <Button
        variant="warning"
        onClick={() => {
          setSavedCard(cardData);
          setTimeout(() => {
            setShowUpgradeModal(true);
          });
        }}
      >
        <i className="bi bi-lock"></i> Extend card
      </Button>
    );
  };

  const showSuccessMessages = () => {
    if (invitedUser !== null) {
      toast.success("Thank you for your collaboration", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      let response = await http.delete(`/entries/${id}`);
      if (response.data) {
        getCardEntries();
      }
    } catch (e: any) {
      devLog(e.response);
    }
  };

  const handleInvite = () => {
    if (invitedUser === "" || invitedUser === null) {
      if (Object.keys(invitedLinkData).length === 0) {
        setShowInvite(true);
      } else {
        setShowInvite(true);
        setShowInviteOther(true);
      }
    } else {
      showErrorMessage();
    }
  };

  const handleCloseInviteOthers = () => {
    setShowInvite(false);
    setShowInviteOther(false);
    setInviteData({ title: "", name: "" });
  };

  useEffect(() => {
    const date = new Date(cardData?.expiryAt);
    const cDate = new Date();

    if (cardData) {
      if (cDate > date) {
        setShowCard(true);
      } else {
        setShowCard(false);
      }
    }
  }, [cardData]);

  useEffect(() => {
    let msg: any = localStorage.getItem("text");
    setmsg(msg);
  }, [isMssg]);

  return (
    <AppLayout>
      <NextSeo noindex={true} />

      <ToastContainer />

      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="pt-1"
      />

      {isUpgrade ? (
        <div className="container-fluid pt-8">
          <div className="row justify-content-center my-3">
            <div
              className="col-xl-7 col-sm-10"
              style={{ position: "relative", paddingTop: "60px" }}
            >
              {showBack !== "hide" && (
                <div className="backBtn">
                  <Button
                    className="test"
                    onClick={() => {
                      setIsUpgrade(false);
                      setIsmsg("msg");
                    }}
                  >
                    Back
                  </Button>
                </div>
              )}

              <Addons
                cardData={cardData}
                glPlans={glPlans}
                setShowBack={setShowBack}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="CardEditPage">
          {!isOnPageLoading && (
            <>
              {showCard === false ? (
                <>
                  <Container>
                    <Row>
                      <Col md={{ span: 6, offset: 3 }}>
                        <Accordion
                          id="FooterFAQ"
                          defaultActiveKey={invitedUser !== null ? "1" : "0"}
                        >
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              <Badge bg="dark">Step 1</Badge>&nbsp;Customize
                              design
                            </Accordion.Header>
                            <Accordion.Body>
                              <Suspense fallback={<div />}>
                                <SVGLoaderEditor
                                  src={svgSrc}
                                  message={
                                    isMssg === "msg" ? msg : cardData?.message
                                  }
                                  qrImage={cardData?.qrImage}
                                  qrOptions={{
                                    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/cards/${cardData?.shortId}`,
                                    ...cardData?.template?.qr,
                                  }}
                                  onSave={onEditDesign}
                                  setShowStep2={setShowStep2}
                                  inviteduser={invitedUser}
                                />
                              </Suspense>
                            </Accordion.Body>
                          </Accordion.Item>

                          {showStep2 === "show" && (
                            <Accordion.Item eventKey="1">
                              <Accordion.Header>
                                <Badge bg="dark">Step 2</Badge>&nbsp;Add Your
                                Video Message
                              </Accordion.Header>
                              <Accordion.Body className="text-center">
                                {cardData && cardEntries.length > 0 ? (
                                  <>
                                    <div className="tw-mb-4 tw-flex tw-items-center">
                                      <div className="tw-dui-mockup-phone">
                                        <div className="tw-dui-camera"></div>
                                        <div className="tw-dui-display">
                                          <div className="tw-dui-phone-1 tw-dui-artboard tw-dui-artboard-demo tw-max-w-full">
                                            <GLReels
                                              cardEntries={cardEntries}
                                              mockupPhone={true}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row py-4 overflow-auto">
                                      <EntryGallery
                                        card={cardData}
                                        entries={cardEntries}
                                        userId={session?.data?.user?.id}
                                        handleDeleteVideo={handleDeleteVideo}
                                      />
                                    </div>
                                    <div className="d-grid gap-2">
                                      {!cardEntries?.some(
                                        (entry: any) =>
                                          entry?.userId?._id ===
                                          session?.data?.user?.id
                                      ) &&
                                        session.status !==
                                          "unauthenticated" && (
                                          <Button
                                            variant="secondary"
                                            className="flex items-center"
                                            onClick={() =>
                                              setShowUploader(true)
                                            }
                                          >
                                            <i className="bi bi-camera-video"></i>{" "}
                                            Add more messages
                                          </Button>
                                        )}

                                      {invitedUser === null &&
                                        session.status !==
                                          "unauthenticated" && (
                                          <Button
                                            variant={"secondary"}
                                            onClick={() => handleInvite()}
                                          >
                                            <div
                                              style={{ width: "170px" }}
                                              className="mx-auto"
                                            >
                                              <span>Invite Others</span>
                                            </div>
                                          </Button>
                                        )}

                                      <Button
                                        variant="secondary"
                                        className="flex items-center"
                                        onClick={() =>
                                          router.push(`/dashboard`)
                                        }
                                      >
                                        Save for later
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <CardUpload
                                    cardData={cardData}
                                    handleClose={() => {
                                      setShowUploader(false);
                                      getCardEntries();
                                      showSuccessMessages();
                                    }}
                                  />
                                )}
                              </Accordion.Body>
                            </Accordion.Item>
                          )}
                        </Accordion>
                      </Col>
                    </Row>
                  </Container>

                  {cardData &&
                    cardEntries.length > 0 &&
                    invitedUser === null &&
                    showStep2 === "show" &&
                    video != "" && (
                      <Container className="mt-5 mb-5">
                        <Row>
                          <Col md={{ span: 6, offset: 3 }}>
                            <div className="d-grid gap-2">
                              <PrintAndShipButton />
                            </div>
                          </Col>
                        </Row>
                      </Container>
                    )}

                  <Modal
                    show={showUploader}
                    onHide={() => setShowUploader(false)}
                    keyboard={false}
                    animation={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Add videos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CardUpload
                        cardData={cardData}
                        handleClose={() => {
                          setShowUploader(false);
                          getCardEntries();
                        }}
                      />
                    </Modal.Body>
                  </Modal>
                </>
              ) : (
                <Container>
                  <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                      <div className="cardBox">
                        <h1 className="cardBox__name">
                          {cardData?.message || cardData?.title}
                        </h1>
                        <div className="cardBox__img">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cardData?.template?.assets[0]?.url}
                            alt={cardData?.title}
                          />
                        </div>
                        <h2 className="cardBox__note">
                          <span>Note:</span> Enjoy uninterrupted benefits and
                          rewards by extending your card plan today!
                        </h2>
                        <div className="cardBox__btns">
                          <ExtendcardButton />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Container>
              )}

              <Modal className="cardsModel" show={showInvite}>
                <i className="bi bi-x" onClick={handleCloseInviteOthers}></i>

                {!showInviteOther && (
                  <Modal.Body>
                    <Modal.Title>Who are you sending to?</Modal.Title>
                    <span>
                      Your video card will only be sent when your ready. You can
                      edit this info at any time.
                    </span>
                    <Form onSubmit={submitInvite}>
                      <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Card title</Form.Label>
                        <Form.Control
                          name="title"
                          type="text"
                          required
                          onChange={handleChange}
                          defaultValue={inviteData.title}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="addressLine">
                        <Form.Label>Recipent's name</Form.Label>
                        <Form.Control
                          name="name"
                          type="text"
                          required
                          onChange={handleChange}
                          defaultValue={inviteData.name}
                        />
                      </Form.Group>
                      <Button className="w-100" variant="primary" type="submit">
                        {loaderInvite && (
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
                        Save
                      </Button>
                    </Form>
                  </Modal.Body>
                )}

                {showInviteOther && (
                  <Modal.Body>
                    <Modal.Title>Invite Others</Modal.Title>
                    <p>
                      Share more joy by inviting others to add their videos to
                      card.
                    </p>
                    <div
                      className="socialmedia-block"
                      style={{ textAlign: "center" }}
                    >
                      <Share url={invitedLinkData?.inviteLink} title="Share" />
                      <ul style={{ marginTop: "15px" }}>
                        {" "}
                        <SharingReels
                          data={invitedLinkData?.inviteLink}
                          cardData={cardData}
                          description=""
                        />{" "}
                      </ul>
                    </div>
                    <p>
                      Or copy and paste <strong>your card's unique link</strong>{" "}
                      into your preferred messaging platform to send to friends
                      and family.
                    </p>
                    <p>
                      Remember to type a message telling them why you want to
                      contribute.
                    </p>
                    <div className="your-carr-link-block">
                      <h5>Your card's unique link</h5>
                      <p style={{ wordBreak: "break-all" }} id="myLink">
                        {Object.keys(invitedLinkData).length === 0
                          ? inviteDataOtherData?.inviteLink
                          : invitedLinkData?.inviteLink}
                      </p>
                      <CopyClipboard
                        glClassNames="btn link"
                        textTopCopy={invitedLinkData?.inviteLink}
                        buttonText="Copy link"
                      />
                    </div>
                  </Modal.Body>
                )}
              </Modal>
            </>
          )}
        </div>
      )}
    </AppLayout>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE_BASE_URL}/public/cards/${id}`
  );
  const data = await res.json();

  return { props: { data } };
}

export default CardEdit;
