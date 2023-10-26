import { Button, Col, Container, Row, Form, InputGroup } from "react-bootstrap";
import BlogHero from "../../assets/img/blog/blog-hero.webp";

const Hero = ({ search, setSearch }: any) => {
  return (
    <div
      className="hero page-header-ui page-header-ui-dark bg-img-cover overlay overlay-60"
      style={{
        backgroundImage: `url(${BlogHero.src})`,
      }}
    >
      <div className="page-header-ui-content position-relative">
        <Container className="px-5 text-center">
          <Row className="gx-5 justify-content-center">
            <Col lg={8}>
              <h1 className="page-header-ui-title mb-3">Blog</h1>
              <p className="page-header-ui-text mb-3 text-white-50">
                Browse articles, keep up to date, and learn more on our blog!
              </p>
              <InputGroup className="mb-3">
                <Form.Control
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                />
                <Button onClick={() => setSearch("")}>Clear</Button>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="svg-border-rounded text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 144.54 17.34"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M144.54,17.34H0V0H144.54ZM0,0S32.36,17.34,72.27,17.34,144.54,0,144.54,0"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
