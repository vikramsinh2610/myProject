import * as React from 'react';
import { Badge, Button, Col, Container, Modal, Row } from "react-bootstrap";

export interface IAppProps {
  onClick : () => void;
}

export function MailButton (props: IAppProps) {
  return (
    <div>
       <Button
          variant="warning"
          onClick={() => {
            
          }}
        >
          <i className="bi bi-lock"></i> Mail Card
        </Button>
    </div>
  );
}
