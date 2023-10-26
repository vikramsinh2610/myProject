import { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import http from "../services/http.service";
import FAQ from "../components/FAQ/FAQ";
import DashboardHero from "../components/Hero/DashboardHero";
import { useRouter } from "next/router";
import AppLayout from "../components/layout/AppLayout";
import DashboardCardGrid from "../components/CardGrid/DashboardCardGrid";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { devLogError } from "../helpers/logger";
import { Alert, Button,  Modal } from "react-bootstrap";
import success from "../assets/img/svg/check-circle-solid.svg";
import Image from "next/image";
import GroupCardGrid from "../components/CardGrid/GroupCardGrid";

const Dashboard = () => {
  const router = useRouter();
  const session = useSession();
  if (session.status === "unauthenticated") {
    router.replace("/");
  }
  const [showInvite, setShowInvite] = useState(false);
  const [cardData, setCardData] = useState<any[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [collaboratorCards, setCollaboratorCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = collaboratorCards.slice(indexOfFirstRecord, indexOfLastRecord);
  const [nPages, setNPages] = useState<number>(1);
  const [activeTab, setActiveTab] = useState(1);
  const [isPrintship, setIsPrintship] = useState(false);

  const [filters, setFilters] = useState<any>({
    limit: 1000,
    offset: 0,
    currentPage: 1,
    total: 0,
  });

  useEffect(() => {
    setNPages(Math.ceil(collaboratorCards.length / recordsPerPage));
}, [ activeTab ]);

  const getCards = async () => {
    try {
      setIsLoadingCards(true);

      let response = await http.get(
        `/cards/?${new URLSearchParams({
          limit: filters.limit,
          offset: filters.offset,
        })}`
      );

      if (response.data?.docs.length > 0) {
        setCardData(response.data.docs);
        setFilters((beforeVal: any) => {
          return { ...beforeVal, total: response.data.totalDocs };
        });
      }
    } catch (error: any) {
      devLogError(error);
    } finally {
      setIsLoadingCards(false);
      setProgress(100);
    }
  };

  const handleCloseSuccess = () => {
    setShowInvite(false);
    router.replace("/dashboard");
  };

  const getCollaboratorCards = async () => {
    let userId: any;
    let user: any = localStorage.getItem("user");
    userId = JSON.parse(user);
    try {
      let response: any = await http.get(`/entries/${userId?.user?.id}/entrybyuser`);
   
      let data: any = response?.data?.data.filter(
        (item: any) => item?.cardId?.userId !== userId?.user?.id
      );
  
      setCollaboratorCards(data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    setProgress(30);
    void getCards();
    void getCollaboratorCards();
    if(router?.pathname === "/dashboard"){
      localStorage.removeItem("Inviteduser");
    }
  }, []);

  useEffect(() => {
    if (router?.query?.payment_success === "1") {
      setShowInvite(true);
    }
  }, [router?.query?.payment_success]);

  return (
    <AppLayout>
      <NextSeo noindex={true} />

      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="pt-1"
      />

      <DashboardHero />
      <Modal className="cardsModel successModel" show={showInvite}>
        <i className="bi bi-x" onClick={handleCloseSuccess}></i>
        <Image
          src={success}
          alt="success"
          style={{ height: "65px", width: "65px", margin: "0 auto 20px" }}
        />
        <Modal.Title>Your payment is successful!</Modal.Title>
      </Modal>

      <div className="container">
        {!isPrintship ?  <div className="cardsTab">
          <Button
            className={activeTab === 1 ? "activeTab" : ""}
            onClick={() => {
              setActiveTab(1)
            }}
          >
            My Cards
          </Button>{" "}
          <Button
            className={activeTab === 2 ? "activeTab" : ""}
            onClick={() => {
              setActiveTab(2)
            }}
          >
            Group Cards
          </Button>
        </div> : null }
       

        <div>
          {activeTab !== 1 ? (
            <></>
          ) : (
            <DashboardCardGrid
              className="bg-light"
              cards={cardData}
              isLoadingCards={isLoadingCards}
              currentUser={session.data}
              onClick={(card: any) => {
                router.push(`/cards/${card.shortId}/customize`);
                localStorage.removeItem("Inviteduser");
              }}
              setIsPrintship={setIsPrintship}
            />
          )}
          {currentRecords.length > 0 ? (
            activeTab !== 2  ? (
              <></>
            ) : (
              <GroupCardGrid
              collaboratorCards={collaboratorCards}
              currentRecords={currentRecords}
              nPages ={nPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              />
            )
          ) :  activeTab !== 2 ? (
            <></>
          ) : (
            <Alert variant="info" className="my-5">
              No cards found.
            </Alert>
          )}
        </div>
      </div>
      
      <FAQ />
    </AppLayout>
  );
};

export default Dashboard;
