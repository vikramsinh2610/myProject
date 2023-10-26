import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import AppLayout from "../../../components/layout/AppLayout";
import { useModalContext } from "../../../context/contextLib";
import http from "../../../services/http.service";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";

const InviteOthers = () => {
  const router = useRouter();
  const session = useSession();
  const { key }: any = router.query;
  const [invitedData, setInvitedData] = useState<any>();
  const [oldcode, setoldcode] = useState();
  const { setShowAuthModal }: any = useModalContext();
  const uniqueCode = uuidv4()
  

  useEffect(() => {
    cardDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
   let code: any = localStorage.getItem("uniqueCode")
   setoldcode(code)
  }, []);

  const cardDetails = async () => {
    try {
      if (key) {
        let response = await http.get(`/card-invites/${key}/getCardDetails`);
        setInvitedData(response?.data?.message);
        localStorage.setItem(
          "Inviteduser",
          JSON.stringify(response?.data?.message?.inviter)
        );
        localStorage.setItem("coverurl",response?.data?.message?.cardId?.coverUrl)
        localStorage.setItem("title",response?.data?.message?.cardId?.title)
      }
    } catch (e: any) {
      console.log("error", e.response);
    }
  };

  const handleAddVideo = () => {
    router.push(`/cards/${invitedData?.cardId?.shortId}/customize`);
    if(session.status === "unauthenticated" && oldcode === '' || oldcode === null){
      localStorage.setItem("uniqueCode",uniqueCode)
    }
  };

  return (
    <AppLayout seo={{ noindex: true }}>
      <Container>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="inviteCard">
              <p>
                You have been invited to add a personal video (or vocal) message
                to the group card:
              </p>

              <h5 className="inviteCard__title">
                {invitedData?.cardId?.title} created by {invitedData?.name}
              </h5>

              {session?.status === "authenticated" && (
                <>
                  <p>You will be able to watch all videos others
                    have already added:
                  </p>
                </>
              )}

              {session?.status === "unauthenticated" && (
                <>
                  <p>
                    If you sign up, you will be able to watch all videos others
                    have already added:
                  </p>

                  <div className="inviteCard__btn">
                    <Button
                      className="redBtn"
                      onClick={() => setShowAuthModal(true)}
                    >
                      Sign in & add video
                    </Button>
                  </div>

                  <p>
                    Or you can add your video without signing in but you will
                    not be able to watch the other videos:
                  </p>
                </>
              )}

              <div className="inviteCard__btn">
                <Button
                  className="greenBtn greenBtn--border"
                  onClick={handleAddVideo}
                >
                  Add your video
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default InviteOthers;
