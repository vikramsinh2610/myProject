import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getExtension } from "../../helpers/common";
import { useMediaQuery } from "react-responsive";
const LogoIcon = "/static/img/logos/logo.webp";

const VideoManager = ({ entries }: any) => {
  const isSm = useMediaQuery({ query: "(min-width: 576px)" });

  useEffect(() => {}, []);

  const clickDeleteEntry = (entryId: any) => {
    console.log(entryId);
  };

  return (
    <>
      <Container>
        <Row className="row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 placeholder-glow g-0 g-sm-2">
          {entries.map((item: any) => {
            return (
              <Col key={item?._id}>
                <p>hi</p>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default VideoManager;
