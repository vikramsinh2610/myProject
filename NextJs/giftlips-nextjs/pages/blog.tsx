import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import BlogCard from "../components/Blog/BlogCard";
import FeaturedPost from "../components/Blog/FeaturedPost";
import Hero from "../components/Blog/Hero";
import AppLayout from "../components/layout/AppLayout";
import Pagination from "../components/Pagination/Pagination";
const Blog = ({ posts }: any) => {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<any[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = posts.slice(indexOfFirstRecord, indexOfLastRecord);
  const [nPages, setNPages] = useState<number>(1);
  // const nPages = Math.ceil(posts.length / recordsPerPage);

  useEffect(() => {
    setHasHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (search !== "") {
      setNPages(Math.ceil(currentRecords.length / recordsPerPage));
    } else {
      setNPages(Math.ceil(posts.length / recordsPerPage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, hasHydrated, filteredPosts]);

  const searchPosts = async () => {
    const results = posts.filter(
      (post: any) =>
        post.title.rendered.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.rendered.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredPosts(results);
    return;
  };

  useEffect(() => {
    if (search === "") {
      setFilteredPosts(currentRecords);
    } else {
      searchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, indexOfLastRecord]);

  return (
    <AppLayout>
      <NextSeo
        noindex={process.env.NEXT_PUBLIC_ENV !== "production"}
        title="Free Greeting cards, Wishes, Ecards, Birthday Wishes, Funny Cards & Gifs | GiftLips"
        description="Send free greeting cards with giftlips, wishes, ecards, funny animated cards, birthday wishes, Gifs and online greeting cards with quotes, messages, images on all occasions and holidays such as Birthday, Anniversary, Love, Thanksgiving, Christmas, Season's Greetings and much more."
      />

      <main className="BlogPage">
        <Hero search={search} setSearch={setSearch} />

        {hasHydrated && currentRecords.length > 0 && (
          <section className="posts-list py-10">
            <Container className="px-4 px-sm-5">
              {filteredPosts === null && (
                <FeaturedPost post={currentRecords[0]} />
              )}

              <div style={{ overflowX: "hidden", overflowY: "auto" }}>
                <Row className="g-5">
                  {filteredPosts === null && (
                    <>
                      {posts.map((post: any, i: number) => {
                        if (i === 0) {
                          return null;
                        }

                        return <BlogCard key={post.id} post={post} />;
                      })}
                    </>
                  )}

                  {filteredPosts && filteredPosts.length === 0 && (
                    <Col className="mb-5">
                      <Alert variant="info">No blog found.</Alert>
                    </Col>
                  )}

                  {filteredPosts && filteredPosts.length > 0 && (
                    <>
                      {filteredPosts.map((post: any, index: any) => {
                        if (index === 0 && search == "") {
                          // eslint-disable-next-line react/jsx-key
                          return <FeaturedPost post={post} key={index} />;
                        }
                        return <BlogCard key={post.id} post={post} />;
                      })}
                    </>
                  )}
                </Row>
              </div>
            </Container>
          </section>
        )}
        <Pagination
          nPages={nPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </main>
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(
    "https://cms.giftlips.com/wp-json/wp/v2/posts?_fields[]=id&_fields[]=link&_fields[]=slug&_fields[]=_links&_fields[]=_embedded&_fields[]=title&_fields[]=excerpt&_fields[]=date&_embed&orderby=date&per_page=100"
  );
  const posts = await res.json();
  console.log(`postsLength: ${posts.length}`);

  return {
    props: {
      posts: posts.map((post: any) => {
        return {
          id: post.id,
          link: post.link,
          slug: post.slug,
          _embedded: post._embedded,
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
        };
      }),
    },
    revalidate: 10,
  };
};

export default Blog;
