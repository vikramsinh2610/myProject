import { Suspense, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useModalContext } from "../../../context/contextLib";
import AppLayout from "../../../components/layout/AppLayout";
import { useRouter } from "next/router";
import http from "../../../services/http.service";
import { useSession } from "next-auth/react";
import styles from "./acceptInvite.module.css";
import { NextSeo } from "next-seo";

const AcceptInvitation = () => {
  const { showAuthModal, setShowAuthModal }: any = useModalContext();
  const session = useSession();
  const router = useRouter();
  const { key }: any = router.query;

  const [cardImageUrl, setCardimageUrl] = useState("");
  const [invite, setInvite] = useState<any>("");
  const [cardID, setCardID] = useState<any>("");

  useEffect(() => {
    cardDetails();
  }, [key, session.status, showAuthModal]);

  const cardDetails = async () => {
    try {
      if (key) {
        let response = await http.get(`/card-invites/${key}/getCardDetails`);
        setCardimageUrl(response?.data?.message?.cardId?.assets[0]?.url);
        setCardID(response?.data?.message?.cardId?._id);
      }
    } catch (e: any) {
      console.log("error", e.response);
    }
  };

  const acceptInvite = async () => {
    try {
      let response = await http.post(`/card-invites/${key}/acceptInvite`);
      setInvite(response?.data);
      if (response?.data?.success === true) {
        router.push(`/cards/${cardID}/join`);
      }
    } catch (e: any) {
      setInvite(e.response?.data);
    }
  };

  const declineInvite = async () => {
    try {
      let response = await http.delete(`/card-invites/${key}`);
      setInvite(response?.data);
      if (response?.data?.success === true) {
        router.push("/dashboard");
      }
    } catch (e: any) {
      setInvite(e.response?.data);
    }
  };

  const InviteButton = () => {
    if (session.status !== "authenticated") {
      return (
        <>
          <Button
            variant="warning"
            className="1"
            disabled={invite && invite?.success ? true : false}
            onClick={() => {
              setShowAuthModal(true);
            }}
          >
            <i className="bi bi-lock"></i>
            {invite && invite?.success ? "Accepted" : "Accept Invitation"}
          </Button>
          <Button
            variant="warning"
            className="1"
            onClick={() => {
              setShowAuthModal(true);
            }}
          >
            <i className="bi bi-lock"></i> Decline Invitation
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button
            variant="warning"
            className="1"
            disabled={invite && invite?.success ? true : false}
            onClick={acceptInvite}
          >
            <i className="bi bi-lock"></i>
            {invite && invite?.success ? "Accepted" : "Accept Invitation"}
          </Button>
          <Button variant="warning" className="1" onClick={declineInvite}>
            <i className="bi bi-lock"></i> Decline Invitation
          </Button>
        </>
      );
    }
  };
  return (
    <AppLayout>
      <NextSeo noindex={true} />

      <div className="CardEditPage">
        <div
          className={`text-center border p-4 my-4 rounded ${styles.invitationBlock}`}
        >
          <h3 className="mb-3 border-bottom pb-3 mb-4">
            Accept <b>Card Invitation</b>
          </h3>
          {session.status === "authenticated" && (
            <Suspense fallback={<div />}>
              <img
                className="mb-4"
                alt="Thumbnail URL"
                src={cardImageUrl}
                decoding="async"
                data-nimg="1"
                loading="lazy"
                style={{ color: "transparent", width: "100%" }}
              />
            </Suspense>
          )}
          <div className="d-flex justify-content-center gap-2">
            <InviteButton />
          </div>
          <div className="text-center">
            {invite && !invite?.success && (
              <span className="mb-1 mt-4 alert alert-warning d-flex justify-content-center">
                {invite?.message}{" "}
              </span>
            )}
            {invite && invite?.success && (
              <span className="mb-1 mt-4 alert alert-success d-flex justify-content-center">
                {invite?.message}{" "}
              </span>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AcceptInvitation;
