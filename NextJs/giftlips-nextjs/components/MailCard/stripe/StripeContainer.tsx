import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import PaymentForm from "./PaymentForm"

const PUBLIC_KEY = "pk_test_51LwJZuK55Pm2a0gIYmIwu3ektxzPz2vhWXymewTFf91giggiFMFDWEiU4ZysKyjLpklQ3GuF8Hv2l6sNCHTqMiw200W88XkrRI"

const stripeTestPromise = loadStripe(PUBLIC_KEY)

export interface IProps {
    orderId: string;
	order: any;
  }

export default function StripeContainer(props : IProps) {
	return (
		<Elements stripe={stripeTestPromise}>
			<PaymentForm order={props.order} orderId={props.orderId} />
		</Elements>
	)
}
