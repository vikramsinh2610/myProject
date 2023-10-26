import React, { useState, ReactNode } from "react";
import { Button } from "react-bootstrap";
import Model from "./Modal";
import OrderDetails from "./OrderDetails";
import Recipient from "./Recipient";

export interface IAppProps {
  userId: string;
  cardId: string;
  newOrder:any
}

const setShowNext: any = "";

const getModel = (
  type: string,
  cardId: string,
  setPage: (value: string) => void,
  setOrder: (data: any) => void,
  order: any,
  newOrder:any

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
          back={() => setPage("recipient")}
        />
      );
      break;
  }
  return element;
};

export default function MailCard(props: IAppProps) {
  const [show, setShow] = useState(false);
  const [page, setPage] = useState("recipient");
  const [order, setOrder] = useState({
    name: "",
    addressLine: "",
    zip: "",
    city: "",
    country: "",
  });

  return (
    <div>
      <Model
        show={show}
        onClose={() => {
          setShow(false),
            setPage("recipient"),
            setOrder({
              name: "",
              addressLine: "",
              zip: "",
              city: "",
              country: "",
            });
        }}
        heading="Mail Card"
      >
        {getModel(page, props.cardId, setPage, setOrder, order, props.newOrder)}
      </Model>
      <Button
        variant="warning"
        onClick={() => {
          setShow(true);
        }}
        className={"w-100"}
      >
        <i className="bi bi-lock"></i> Mail Card
      </Button>
    </div>
  );
}
