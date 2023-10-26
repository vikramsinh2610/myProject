import React from "react";
import { Button } from "react-bootstrap";

function Share({  url, title } : any) {
  const shareDetails = { url, title };

  const handleSharing = async () => {
    if (navigator.share) {
      try {
        await navigator
          .share(shareDetails)
          .then(() =>
            console.log("Hooray! Your content was shared to tha world")
          );
      } catch (error) {
        console.log(`Oops! I couldn't share to the world because: ${error}`);
      }
    } else {
      console.log(
        "Web share is currently not supported on this browser. Please provide a callback"
      );
    }
  };
  return (
    <>
      <Button className="sharer-button" onClick={handleSharing}>
        <span className="sharer-button-text">Share here</span>
      </Button>
    </>
  );
}

export default Share;
