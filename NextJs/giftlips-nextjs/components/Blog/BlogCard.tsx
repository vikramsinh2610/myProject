/* eslint-disable @next/next/no-img-element */
import { Card, Col } from "react-bootstrap";
import moment from "moment";
import Link from "next/link";
import LogoIcon from "../../assets/img/logos/logo.webp";

const BlogCard = ({ post }: any) => {
  return (
    <Col md={6} xl={4}>
      <Link className="card post-preview lift h-100" href={`/${post?.slug}`}>
        <img
          className="card-img-top"
          src={
            post?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes
              ?.medium?.source_url
          }
          alt="featured photo"
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
        <Card.Body>
          <Card.Title>{post?.title?.rendered}</Card.Title>
          <Card.Text
            dangerouslySetInnerHTML={{
              __html:
                post?.excerpt?.rendered.length > 100
                  ? post?.excerpt?.rendered.slice(0, 100 - 1) + "&hellip;"
                  : post?.excerpt?.rendered,
            }}
          />
        </Card.Body>
        <Card.Footer>
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
        </Card.Footer>
      </Link>
    </Col>
  );
};

export default BlogCard;
