import * as React from "react";
import Button from "react-bootstrap/Button";
import StripeContainer from "./stripe/StripeContainer";
import styles from "./orderDetails.module.css";

interface IAppProps {
  order: any;
  cardId: string;
  setShowNext: any;
  back: () => void;
}

export default function OrderDetails(props: IAppProps): any {
  const [pay, setPay] = React.useState<boolean>(false);

  return (
    <div>
      {pay ? (
        <StripeContainer order={props.order} orderId={props?.order.orderId} />
      ) : (
        <div className={styles.orderDetailsList}>
          <Button
            className="customizeBackButton lightButton"
            onClick={() => {
              props.back(), props.setShowNext("hide");
            }}
          >
            Back
          </Button>
          <h2 className="text-center mb-5">Shipping details</h2>
          <div className="row">
            <div className="col-md-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={props?.order?.url !== "" ? props?.order?.url : ""}
                alt="url"
                height="350px"
                width="100%"
              />
            </div>
            <div className="col-md-6">
              <h5 className="mb-3">Confirm mailing address</h5>
              <p>
                <span>Name :</span>{" "}
                {props?.order?.name.charAt(0).toUpperCase() +
                  props?.order?.name.slice(1)}
              </p>
              <p>
                <span>Address :</span>{" "}
                {props?.order?.addressLine.charAt(0).toUpperCase() +
                  props?.order?.addressLine.slice(1)}
              </p>
              <p>
                <span>City :</span>{" "}
                {props?.order?.city.charAt(0).toUpperCase() +
                  props?.order?.city.slice(1)}
              </p>
              <p>
                <span>Zip :</span> {props?.order?.zip}
              </p>
              <p>
                <span>Country :</span>{" "}
                {props?.order?.country.charAt(0).toUpperCase() +
                  props?.order?.country.slice(1)}
              </p>
              <div className="mt-5">
                <Button
                  className="w-100"
                  variant="secondary"
                  type="submit"
                  onClick={() => {
                    props.back(), props.setShowNext("hide");
                  }}
                >
                  Edit mailing address
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
