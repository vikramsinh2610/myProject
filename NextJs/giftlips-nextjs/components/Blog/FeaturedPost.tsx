/* eslint-disable @next/next/no-img-element */
import { Card, Col, Row } from "react-bootstrap";
import moment from "moment";
import LogoIcon from "../../assets/img/logos/logo.webp";
import Link from "next/link";

const FeaturedPost = ({ post }: any) => {
  return (
    <Link
      className="card post-preview post-preview-featured lift mb-5 overflow-hidden"
      href={`/${post?.slug}`}
    >
      <Row className="g-0">
        <Col lg={5}>
          <div
            className="post-preview-featured-img"
            style={{
              backgroundImage: `url('${post?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium_large?.source_url}')`,
            }}
          />
        </Col>
        <Col lg={7}>
          <Card.Body>
            <div className="py-5">
              <Card.Title>{post?.title?.rendered}</Card.Title>
              <Card.Text
                dangerouslySetInnerHTML={{
                  __html:
                    post?.excerpt?.rendered.length > 300
                      ? post?.excerpt?.rendered.slice(0, 300 - 1) + "&hellip;"
                      : post?.excerpt?.rendered,
                }}
              />
            </div>
            <hr />
            <div className="post-preview-meta">
              <img
                className="post-preview-meta-img"
                src={post?._embedded?.author?.[0]?.avatar_urls?.[48]}
                alt="author"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = LogoIcon.src;
                }}
                loading="lazy"
                style={{
                  objectFit: "contain",
                  objectPosition: "50% 50%",
                }}
              />
              <div className="post-preview-meta-details">
                <div className="post-preview-meta-details-name">
                  {post?._embedded?.author?.[0]?.name}
                </div>
                <div className="post-preview-meta-details-date">
                  {post?.date && moment(post?.date).format("LL")}
                </div>
              </div>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Link>
  );
};

export default FeaturedPost;
