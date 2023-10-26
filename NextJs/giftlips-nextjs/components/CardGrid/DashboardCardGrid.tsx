import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  ListGroup,
  Modal,
  Offcanvas,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import moment from "moment";
import ActivityLog from "../ActivityLog/ActivityLog";
import http from "../../services/http.service";
import Addons from "../Addons/Addons";
import userImage from "../../assets/img/public/user-dummy-image.png";
import { useRouter } from "next/router";
import { devLogError } from "../../helpers/logger";
import Pagination from "../../components/Pagination/Pagination";
import CardOrder from "../CardOrder/CardOrder";

const DashboardCardGrid = ({
  cards,
  isLoadingCards,
  currentUser,
  onClick,
  setIsPrintship
}: any) => {
  const [show, setShow] = useState(false);
  const [card, setCard] = useState(null);
  const [cardData, setCardData] = useState<any>({});
  const [showBack, setShowBack] = useState("");
  const [activities, setActivities] = useState(null);
  const [upgradeMembership, setUpgradeMembership] = useState(false);
  const [glPlans, setGlPlans] = useState<any>(null);
  const router = useRouter();
  const [invitedUser, setInvitedUser] = useState();
  const [nPages, setNPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showOder, setShowOder] = useState(false);
  const [recordsPerPage] = useState(9);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = cards.slice(indexOfFirstRecord, indexOfLastRecord);
 
  useEffect(() => {
    setNPages(Math.ceil(cards.length / recordsPerPage));
  }, [cards]);
  const [order, setOrder] = useState(null);
  const [oderData, setOrderData] = useState([]);

  const handleClose = () => setShow(false);
  const getCard = async (id: any) => {
    try {
      let response = await http.get(`/cards/${id}`);
      setCardData(response.data);
    } catch (error: any) {
      devLogError(error);
    }
  };

  const getPlans = async () => {
    try {
      const res = await http.get("/billing/plans");
      setGlPlans(res.data);
    } catch (e: any) {
      devLogError(e.response);
    }
  };

  useEffect(() => {
    void getPlans();
    const button = document.getElementsByClassName("example");
    let invitedUser: any = localStorage.getItem("Inviteduser");
    setInvitedUser(invitedUser);
    
  }, []);

  useEffect(() => {
    if (card) {
      void getActivities(card);
    }
  }, [card]);

  const getActivities = async (card: any) => {
    let response = await http.get(`/activities?cardId=${card._id}`);
    setActivities(response?.data?.docs || []);
  };

  useEffect(() => {
    if (order) {
      void cardOrderData(order);
    }
  }, [order]);

  const cardOrderData = async (cardOrder: any) => {
    try {
      let response = await http.get(
        `/order/orderDetailByCard/${cardOrder._id}`
      );
      if (response?.data?.data) {
        setOrderData(response?.data?.data);
      } else {
        setOrderData([]);
      }
    } catch (error) {
      devLogError(error?.message);
    }
  };
  return (
    <>
      {upgradeMembership ? (
        <div className="container-fluid py-8">
          <div className="row justify-content-center my-3">
            <div
              className="col-xl-7 col-sm-10"
              style={{ position: "relative", paddingTop: "60px" }}
            >
              <Addons
                cardData={cardData}
                glPlans={glPlans}
                setShowBack={setShowBack}
                setUpgradeMembership={setUpgradeMembership}
              />

              {showBack !== "hide" && (
                <div className="backBtn">
                  <Button
                    className="test"
                    onClick={() => {
                      setUpgradeMembership(false)
                      setIsPrintship(false)
                    }}
                  >
                    Back
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <Offcanvas placement={"end"} show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Activity Log</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <ActivityLog
                card={card}
                activities={activities}
                currentUser={currentUser}
              />
            </Offcanvas.Body>
          </Offcanvas>

          <Container>
            {isLoadingCards && (
              <Row className="py-5 text-center" style={{ minHeight: "50vh" }}>
                <Col>
                  <Spinner animation="border" variant="warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </Col>
              </Row>
            )}
            {!isLoadingCards && cards.length === 0 && (
              <Alert variant="info" className="my-5">
                No cards found.
              </Alert>
            )}

            {!isLoadingCards && currentRecords.length > 0 && (
              <Row className="py-5" xs={1} md={1} lg={3}>
                {currentRecords.map((card: any, index: any) => {
                  new Image().src = card?.coverUrl;

                  return (
                    <Col key={index} className="mb-3">
                      <Card>
                        <div onClick={() => onClick(card)} role="button">
                          <Card.Img
                            variant="top"
                            src={card?.assets[0].url}
                            alt="Card image"
                          />
                        </div>
                        <ListGroup className="list-group-flush">
                          <ListGroup.Item>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <i className="bi bi-clock"></i>&nbsp;Expires on:{" "}
                                {moment(card?.expiryAt)?.format("LL")}
                              </div>

                              {moment(card?.expiryAt, "YYYY/MM/DD").isBefore(
                                moment()
                              ) ? (
                                <Button
                                  variant="warning"
                                  className="btn-sm"
                                  onClick={() => {
                                    getCard(card?.shortId);
                                    router.push(
                                      `/cards/${card?.shortId}/customize`
                                    );
                                  }}
                                >
                                  Upgrade
                                </Button>
                              ) : invitedUser !== null ? (
                                <></>
                              ) : (
                                <Button
                                  variant="warning"
                                  className="btn-sm"
                                  onClick={() => {
                                    setUpgradeMembership(true);
                                    setShowBack("show");
                                    getCard(card?.shortId);
                                    setIsPrintship(true)
                                  }}
                                >
                                  Print & ship
                                </Button>
                              )}
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <div className="friendsBlock">
                              <div>
                                <Button
                                  className="grayBorderBtn"
                                  onClick={() => {
                                    setShowOder(true);
                                    setOrder(card);
                                  }}
                                  variant="light"
                                >
                                  <i className="bi bi-cart"></i>&nbsp;Orders:
                                  &nbsp;{card?.orders?.length} &nbsp;
                                </Button>
                              </div>
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <div className="friendsBlock">
                              <div>
                                <i className="bi bi-people"></i>&nbsp;Friends:
                                &nbsp;{card?.usage.invites}&nbsp;
                                <OverlayTrigger
                                  key={"right"}
                                  placement={"right"}
                                  overlay={
                                    <Tooltip id={`tooltip-right`}>
                                      Total number of friends who joined this
                                      card.
                                    </Tooltip>
                                  }
                                >
                                  <Button
                                    className="m-0 p-0"
                                    onClick={(e: any) => {
                                      e.preventDefault();
                                    }}
                                    variant="link"
                                  >
                                    <i className="bi bi-info-circle-fill text-muted"></i>
                                  </Button>
                                </OverlayTrigger>
                              </div>
                              <div className="fraindsImage">
                                {card?.members &&
                                  card?.members
                                    .slice(1)
                                    .slice(0, 3)
                                    .map((member: any, key: number) => (
                                      <span
                                        key={key}
                                        className="fraindsImage__card"
                                      >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={
                                            member.userId.profilePhoto ||
                                            userImage.src
                                          }
                                          className="img-fluid"
                                          alt="userImage"
                                        />
                                      </span>
                                    ))}
                              </div>
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <i className="bi bi-film"></i>&nbsp;Videos: &nbsp;
                            {card?.entries?.length || 0}&nbsp;
                            <OverlayTrigger
                              key={"right"}
                              placement={"right"}
                              overlay={
                                <Tooltip id={`tooltip-right`}>
                                  Total number of video entries found in card.
                                </Tooltip>
                              }
                            >
                              <Button
                                className="m-0 p-0"
                                onClick={(e: any) => {
                                  e.preventDefault();
                                }}
                                variant="link"
                              >
                                <i className="bi bi-info-circle-fill text-muted"></i>
                              </Button>
                            </OverlayTrigger>
                          </ListGroup.Item>
                        </ListGroup>
                        <Card.Footer className={"m-0 bg-transparent p-0"}>
                          <div className="d-grid">
                            <ButtonGroup aria-label="Basic example">
                              <Button
                                variant="secondary border-right-1"
                                href={`/cards/${card?.shortId}/customize`}
                              >
                                <i className="bi bi-pencil"></i>&nbsp;Edit Card
                              </Button>
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  setCard(card);
                                  setTimeout(() => {
                                    setShow(true);
                                  });
                                }}
                              >
                                <i className="bi bi-bar-chart"></i>
                                &nbsp;Engagement Tracker
                              </Button>
                            </ButtonGroup>
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Container>
          {cards?.length >= 9 && currentRecords?.length > 0 ? <Pagination 
          nPages={nPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage} 
          /> : null}
          
          <Modal
            show={showOder}
            onHide={() => setShowOder(false)}
            keyboard={false}
            animation={false}
            className="orderModel"
          >
            <Modal.Header closeButton>
              <Modal.Title>Order details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CardOrder cardData={oderData} />
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};

export default DashboardCardGrid;
