import AppLayout from "../components/layout/AppLayout";

const ReturnRefundPolicy = () => {
  return (
    <AppLayout>
      <main className="container py-5 px-3">
        <h1 className="text-center text-uppercase text-decoration-underline mb-5">
          Return and Refund Policy
        </h1>

        <p>
          Thank you for purchasing your greeting cards at GiftLips. We offer
          return and refunds on a limited basis under this Policy.
        </p>
        <p>The refunds are granted only for the following reasons.</p>
        <ol type="a" className="mb-5">
          <li>
            <p>
              If the services provided by GiftLips were defective or not up to
              the industry standards such as broken or torn greeting cards,
              provided that it was not damaged while in transit.
            </p>
          </li>
          <li>
            <p>
              If due to some technical problem or difficulty or there was a
              problem with the QR Code or any other technical issue, we are
              unable or unreasonably fails to deliver any of the greeting cards
              on the agreed delivery date.
            </p>
          </li>
        </ol>

        <h5 className="text-uppercase mb-3">How to Request a Refund</h5>
        <p>We allow refunds within 30 days from the date of your order:</p>
        <ol type="a">
          <li>
            <p>
              The Refunds can only be claimed for the products purchased from
              GiftLips’ website. Contact our e-mail support at{" "}
              <a href="mailto:info@giftlips.com">info@giftlips.com</a>
              to make arrangements for the return.
            </p>
          </li>
          <li>
            <p>
              If you received a physical product, ship the unopened product to
              the address provided by the GiftLips’ support team. Please note
              that the product must be returned in its original condition and
              packaging. The product must have no visible signs of use.
            </p>
          </li>
          <li>
            <p>
              A refund will be processed within 3-6 weeks of receipt of the
              product at our given address.{" "}
            </p>
          </li>
        </ol>
        <p className="mb-5">
          <i>
            Note: We reserve the right to limit returns on large-quantity orders
            or seasonal closeouts. Only regular priced products may be refunded,
            unfortunately sale products cannot be refunded.
          </i>
        </p>

        <h5 className="text-uppercase mb-3">Customer Responsibility</h5>
        <p>
          Returned products are your responsibility until they arrive at
          GiftLips.
        </p>
        <p>
          We recommend that you should use a carrier that offers shipment
          tracking for all returns for your protection and to also hold on to
          the proof of postage in case you need to contact us about your return.
          You are responsible for the cost of return tracking or postage.
        </p>
        <p className="mb-5">
          If we cannot locate your order number, we are unable to process the
          refund. Please be mindful of what is being sent to us as any products
          incorrectly sent back cannot be credited and will not be sent back to
          you.
        </p>

        <h5 className="text-uppercase mb-3">Refund Process</h5>
        <p className="mb-5">
          Once your return has been received and accepted, please allow 7 to 10
          business days for your return to be processed. If a refund is
          approved, a credit will automatically be applied to your credit card
          or original method of payment. This refund amount may take some time
          to show in your records, so before contacting us, please check with
          your credit card company, bank, or other payment services.
        </p>

        <h5 className="text-uppercase mb-3">Undeliverable Package</h5>
        <p className="mb-5">
          Undeliverable packages that are returned to us will not automatically
          be re-shipped and will result in order cancellation. You will get a
          refund for the total of the merchandise. Please note that the shipping
          costs you paid will be deducted from the total refund.
        </p>

        <h5 className="text-uppercase mb-3">Received Damaged Item</h5>
        <p>
          You will be awarded a full refund if you have received a damaged
          product due to the fault of GiftLips.
        </p>
        <p>
          GiftLips shall not be liable if the damage or loss is due to the
          shipping partner’s fault or due to causes beyond the control of
          GiftLips.
        </p>
        <p>Additional information:</p>
        <ul className="mb-5">
          <li>
            <p>
              We will not be responsible for returns that are lost or damaged in
              transit.
            </p>
          </li>
          <li>
            <p>
              If we find the product has not been returned to us in a fully
              resealable condition, inclusive of full packaging, we reserve the
              right to refuse a refund on the product.
            </p>
          </li>
        </ul>

        <h5 className="text-uppercase mb-3">Third-party Retailers</h5>
        <p className="mb-5">
          We do not provide refunds or exchanges for products purchased outside
          of GiftLips. You must abide by the return and exchange policies set in
          place by the retailer you have made your purchase with. Please contact
          the retailer in question for more details.
        </p>

        <h5 className="text-uppercase mb-3">Fair Use</h5>
        <p>
          If we notice an abnormal pattern of return activity or behaviour then
          we may connect with you about your returns.
        </p>
        <p>
          Any abuse of the return policy can result in the suspension of the
          account and any associated accounts. If this has happened to you, and
          you think we’ve made a mistake, please contact our customer support
          team and we’ll be happy to review it with you. If your account has
          been suspended and you need to make a return, please contact our
          customer support team team before sending any products back.
        </p>
        <p className="mb-5">
          GiftLips maintains the right to determine, in its sole and absolute
          discretion, whether you are entitled to a refund and, if so, the
          amount of the refund you are eligible to receive. GiftLips reserves
          the right, in its sole and absolute discretion, to refuse to provide a
          refund or accept your Order for any reason – including, but not
          limited to, if we deem your Order to be suspicious or fraudulent in
          any way.
        </p>

        <h5 className="text-uppercase mb-3">Contact Us</h5>
        <p className="mb-5">
          If you have any inquiries, make sure to contact us through the
          following email:{" "}
          <a href="mailto:info@giftlips.com">info@giftlips.com</a>.
        </p>
      </main>
    </AppLayout>
  );
};

export default ReturnRefundPolicy;
