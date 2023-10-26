import { useState, ReactNode, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import styles from "./Adon.module.css";
import moment from "moment";
import http from "../../services/http.service";
import Recipient from "../MailCard/Recipient";
import OrderDetails from "../MailCard/OrderDetails";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { devLogError } from "../../helpers/logger";

const Icon1 = "/static/img/icons/icon1.png";

const Addons = ({
  cardData,
  glPlans,
  setShowBack,
  setUpgradeMembership,
  checkout,
}: any) => {
  const router = useRouter();
  const [isCheckout, setIsCheckout] = useState(false);
  const { watch, getValues, setValue, control } = useForm({
    defaultValues: {
      printShip: 0,
      years: 0,
      videos: 0,
      users: 0,
    },
  });
  const [page, setPage] = useState("recipient");
  const [showCard, setShowCard] = useState(false);
  const [showNext, setShowNext] = useState<any>("");
  const [newOrder, setNewOrder] = useState<any>(false);
  const [order, setOrder] = useState({
    orderId: "",
    name: "",
    addressLine: "",
    zip: "",
    city: "",
    country: "",
  });
  const [processDisable, setProcessDisable] = useState(false);

  const getShippingDetail = async () => {
    try {
      const res = await http.get("/order/orderDetailsByUser");
      const data = res.data.data;
      if (data) {
        setOrder({
          ...order,
          name: data.name,
          addressLine: data.addressLine,
          zip: data.zip,
          city: data.city,
          country: data.country,
        });
        setNewOrder(true);
      }
    } catch (error) {
      devLogError(error);
    }
  };

  useEffect(() => {
    if (checkout === "checkout") {
      setIsCheckout(true);
    }
    getShippingDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AddonCard = ({ pricingItem, title, price, unit, description }: any) => {
    return (
      <div className="row g-0 checkoutList">
        <div className="col-md-12">
          <div className="card-body mb-5 p-0">
            <h5
              className="card-title"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <h6
              className="card-subtitle text-muted mb-2"
              dangerouslySetInnerHTML={{ __html: price }}
            />
            <div
              className="card-text mb-3"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <div className="card-text">
              <Controller
                name={pricingItem}
                control={control}
                render={({ field: { onChange, value } }) =>
                  getValues(pricingItem) > 0 ? (
                    <InputGroup className="mb-3">
                      <Form.Control
                        value={value}
                        type="number"
                        onChange={onChange}
                      />
                      <div className="position-relative width-fit-content">
                        <div className="spinners">
                          <Button
                            className="spinner increment"
                            onClick={() =>
                              setValue(pricingItem, Number(value) + 1)
                            }
                          >
                            &#9650;
                          </Button>
                          <Button
                            className="spinner decrement"
                            onClick={() =>
                              setValue(pricingItem, Number(value) - 1)
                            }
                          >
                            &#9660;
                          </Button>
                        </div>
                        <InputGroup.Text id={pricingItem}>
                          {unit}
                        </InputGroup.Text>
                      </div>
                    </InputGroup>
                  ) : (
                    <Button
                      className="pt-2"
                      onClick={() => setValue(pricingItem, 1)}
                    >
                      {unit === "Years" && (
                        <>
                          <i className="bi bi-plus-lg"></i> Add time
                        </>
                      )}
                      {unit === "Friends" && (
                        <>
                          <i className="bi bi-plus-lg"></i> Add Videos
                        </>
                      )}
                    </Button>
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrderCard = (
    type: string,
    cardId: string,
    setPage: (value: string) => void,
    setOrder: (data: any) => void,
    order: any,
    newOrder: any,
    setNewOrder: any
  ): ReactNode => {
    let element = null;

    switch (type) {
      case "recipient":
        element = (
          <Recipient
            data={order}
            setOrder={setOrder}
            cardId={cardId}
            setShowNext={setShowNext}
            newOrder={newOrder}
            next={(data: any) => {
              setOrder(data);
              setPage("orderDetails");
              setShowBack("show");
            }}
          />
        );
        break;

      case "orderDetails":
        element = (
          <OrderDetails
            order={order}
            cardId={cardId}
            setShowNext={setShowNext}
            back={() => {
              setPage("recipient"), setShowBack("show");
              setNewOrder(false);
            }}
          />
        );
        break;
    }

    const handleAddon = () => {
      setIsCheckout(true);
      setShowBack("hide");
    };

    return (
      <>
        <div className="card py-3">
          <div className="row g-0">
            <div className="col-md-12">
              <div className="card-body">
                <div className="card-text">
                  {type === "recipient" && (
                    <div className={styles.orderDetailsList}>
                      <h5
                        className="card-title"
                        style={{
                          fontSize: "24px",
                          fontWeight: 600,
                          marginBottom: "30px",
                        }}
                      >
                        Print and ship: Mailing address{" "}
                      </h5>
                      <ul>
                        <li>
                          <h6>Shipping times:</h6>
                        </li>
                        <li></li>
                        <li>
                          <p>
                            <span>USA:</span> {`3-5 business days`}
                          </p>
                        </li>
                        <li>
                          <p>
                            <span>UK:</span> {`2-5 business days`}
                          </p>
                        </li>
                        <li>
                          <p>
                            <span>Germany:</span> {`1-2 business days`}
                          </p>
                        </li>
                        <li>
                          <p>
                            <span>Rest of Europe:</span> {`3-5 business days`}
                          </p>
                        </li>
                        <li>
                          <p>
                            <span>Australia:</span> {`5-7 business days`}
                          </p>
                        </li>
                        <li>
                          {" "}
                          <p>
                            <span>Rest of the World:</span>{" "}
                            {`up to 14 business days`}
                          </p>
                        </li>
                      </ul>
                    </div>
                  )}
                  {element}
                </div>
              </div>
            </div>
          </div>
        </div>

        {order?.price && showNext === "" && (
          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              type="submit"
              onClick={handleAddon}
              className="btn btn-next nextBtn"
            >
              Next
            </Button>
          </div>
        )}
      </>
    );
  };

  let printTotalPrice = 0;
  const handlePaidCheckout = async () => {
    let orderId = order.orderId;
    if (printTotalPrice === 0) {
      setProcessDisable(true);
      let orderData = {
        orderId: orderId,
        promoId: couponId?.promoId,
        price: printTotalPrice,
      };
      await http.put(`/order/updateOrderDiscountDetail`, {
        ...orderData,
      });
      if (setUpgradeMembership) {
        setUpgradeMembership(false);
      }
      setProcessDisable(false);
      setTimeout(() => {
        toast.success("Order is successfully created.");
      });
      router.push("/dashboard?payment_success=1");
    } else {
      let data;
      if (discountCode) {
        data = {
          printShip: getValues("printShip"),
          years: getValues("years"),
          users: getValues("users"),
          videos: getValues("videos"),
          cardId: cardData?._id,
          promoId: couponId.promoId,
        };
      } else {
        data = {
          printShip: getValues("printShip"),
          years: getValues("years"),
          users: getValues("users"),
          videos: getValues("videos"),
          cardId: cardData?._id,
        };
      }
      const res = await http.post(`/billing/purchase`, data);
      if (res) {
        setTimeout(() => (window.location.href = res.data.url));
      }
    }
  };

  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const [isMessage, setIsMessage] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [couponId, setCouponId] = useState({
    couponId: "",
    promoId: "",
  });

  const discountSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const res = await http.get(
        `users/discount/details?discountCode=${discountCode}`
      );
      if (res?.data?.success) {
        setCouponId({
          couponId: res.data.data.couponId,
          promoId: res.data.data.promoId,
        });
        setDisableButton(false);
        setDiscountType(res.data.data.discountType);
        setDiscountAmount(res.data.data.discountAmount);
        setIsMessage("");
      } else {
        setIsMessage(res.data.message);
      }
    } catch (error) {
      devLogError(error);
    }
  };

  const getTotal = () => {
    printTotalPrice = getValues("printShip") * glPlans.printShip.unitPrice;
    if (discountType === "Percentage") {
      printTotalPrice =
        printTotalPrice - (printTotalPrice * discountAmount) / 100;
    } else if (discountType === "Flat") {
      printTotalPrice = printTotalPrice - discountAmount;
    }
    if (printTotalPrice < 0) {
      return (printTotalPrice = 0);
    } else {
      return printTotalPrice + getValues("years") * glPlans.years.unitPrice;
    }
  };

  useEffect(() => {
    if (order.name !== "") {
      setValue("printShip", 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

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

  const handleBack = () => {
    setIsCheckout(false);
    setShowCard(false);
    setShowBack("show");
  };

  return (
    <>
      {!isCheckout &&
        !showCard &&
        OrderCard(
          page,
          cardData?._id,
          setPage,
          setOrder,
          order,
          newOrder,
          setNewOrder
        )}

      {glPlans && isCheckout && (
        <div className="card mb-3 p-4">
          <Row>
            <Col lg={7}>
              <AddonCard
                icon={Icon1}
                pricingItem="years"
                title="Extend duration"
                unit={"Years"}
                description={`Your greeting card videos are available until <strong>${moment(
                  cardData?.expiryAt
                )
                  .add(watch("years"), "y")
                  .format(
                    "LL"
                  )}</strong>.<br />Extend it to keep the memories alive.`}
                price={`$${glPlans.years.unitPrice} per year`}
              />
            </Col>

            <Col>
              <Card className="summaryCard">
                <Card.Header>
                  <h5 className="mb-0">Purchase Summary</h5>
                </Card.Header>
                <ListGroup variant={"flush"}>
                  {!showCard && (
                    <ListGroupItem>
                      <div className="d-flex gap-2 w-100 justify-content-between">
                        <div>Printing & Shipping</div>
                        <p className="text-nowrap mb-0">
                          ${watch("printShip") * glPlans.printShip.unitPrice}
                        </p>
                      </div>
                    </ListGroupItem>
                  )}
                  <ListGroupItem>
                    <div className="d-flex gap-2 w-100 justify-content-between">
                      <div>Extend duration</div>
                      <p className="text-nowrap mb-0">
                        ${watch("years") * glPlans.years.unitPrice}
                      </p>
                    </div>
                  </ListGroupItem>
                </ListGroup>
                <Card.Footer>
                  <div className="d-flex gap-2 w-100 justify-content-between">
                    <div>
                      <h6 className="mb-0">Total</h6>
                    </div>
                    <p className="text-nowrap mb-0">${getTotal().toFixed(2)}</p>
                  </div>
                </Card.Footer>
              </Card>
              <div className="d-grid mt-3">
                <Form className="mt-3">
                  <InputGroup
                    className="mb-3 gap-1 justify-content-between align-items-center"
                    style={{ flexWrap: "nowrap" }}
                  >
                    <Form.Label
                      className="mt-2"
                      style={{
                        fontSize: "14px",
                        lineHeight: "14px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Discount Code
                    </Form.Label>
                    <div className="d-flex gap-1 justify-content-between align-items-center">
                      <Form.Control
                        type="text"
                        placeholder=""
                        value={discountCode}
                        onChange={(e) => {
                          setIsMessage("");
                          setDiscountCode(e.target.value);
                        }}
                        disabled={!disableButton}
                        required
                      />
                      <Button
                        variant="primary"
                        style={{
                          background: "#a56d6d",
                          borderColor: "#a56d6d",
                        }}
                        onClick={(e) => discountSubmit(e)}
                        disabled={
                          getTotal() > 0 &&
                          discountCode.length > 0 &&
                          disableButton
                            ? false
                            : true
                        }
                      >
                        Apply
                      </Button>
                    </div>
                  </InputGroup>
                </Form>
              </div>
              {isMessage && <p className="text-danger">{isMessage}</p>}
              <div className="d-grid mt-3">
                <Button
                  onClick={handlePaidCheckout}
                  disabled={getTotal() === 0 && processDisable ? true : false}
                  variant="primary"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {checkout !== "checkout" && isCheckout && (
        <div className="backBtn">
          <Button onClick={handleBack}>Back</Button>
        </div>
      )}
    </>
  );
};

export default Addons;
