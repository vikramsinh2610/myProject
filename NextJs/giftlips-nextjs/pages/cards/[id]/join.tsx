import { Suspense, useEffect, useState } from "react";
import http from "../../../services/http.service";
import { findAndSetSvg } from "../../../helpers/utils";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
} from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import PhonePreview from "../../../components/PhonePreview/PhonePreview";
import { useModalContext, useUserContext } from "../../../context/contextLib";
import GLReels from "../../../components/Reels/GLReels";
import { devLogError } from "../../../helpers/logger";
import { useRouter } from "next/router";
import AppLayout from "../../../components/layout/AppLayout";
import CardUpload from "../../../components/CardUpload/CardUpload";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";

const Collaboration = () => {
  const router = useRouter();
  const { id } = router.query;
  const session = useSession();
  const { setSavedCardId } = useUserContext();
  const { setShowAuthModal } = useModalContext();
  const [cardData, setCardData] = useState<any>({});
  const [cardEntries, setCardEntries] = useState<any>([]);
  const [showUploader, setShowUploader] = useState<boolean>(false);
  const [cardMember, setCardMember] = useState<any>(null);
  const [addVideo, setAddvideo] = useState<boolean>(false);
  const [cardUserdata, setCardUserdata] = useState<any>();

  const [svgSrc, setSvgSrc] = useState<any>(null);
  const [isOnPageLoading, setIsOnPageLoading] = useState<boolean>(true);

  useEffect(() => {
    if (router.isReady) {
      void getCard();
      void getCardEntries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, showUploader]);

  const getCardEntries = async () => {
    try {
      let response = await http.get(`/entries?cardId=${id}`);
      setCardEntries(response.data);
    } catch (e: any) {
      devLogError(e.response);
    }
  };

  const getCard = async () => {
    try {
      let response = await http.get(`/public/cards/${id}`);
      setCardData(response.data);
      // @ts-ignore
      if (session.data?.user?.id === response.data.userId) {
        setCardUserdata(session?.data?.user);
        //  await router.push(`/customize/${response.data._id}`);
        // await router.push(`/cards/${response.data._id}/customize`);
      }
      setTimeout(async () => {
        let svg = await findAndSetSvg(response.data);
        setSvgSrc(svg);
      });
      setIsOnPageLoading(false);
    } catch (e: any) {
      setIsOnPageLoading(false);
    }
  };

  useEffect(() => {
    if (cardData) {
      getCardMember();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardData]);

  const getCardMember = async () => {
    try {
      let response = await http.get(
        `/card-members/${cardData?._id}/personalDetailOfMember`
      );
      setCardMember(response?.data?.data);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (cardMember) {
      const member = cardMember.find(
        (X: any) => X.email === session.data?.user?.email
      );
      if (member || cardUserdata?.id === cardData?.userId) {
        setAddvideo(true);
      } else {
        setAddvideo(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardMember]);

  return (
    <AppLayout>
      <NextSeo noindex={true} />

      <div className="CardEditPage">
        {!isOnPageLoading && cardData && (
          <main>
            <Container>
              <Row>
                <Col md={{ span: 6, offset: 3 }}>
                  <Card className="mb-3">
                    <Card.Img variant="top" src={svgSrc} />
                  </Card>
                  <Accordion id="FooterFAQ" defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <Badge bg="dark">STEP 1</Badge>&nbsp;Add Fun Videos
                      </Accordion.Header>
                      <Accordion.Body className="text-center">
                        <Suspense fallback={<div />}>
                          <div className="d-flex justify-content-center mb-3">
                            <PhonePreview>
                              <GLReels entries={cardEntries} />
                            </PhonePreview>
                          </div>
                          <div className="d-grid gap-2">
                            <Button
                              variant="success"
                              onClick={() => {
                                if (session.status !== "authenticated") {
                                  setSavedCardId(cardData._id);
                                  setShowAuthModal(true);
                                } else {
                                  setShowUploader(true);
                                }
                              }}
                              disabled={addVideo === true ? false : true}
                            >
                              <i className="bi bi-camera-video"></i> Add Your
                              Video
                            </Button>
                            {!addVideo && (
                              <span className="text-danger">
                                Note : Before you can add an entry, you should
                                be a card member
                              </span>
                            )}
                          </div>
                        </Suspense>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  {session.status === "authenticated" && (
                    <div className="d-grid gap-2 mt-3">
                      <Button
                        variant="primary"
                        onClick={() => {
                          router.push("/dashboard");
                        }}
                      >
                        Back to Dashboard
                      </Button>
                    </div>
                  )}
                </Col>
              </Row>
            </Container>

            <Modal
              show={showUploader}
              onHide={() => {
                setShowUploader(false);
              }}
              keyboard={false}
              animation={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Add Videos</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <CardUpload
                  cardData={cardData}
                  handleClose={() => {
                    setShowUploader(false);
                  }}
                />
              </Modal.Body>
            </Modal>
          </main>
        )}
      </div>
    </AppLayout>
  );
};

export default Collaboration;
