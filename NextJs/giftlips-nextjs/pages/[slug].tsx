/* eslint-disable @next/next/no-img-element */
import moment from "moment";
import { Col, Container, Row } from "react-bootstrap";
import LogoIcon from "../assets/img/logos/logo.webp";
import SharingButtons from "../components/Blog/SharingButtons";
import AppLayout from "../components/layout/AppLayout";
import Image from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { NextSeo } from "next-seo";
import { cleanWpUrl } from "../helpers/utils";
import { useEffect } from "react";

const Blog = ({ post }: any) => {
  post = {
    ...post,
    link: post?.link.replace(
      "https://cms.giftlips.com",
      process.env.NEXT_PUBLIC_FRONTEND_URL
    ),
    yoast_head_json: {
      ...post?.yoast_head_json,
      og_url: post?.yoast_head_json?.og_url.replace(
        "https://cms.giftlips.com",
        process.env.NEXT_PUBLIC_FRONTEND_URL
      ),
      robots: {
        ...post?.yoast_head_json?.robots,
        index: "index",
        follow: "follow",
      },
    },
  };

  const featuredImage =
    post?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.full;

  useEffect(() => {
    setTimeout(() => {
      var els = document.getElementsByClassName("is-layout-flex");

      for (var i = 0; i < els.length; i++) {
        var element = els[i];
        if (element.classList) {
          element.classList.add("row");
          element.classList.add("gx-3");
        }
      }

      var els = document.getElementsByClassName("is-layout-flow");

      for (var i = 0; i < els.length; i++) {
        var element = els[i];
        if (element.classList) {
          element.classList.add("col-6");
          element.classList.add("col-sm-6");
        }
      }
    }, 1000);
  }, []);

  return (
    <AppLayout>
      <NextSeo
        noindex={process.env.NEXT_PUBLIC_ENV !== "production"}
        title={post?.title?.rendered}
        description={post?.yoast_head_json?.description}
        openGraph={{
          type: post?.yoast_head_json?.og_type,
          url: cleanWpUrl(post?.yoast_head_json?.og_url),
          title: post?.title?.rendered,
          description: post?.yoast_head_json?.og_description,
          images: post?.yoast_head_json?.og_image,
          article: {
            publishedTime: post?.yoast_head_json?.article_published_time,
            modifiedTime: post?.yoast_head_json?.article_modified_time,
            authors: [post?.yoast_head_json?.article_author],
          },
          siteName: "GiftLips",
        }}
        twitter={{
          handle: "@handle",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />

      <main className="BlogDetailPage">
        <Container>
          <Row>
            <Col lg={{ offset: 2, span: 8 }}>
              <div className="pt-4" />

              <Container>
                <Row>
                  <Col>
                    <h1 className="text-center blog-detail-title fw-middle">
                      {post?.title?.rendered}
                    </h1>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-center blog-detail-text-date fw-light mb-3">
                    Last Updated:{" "}
                    {post?.date && moment(post?.date).format("LL")}
                  </Col>
                  <small className="text-center">Share to social media</small>
                  <SharingButtons data={post} />
                </Row>
              </Container>

              <div className="pb-5" />

              <Container>
                <Row>
                  <Col className="d-flex justify-content-center">
                    {featuredImage && (
                      <Image
                        src={featuredImage?.source_url}
                        width={featuredImage?.width}
                        height={featuredImage?.height}
                        className="featured-image"
                        alt={
                          featuredImage?.alt_text || "GiftLips featured image"
                        }
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = LogoIcon.src;
                        }}
                        style={{ width: "100%", height: "auto" }}
                      />
                    )}
                  </Col>
                </Row>
              </Container>

              <div className="pb-5" />

              <Container>
                <Row>
                  <Col>
                    <div
                      className="blog-detail-content"
                      dangerouslySetInnerHTML={{
                        __html: post?.content?.rendered.replace(
                          new RegExp(
                            `https://cms.giftlips.com/${post?.slug}/#`,
                            "g"
                          ),
                          "#"
                        ),
                      }}
                    />
                  </Col>
                  <small className="text-center">Share to social media</small>
                  <SharingButtons data={post} />
                </Row>
              </Container>

              <div className="py-10" />
            </Col>
          </Row>
        </Container>
      </main>
    </AppLayout>
  );
};

interface IParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  console.log("/[slug] getStaticPaths");

  const res = await fetch(
    "https://cms.giftlips.com/wp-json/wp/v2/posts?_embed&orderby=date"
  );
  const posts = await res.json();

  const paths = posts.map((post: any) => ({
    params: { slug: post?.slug },
  }));

  return { paths: paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context: any) => {
  console.log("/[slug] getStaticProps");

  const { slug } = context.params as IParams;

  if (slug === "undefined") {
    return { notFound: true };
  }

  const res = await fetch(
    `https://cms.giftlips.com/wp-json/wp/v2/posts?_embed&slug=${slug}&orderby=date`
  );
  const posts = await res.json();

  return {
    props: {
      post: posts[0],
    },
    revalidate: 10,
  };
};

export default Blog;
