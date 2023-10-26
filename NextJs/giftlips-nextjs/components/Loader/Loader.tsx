import { Col, Row, Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <Row className="py-5 text-center" style={{ minHeight: "50vh" }}>
      <Col>
        <Spinner animation="border" variant="warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Col>
    </Row>
  );
};

export default Loader;
