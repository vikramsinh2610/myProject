import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import http from "../../services/http.service";
import { countryList } from "./country";
import styles from "../Addons/Adon.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export interface IAppProps {
  cardId: string;
  next: (data: any) => void;
  data: any;
  setShowNext: any;
  newOrder:any;
  setOrder:any
}

export default function Recipient(props: IAppProps) {
  const session: any = useSession();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const submit = async (event: any) => {
    event.preventDefault();

    if (session.status === "authenticated") {
      localStorage.setItem("user", JSON.stringify(session.data));
    }

    const confirm = window.confirm(
      "Please note, when we print and ship your greeting card we can not change the address anymore."
    );

    if (confirm) {
      let response = null;
      if (props?.data?.name === "" || props?.newOrder) {
        try {
        response = await http.post(`/order`, {
          orderId: props?.data?.orderId,
          name: event?.target?.name?.value,
          addressLine: event?.target?.addressLine?.value,
          city: event?.target?.city?.value,
          zip: event?.target?.zip?.value,
          country: event?.target?.country?.value,
          cardId: props.cardId,
          // @ts-ignore
          userId: session?.data?.user?.id || 0,
        });
      } catch (e: any) {
          toast.error("You are not owner of this card", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } else {
        response = await http.put(`/order/updateOrder`, {
          orderId: props.data.orderId,
          name: event.target.name.value,
          addressLine: event.target.addressLine.value,
          city: event.target.city.value,
          zip: event.target.zip.value,
          country: event.target.country.value,
          cardId: props.cardId,
          userId: session?.data?.user?.id || 0,
        });
        props.setShowNext("");
      }

      localStorage.setItem("OrderId", response?.data?.data?._id);

      if (response) {
        props.next({
          name: event.target.name.value,
          addressLine: event.target.addressLine.value,
          city: event.target.city.value,
          zip: event.target.zip.value,
          country: event.target.country.value,
          orderId: response.data.data._id,
          price: response.data.data.price,
          url: response.data.data.url,
        });
      }
    } else {
      return;
    }
  };

  return (
    <>
      <h2 className="mb-4 text-center">Shipping details</h2>
      <div className={styles.orderDetailsList}>
        <h5 className="mb-3">Mailing address</h5>
      </div>

      <ToastContainer />

      <Form onSubmit={submit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            defaultValue={props?.data?.name}
            type="text"
            placeholder="Enter Name"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="addressLine">
          <Form.Label>Address</Form.Label>
          <Form.Control
            defaultValue={props?.data?.addressLine}
            as="textarea"
            rows={3}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            defaultValue={props?.data?.city}
            type="text"
            placeholder="Enter Name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="zip">
          <Form.Label>Zip</Form.Label>
          <Form.Control
            defaultValue={props?.data?.zip}
            type="number"
            placeholder="Enter Name"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Select
            required
            as="select"
            defaultValue={props?.data?.country}
            value={props?.data?.country || "United States of America"}
            onChange={e => {
                props.setOrder({
                  ...props.data,
                  country: e.target.value
                })
            }}
          >
            {countryList.map((value: string) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <br />

        <Button className="w-100" variant="primary" type="submit" disabled={!props?.data}>
          Save Details
        </Button>
      </Form>
    </>
  );
}
