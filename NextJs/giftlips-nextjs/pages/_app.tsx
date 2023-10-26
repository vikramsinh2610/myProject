import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import { useEffect, useState } from "react";
import { Button, Modal, SSRProvider } from "react-bootstrap";
import "../styles/globals.scss";
import "../assets/sass/style.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  UserContext,
  ModalContext,
  PageProgressContext,
} from "../context/contextLib";
import http from "../services/http.service";
import AuthForm from "../components/AuthForm/AuthForm";
import CardDownload from "../components/CardDownload/CardDownload";
import UserInvitation from "../components/UserInvitation/UserInvitation";
import Addons from "../components/Addons/Addons";
import { useRouter } from "next/router";
import { devLogError } from "../helpers/logger";
import LoadingBar from "react-top-loading-bar";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { NextIntlProvider } from "next-intl";

const App = ({ Component, pageProps: { session, ...pageProps } }: any) => {
  const router = useRouter();
  const { key }: any = router.query;
  const [pageProgress, setPageProgress] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showInviteFriendsModal, setShowInviteFriendsModal] = useState(false);
  const [isShowDownloadCardModal, setIsShowDownloadCardModal] = useState(false);
  const [glPlans, setGlPlans] = useState<any>(null);
  const [savedCardId, setSavedCardId] = useState<any>(null);
  const [savedCard, setSavedCard] = useState<any>(null);

  const unguardedRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/password-reset",
    "/cards/[id]",
  ];

  const getPlans = async () => {
    try {
      const res = await http.get("/billing/plans");
      setGlPlans(res.data);
    } catch (e: any) {
      devLogError(e);
    }
  };

  useEffect(() => {
    void getPlans();
  }, []);

  useEffect(() => {
    const handleStart = () => setPageProgress(30);
    const handleStop = () => setPageProgress(100);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  const onAuthSuccess = async () => {
    if (savedCardId) {
      await http.post(`/cards/${savedCardId}/claim`, {});
      setSavedCardId(null);
    }
    setShowAuthModal(false);
    if (localStorage.getItem("Inviteduser")) {
      let response = await http.get(`/card-invites/${key}/getCardDetails`);
      router.push(
        `/cards/${response?.data?.message?.cardId?.shortId}/customize`
      );
    }
  };

  return (
    <SSRProvider>
      {/* <NextIntlProvider messages={pageProps.messages}> */}

      <Head>
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/favicon.ico`}
        />
      </Head>

      <PageProgressContext.Provider value={{ pageProgress, setPageProgress }}>
        <LoadingBar
          color="#f11946"
          progress={pageProgress}
          onLoaderFinished={() => setPageProgress(0)}
          className="pt-1"
        />

        <SessionProvider session={session}>
          <ModalContext.Provider
            value={{
              showAuthModal,
              setShowAuthModal,
              showUpgradeModal,
              setShowUpgradeModal,
              isShowDownloadCardModal,
              setIsShowDownloadCardModal,
              showInviteFriendsModal,
              setShowInviteFriendsModal,
            }}
          >
            <Modal
              show={showAuthModal}
              onHide={() => setShowAuthModal(false)}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header className="border-0" closeButton></Modal.Header>
              <Modal.Body>
                <AuthForm onParentSave={onAuthSuccess} />
              </Modal.Body>
            </Modal>

            <Modal
              show={showUpgradeModal}
              onHide={() => setShowUpgradeModal(false)}
              backdrop="static"
              size={"lg"}
              keyboard={false}
            >
              <Modal.Header className="border-0" closeButton></Modal.Header>
              <Modal.Body>
                <Addons
                  cardData={savedCard}
                  glPlans={glPlans}
                  checkout={"checkout"}
                />
              </Modal.Body>
            </Modal>

            <Modal
              show={isShowDownloadCardModal}
              onHide={() => setIsShowDownloadCardModal(false)}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header className="border-0" closeButton></Modal.Header>
              <Modal.Body>
                <h3 className="text-center fw-semibold display-7 mb-3">
                  Save and print your video
                  <div className="d-inline text-gl-primary"> greeting card</div>
                </h3>
                <CardDownload
                  onExit={() => {
                    setIsShowDownloadCardModal(false);
                    router.push("/dashboard");
                  }}
                  cardData={savedCard}
                />
              </Modal.Body>
            </Modal>

            <Modal
              show={showInviteFriendsModal}
              onHide={() => {
                setShowInviteFriendsModal(false);
                setSavedCard(null);
              }}
            >
              <Modal.Header className="border-0" closeButton></Modal.Header>
              <Modal.Body>
                <UserInvitation
                  token={savedCard?.shortId}
                  cardThumbnail={savedCard?.template.coverUrl}
                ></UserInvitation>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowInviteFriendsModal(false);
                    setTimeout(() => {
                      setIsShowDownloadCardModal(true);
                    });
                  }}
                >
                  Download Card
                </Button>
              </Modal.Footer>
            </Modal>

            <UserContext.Provider
              value={{
                savedCardId,
                savedCard,
                setSavedCardId,
                setSavedCard,
                glPlans,
              }}
            >
              <Component {...pageProps} />
            </UserContext.Provider>
          </ModalContext.Provider>
        </SessionProvider>
        <ToastContainer position="top-right" autoClose={2000} theme="light" />
      </PageProgressContext.Provider>
      {/* </NextIntlProvider> */}

      {process.env.NEXT_PUBLIC_ENV === "production" &&
        router.pathname !== "/cards/[id]" && (
          <>
            <Script id="helpscout" strategy="afterInteractive">
              {`
                !function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});
                window.Beacon('init', '48cd8f1e-7e00-4cf0-b644-1c85244fd235')
              `}
            </Script>
          </>
        )}

      {process.env.NEXT_PUBLIC_ENV === "production" &&
        !unguardedRoutes.includes(router.pathname) && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-HM0FLH7D8L"
              strategy="afterInteractive"
            />

            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-HM0FLH7D8L');
              `}
            </Script>

            <Script id="hotjar" strategy="afterInteractive">
              {`
                (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:3198151,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `}
            </Script>
          </>
        )}
    </SSRProvider>
  );
};

export default App;
