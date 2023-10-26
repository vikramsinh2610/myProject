import { useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import LoadingBar from "react-top-loading-bar";
import FAQ from "../components/FAQ/FAQ";
import Hero from "../components/Hero/Hero";
import CardCategoryFilter from "../components/CardCategoryFilter/CardCategoryFilter";
import CardGrid from "../components/CardGrid/CardGrid";
import http from "../services/http.service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { draggableHorizontal } from "../helpers/common";
import AppLayout from "../components/layout/AppLayout";
import useGoogleIdentify from "../hooks/useGoogleIdentify";
import { devLog } from "../helpers/logger";
import { NextSeo } from "next-seo";
import useWindowDimensions from "../hooks/useWindowDimensions";
const Home = () => {
  const router = useRouter();
  const { page, category } = router.query;
  const session = useSession();
  const [progress, setProgress] = useState(30);
  const [templates, setTemplates] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState();
  const [nPages, setNPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageLImit, setPageLimit] = useState<number>();
  const { width }: any = useWindowDimensions();
  useEffect(() => {
    if (width <= 500) {
      setPageLimit(8);
    } else {
      setPageLimit(20);
    }
  }, [width]);
  useEffect(() => {
    if (session.data) {
      localStorage.setItem("user", JSON.stringify(session.data));
    }
  }, [session]);
  const nextAuthOpt = {
    redirect: false,
  };
  const googleOpt = {
    prompt_parent_id: "oneTap",
    isOneTap: true,
  };
  const { isSignedIn } = useGoogleIdentify({
    nextAuthOpt,
    googleOpt,
  });
  const getTemplates = async () => {
    setIsLoading(true);
    let url = `/public/templates?page=${page || 1}&limit=${pageLImit}`;
    if (category) {
      url += `&category=${category}`;
    }
    try {
      let response = await http.get(url);
      setTemplates(response?.data);
      setNPages(response?.data?.totalPages);
      setCurrentPage(response?.data?.page);
      setIsLoading(false);
    } catch (e: any) {
      devLog(e);
      setIsLoading(false);
    }
  };
  const searchTemplates = async (e: any) => {
    let url;
    if (e.target.value === "") {
      url = `/public/templates?page=${page || 1}&limit=${pageLImit}`;
      if (category) {
        url += `&category=${category}`;
      }
      setTemplates("");
    } else {
      let template_title =
        e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
      url = `/public/templates?page=${page || 1
        }&search=${template_title}&limit=${pageLImit}`;
    }
    try {
      let response = await http.get(url);
      setTemplates(response.data);
      setNPages(response?.data?.totalPages);
      setCurrentPage(response?.data?.page);
      setIsLoading(false);
    } catch (e: any) {
      devLog(e);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    void getTemplates();
    setProgress(100);
    draggableHorizontal(
      ".categories-buttons-container .draggable-horizontal-scroll"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, pageLImit]);
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);
  const nextPage = () => {
    setCurrentPage(templates?.nextPage);
    if (category) {
      router.push(`/?page=${templates?.nextPage}&category=${category}`);
    } else {
      router.push(`/?page=${templates?.nextPage}`);
    }
  };
  const prevPage = () => {
    setCurrentPage(templates?.prevPage);
    if (category) {
      router.push(`/?page=${templates?.prevPage}&category=${category}`);
    } else {
      router.push(`/?page=${templates?.prevPage}`);
    }
  };
  const onClickCurrent = (cpage: any) => {
    setCurrentPage(cpage);
    if (category) {
      router.push(`/?page=${cpage}&category=${category}`);
    } else {
      router.push(`/?page=${cpage}`);
    }
  };
  return (
    <AppLayout>
      <NextSeo
        noindex={process.env.NEXT_PUBLIC_ENV !== "production"}
        title="Make Someone's Day with GiftLips Video Greeting Cards!"
        description="Looking for the perfect way to send wishes? Our printed video greeting cards offer a wide selection of ecards, birthday wishes, funny cards and more! Personalize your message and make your loved ones feel special. Order today!"
        additionalMetaTags={[
          {
            property: "keywords",
            content:
              "video greeting card, wishes, ecards, birthday wishes, anniversary, funny cards",
          },
        ]}
      />
      <LoadingBar
        color="#F11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="pt-1"
      />
      {!isSignedIn && (
        <div
          id="oneTap"
          style={{ position: "fixed", right: "0", zIndex: "1" }}
        />
      )}
      <Hero />
      <div className="container">
        <div
          id="template-filter"
        >
          <div className="filterSearchBox">
            <div className="input-group rounded">
              <input
                type="search"
                className="form-control rounded"
                placeholder="Search events"
                aria-label="Search"
                aria-describedby="search-addon"
                onChange={(e) => searchTemplates(e)}
              />
              <span className="input-group-text border-0" id="search-addon">
                <i className="bi bi-search"></i>
              </span>
            </div>
          </div>
          <CardCategoryFilter
            currentFilter={category}
            onClick={(selected: any) => {
              devLog(selected);
              if (selected.id !== "all") {
                router.push(`/?page=1&category=${selected.id}#template-filter`);
              } else {
                router.push(`/?page=1#template-filter`);
              }
            }}
          />
        </div>
      </div>
      {templates && templates?.docs?.length > 0 && (
        <CardGrid templates={templates.docs} isLoading={isLoading} />
      )}
      {templates && templates?.docs?.length === 0 && (
        <Container className="my-5">
          <Alert variant="info">No template found.</Alert>
        </Container>
      )}
      {templates && !isLoading && nPages > 1 ? (
        <Container>
          <Row className="justify-content-md-center pb-4 text-center">
            <Col lg={12}>
              <nav>
                <ul className="pagination justify-content-end">
                  {templates.hasPrevPage && (
                    <button
                      className="d-flex gap-2 justify-content-center align-items-center bg-white text-danger border-0"
                      style={{
                        fontSize: "18px",
                        lineHeight: "18px",
                      }}
                      onClick={prevPage}
                    >
                      <i
                        className="bi bi-arrow-left text-danger"
                        style={{ fontSize: "18px", lineHeight: "18px" }}
                      />
                      Previous
                    </button>
                  )}
                  {pageNumbers.map((pgNumber) => (
                    <li
                      key={pgNumber}
                      className={`page-item ${currentPage == pgNumber ? "active" : ""
                        } `}
                    >
                      <a
                        onClick={() => onClickCurrent(pgNumber)}
                        className={`page-link text-darkGreen ${currentPage == pgNumber
                            ? "bg-darkGreen border-darkGreen text-white"
                            : ""
                          } `}
                        href="#"
                      >
                        {pgNumber}
                      </a>
                    </li>
                  ))}
                  {templates.hasNextPage && (
                    <button
                      className="d-flex gap-2 justify-content-center align-items-center bg-white text-danger border-0"
                      onClick={nextPage}
                      style={{
                        fontSize: "18px",
                        lineHeight: "18px",
                      }}
                    >
                      Next
                      <i
                        className="bi bi-arrow-right text-danger"
                        style={{ fontSize: "18px", lineHeight: "18px" }}
                      />
                    </button>
                  )}
                </ul>
              </nav>
            </Col>
          </Row>
        </Container>
      ) : null}
      <FAQ />
    </AppLayout>
  );
};
export default Home;