import { Fragment, useLayoutEffect, useRef, useState } from "react";
import ClipboardJS from "clipboard";
import { Overlay, Tooltip } from "react-bootstrap";

interface CopyInterface {
  glClassNames: string; // must be unique classname
  textTopCopy: any;
  buttonText: string;
}

const CopyClipboard = ({
  glClassNames = "",
  textTopCopy,
  buttonText,
}: CopyInterface) => {
  const copyBtn = useRef(null);
  const [show, setShow] = useState<boolean>(false);

  useLayoutEffect(() => {
    let _cl: any = document.querySelector(".clipboard");
    if (_cl) {
      let _clipboard = new ClipboardJS(".clipboard");

      _clipboard.on("success", function (e) {
        if (e.action === "copy") {
          setShow(true);
          setTimeout(() => setShow(false), 4000);
        }

        e.clearSelection();
      });

      _clipboard.on("error", function (e) {});
    }
  }, []);

  return (
    <Fragment>
      <button
        className={glClassNames + " clipboard btn-sm greenBtn"}
        type="button"
        data-clipboard-text={textTopCopy}
        ref={copyBtn}
      >
        {buttonText}
      </button>
      <Overlay target={copyBtn.current} show={show} placement="top">
        {(props) => <Tooltip {...props}>Copied!</Tooltip>}
      </Overlay>
    </Fragment>
  );
};

export default CopyClipboard;
