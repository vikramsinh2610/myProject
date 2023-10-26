import { Fragment, useEffect, useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import CopyClipboard from "../CopyClipboard/CopyClipboard";
import Image from "next/image";
import Modal from 'react-bootstrap/Modal';
import http from "../../services/http.service";
import styles from "./userInvitation.module.css";

const banner = "/static/img/public/invite3.png";

const UserInvitation = ({ hideTitle, token, cardThumbnail, cardData }: any) => {
  const [inviteMessage, setInviteMessage] = useState("");
  const [sendinvite, setSendInvite] = useState("");
  const [show, setShow] = useState(false);
  const [successMsg, setSuccessmsg] = useState('')
  const [messageClass, setMessageclass] = useState('');
  const [cardMember, setCardMember] = useState<any>(null);

  useEffect(() => {
    getCardMember();
  }, []);
  const getCardMember = async () => {
    try {
      let response = await http.get(
        `/card-members/${cardData?._id}/personalDetailOfMember`
      );
      setCardMember(response?.data?.data);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const handleClose = () => {
    setShow(false)
    setSendInvite('');
    setSuccessmsg('');
    setMessageclass('');
  };
  const handleShow = () => setShow(true);
  const SendInviteMessage = async (e: any) => {
    e.preventDefault();
    let response = null;
    try {
      response = await http.post(
        `/card-invites`, { cardId: cardData?._id, email: sendinvite }
      );
      setSuccessmsg('Invitation has been sent successfully');
      setMessageclass('text-success');
      getCardMember();
    } catch (e: any) {
      setSuccessmsg(e?.response?.data?.message);
      setMessageclass('text-danger');
    }
  }

  useEffect(() => {
    if (token) {
      setInviteMessage(
        `Hi! I’m making a surprise video. Follow the link to record your own message, and I’ll combine it with others from the group. It’s going to be an extra special moment:
          ${process.env.NEXT_PUBLIC_FRONTEND_URL}/cards/${token}/join`
      );
    }

  }, [token]);

  return (
    <Fragment>
      <Row>
        <Col>
          {!hideTitle && (
            <h4 className="text-center fw-semibold display-7">
              Invite others to join
              <div className="d-inline text-gl-primary"> for more videos</div>
            </h4>
          )}
          <Image
            src={cardThumbnail}
            width={500}
            height={500}
            style={{ width: "100%" }}
            alt={"Thumbnail URL"}
          ></Image>
          {/* <p className="mt-3">
            Make it a group surprise by collecting videos from friends. Type a
            message to them below, and remember to let them know when it’s due.
          </p> */}
          <Form.Control
            className="bg-light"
            as="textarea"
            defaultValue={inviteMessage}
            style={{ height: "200px" }}
            onChange={(e: any) => {
              setInviteMessage(e.target.value);
            }}
          />
          <div className="d-grid gap-2 mt-2">
            <a
              className="btn btn-secondary"
              href={`mailto:?subject=Help me create a surprise group video&body=${inviteMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              Email join link
            </a>
            <CopyClipboard
              glClassNames="btn link"
              textTopCopy={inviteMessage}
              buttonText="Copy join link and paste anywhere"
            />
          </div>
          <div className="d-grid gap-2 mt-2">
            <Button className="btn btn-warning" onClick={handleShow}>Add member</Button>
          </div>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose} dialogClassName={styles.modalwidth}>
        <Modal.Header closeButton>
          <Modal.Title>Share GiftLips</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 d-flex" controlId="email">
            <Form.Control className={styles.inviteMail} defaultValue={sendinvite} type="text" placeholder="Enter Name" onChange={(e: any) => setSendInvite(e.target.value)} required />
            <Button className="ms-3" variant="primary" onClick={(e) => SendInviteMessage(e)} disabled={sendinvite.length > 0 ? false : true}>
              Send Invite
            </Button>
          </Form.Group>
          {cardMember && cardMember.length > 0 &&
           <Form.Group>
            <ul className={styles.memberlist}>
              {cardMember.map((member: any) => {
                return <li key={member?._id}><div><span className={styles.membericon}><img src={banner} height="20px" width="20px" /></span>{member?.email}</div><span className={member?.accepted === true ? 'text-success' : 'text-danger'}>{member?.accepted === true ? 'Accepted' : 'Not accepted'}</span></li>
              })}
            </ul>
          </Form.Group>
          }
          
          <p className={`mb-0 text-center ${messageClass}`}>{successMsg}</p>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </Fragment >
  );
};

export default UserInvitation;
