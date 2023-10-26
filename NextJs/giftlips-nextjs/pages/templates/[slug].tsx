import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import http from "../../services/http.service";
import { useModalContext } from "../../context/contextLib";
import AppLayout from "../../components/layout/AppLayout";
import { useSession } from "next-auth/react";
import { devLog } from "../../helpers/logger";
import { PinterestIcon, PinterestShareButton } from "react-share";
import { NextSeo } from "next-seo";
import { ParsedUrlQuery } from "querystring";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

const TemplatePreview = ({ template }: any) => {
  const session: any = useSession();
  const router = useRouter();
  const { setShowAuthModal }: any = useModalContext();
  const [svgSrc, setSvgSrc] = useState<any>(null);

  useEffect(() => {
    setSvgSrc(template?.coverUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateCard = async () => {
    if (session.status === "authenticated") {
      localStorage.removeItem("Inviteduser");
      try {
        let response = await http.post(`/cards`, {
          userId: session.data?.user?.id,
          title: template?.title,
          description: template?.description,
          template: template?._id,
        });
        router.push(`/cards/${response.data.data.shortId}/customize`);
      } catch (e: any) {
        devLog(e);
      }
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <AppLayout>
      <NextSeo
        noindex={process.env.NEXT_PUBLIC_ENV !== "production"}
        title={`${template?.title} | GiftLips`}
        description={template?.description}
        openGraph={{
          type: "product",
          url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${template?.slug}`,
          title: `${template?.title} | GiftLips`,
          description: template?.description,
          images: [
            {
              url: template?.coverUrl,
              width: template?.width,
              height: template?.height,
              alt: template?.title,
            },
          ],
          siteName: "GiftLips",
        }}
        twitter={{
          handle: "@handle",
          site: "@site",
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          {
            property: "keywords",
            content: template?.keywords || "",
          },
          {
            property: "product:price:amount",
            content: "7.99",
          },
          {
            property: "product:price:currency",
            content: "USD",
          },
          {
            property: "og:availability",
            content: "instock",
          },
        ]}
      />

      <div className="CardEditPage">
        <main>
          <Container>
            <Row className="justify-content-center">
              <Col md={5}>
                <div className="productData-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={svgSrc} alt={template?.title} />
                </div>
              </Col>
              <Col md={5}>
                <div className="productData-info">
                  <h3 className="productData-title font-weight-extrabold mb-5 text-black">
                    {template?.title}
                  </h3>
                  <p>{template?.description}</p>
                  <div className="d-grid mt-4 gap-2">
                    <Button
                      className="btn btn-warning mt-2"
                      onClick={onCreateCard}
                    >
                      Use This Template
                    </Button>
                  </div>

                  <div className="productDetails">
                    <h2 className="productDetails__title">DETAILS</h2>
                    <h6>
                      <small className="text-black-50 me-3">Category:</small>
                      {template?.categories.map(
                        (category: string, i: number) => {
                          if (i > 0) {
                            return (
                              <span key={category}>
                                , {category.toUpperCase()}
                              </span>
                            );
                          }

                          return (
                            <span key={category}>{category.toUpperCase()}</span>
                          );
                        }
                      )}
                    </h6>
                  </div>
                  <div className="d-grid gap-2">
                    <small>Pin on Pinterest</small>
                    <PinterestShareButton
                      url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/templates/${template?.slug}`}
                      media={template?.coverUrl}
                      title={template?.title}
                      description={template?.description}
                    >
                      <PinterestIcon
                        size={40}
                        round={true}
                        className="cursor-pointer opacity-40 hover:opacity-100"
                      />
                    </PinterestShareButton>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </AppLayout>
  );
};

interface IParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  console.log("/templates/[slug] getStaticPaths");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE_BASE_URL}/templates/all`
  );
  const templates = await res.json();

  const paths = templates.data.map((template: any) => ({
    params: { slug: template?.slug },
  }));

  return { paths: paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context: any) => {
  console.log("/templates/[slug] getStaticProps");

  const { slug } = context.params as IParams;

  if (slug === "undefined") {
    return { notFound: true };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE_BASE_URL}/templates/slug/${slug}`
  );
  const template = await res.json();

  return {
    props: {
      template,
    },
    revalidate: 10,
  };
};

export default TemplatePreview;
