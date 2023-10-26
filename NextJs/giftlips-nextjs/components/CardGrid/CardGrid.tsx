import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import Link from "next/link";

const CardGrid = ({ templates, isLoading }: any) => {
  return (
    <Container>
      {isLoading && (
        <Row className="p-5 text-center">
          <Col>
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      )}

      {!isLoading && (
        <Row className="px-2 py-4">
          {templates.map((template: any, index: any) => {
            return (
              <Col key={index} xs={6} md={4} lg={3} className="relative mb-4">
                <Card className="cardblock">
                  <Card.Img
                    variant="top"
                    src={template?.coverUrl}
                    alt="Card image"
                    style={{
                      background: "#ededed",
                      minHeight: "150px",
                      minWidth: "150px",
                    }}
                  />
                  <div className="cardblock-btn">
                    <Link href={`/templates/${template?.slug}`}>
                      <button>Use Template</button>
                    </Link>
                  </div>
                  <div className="cardInfo">
                    <h6 className="cardInfo-price">
                      $7.99 <span>shipping included</span>
                    </h6>
                    <p className="cardInfo-title">{template?.title}</p>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default CardGrid;
