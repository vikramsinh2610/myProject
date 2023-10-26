import React from "react";
import Pagination from "../Pagination/Pagination";
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

export default function GroupCardGrid({
  collaboratorCards,
  currentRecords,
  nPages,
  currentPage,
  setCurrentPage,
}: any) {
  const router = useRouter();
  return (
    <div>
      <Row className="py-5" xs={1} md={1} lg={3}>
        {currentRecords.map((card: any, index: number) => {
          return (
            <Col key={index} className="mb-3">
              <Card>
                <div
                  onClick={() => {
                    router.push(`/cards/${card?.cardId?.shortId}/customize`);
                    localStorage.setItem("Inviteduser", uuidv4());
                  }}
                  role="button"
                >
                  <Card.Img
                    variant="top"
                    src={card?.cardId?.coverUrl}
                    alt="Card image"
                  />
                </div>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item className="tamplateData">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>{card?.cardId?.title}</div>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          );
        })}
      </Row>

      {currentRecords.length > 0 && collaboratorCards.length >= 10 ? (
        <Pagination
          nPages={nPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : null}
    </div>
  );
}
