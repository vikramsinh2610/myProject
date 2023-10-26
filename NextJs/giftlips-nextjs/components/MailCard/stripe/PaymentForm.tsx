import { CardElement, CardElementProps, useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from 'react'
import http from "../../../services/http.service"
import styles from "./Stripe.module.css";

const CARD_OPTIONS: any = {
    iconStyle: "solid",
    style: {
        base: {
            iconColor: "red",
            color: "blue",
            fontWeight: 500,
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            ":-webkit-autofill": { color: "#fce883" },
            "::placeholder": { color: "#87bbfd" }
        },
        invalid: {
            iconColor: "green",
            color: "black"
        },

    }
}

export interface IProps {
    orderId: string;
    order: any;
}

export default function PaymentForm(props: IProps) {
    const [success, setSuccess] = useState(false)
    const stripe: any = useStripe()
    const elements = useElements()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements?.getElement(CardElement)
        })

        if (!error) {
            try {
                const { id } = paymentMethod
                const auth = await http.get("/order/postCardAuth")
                console.log(auth.data.data.auth_token, "auth data")
                const response = await http.post("/order/postCardPlaceOrder", {
                    authToken: auth.data.data.auth_token,
                    orderId: props.orderId
                })

                if (response.data.data.success) {
                    setSuccess(true);
                }

            } catch (error) {
                console.log("Error", error)
            }
        } else {
            console.log(error.message)
        }
    }

    return (
        <>
            {!success ?
                <form onSubmit={handleSubmit}>
                    <fieldset className="stripe-group">
                        <div className="stripe-row">
                            <CardElement options={CARD_OPTIONS} />
                        </div>
                    </fieldset>
                    <br />
                    <button className={styles.stripeButton}>Pay</button>
                </form>
                :
                <div>
                    {/* <h2>You just bought a sweet spatula congrats this is the best decision of you're life</h2> */}
                    <h5 className="text-center">Hey <span className="text-danger">{props?.order?.name.charAt(0).toUpperCase() + props?.order?.name.slice(1)}</span> , This is a confirmation message that we’ve received your payment. Best wishes.</h5>
                    <h2 className="text-center text-success">Thank You</h2>
                </div>
            }
        </>
    )
}
