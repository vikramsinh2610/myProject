import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col,  Form,  InputGroup,  Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { s3Upload } from "../../services/s3.service";
import LoadingBar from "react-top-loading-bar";
import { SVG } from "@svgdotjs/svg.js";
const SVGLoaderEditor = ({
  src,
  qrImage = "https://qrtiger.com/qr/F3IB.png",
  message,
  qrOptions = { url: "https://www.qrcode-tiger.com" },
  onSave,
  setShowStep2,
  inviteduser
}: any) => {
  const [progress, setProgress] = useState(0);
  const [customMessage, setCustomMessage] = useState<string>(message);
  const [isSvgReady, setIsSvgReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [customQRUrl, setCustomQRUrl] = useState<any>(qrImage);
  const [svgFile, setSvgFile] = useState("");
  const onClickSave = async (e: any) => {
    setProgress(30);
    setIsSaving(true);
    let _ell: any = document.getElementById(`editable-2`)?.innerHTML;
    let _el: any = document.getElementById(`svg`)?.children[0];
    let plainText = _ell.replace(/<[^>]+>/g, "");
    localStorage.setItem("text",plainText)
    if (_el) {
      let uploadKey = `cards/assets/${uuidv4()}.svg`;
      let url = await s3Upload(uploadKey, "image/svg+xml", _el?.outerHTML);
      setProgress(100);
      setIsSaving(false);
      onSave(e, url, { message: plainText, qrImage: customQRUrl });
      setCustomMessage(plainText);
    }
    setShowStep2("show");
  };
  const generateQRCode = async (updatedQRData: any) => {
    const response = await fetch("https://qrtiger.com/api/qr/static", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer 29c7d530-3768-11ea-822b-f1acaac35ff1`,
      },
      body: JSON.stringify(updatedQRData),
    });
    return await response.json();
  };
  const getTextElementCoordinates = () => {
    let el: any = document.getElementById("editable-2");
    let numberPattern = /\d+(\.\d+)?/g;
    let transform = el?.getAttribute("transform");
    let [x, y]: any = transform.match(numberPattern);
    return [x, y];
  };
  const onMoveLeft = (spaces: number = 5) => {
    let [x, y] = getTextElementCoordinates();
    let newValues = [parseInt(x) - spaces, parseInt(y)];
    let el: any = document.getElementById("editable-2");
    el?.setAttribute("transform", `translate(${newValues[0]},${newValues[1]})`);
  };
  const onMoveRight = (spaces: number = 5) => {
    let [x, y] = getTextElementCoordinates();
    let newValues = [parseInt(x) + spaces, parseInt(y)];
    let el: any = document.getElementById("editable-2");
    el?.setAttribute("transform", `translate(${newValues[0]},${newValues[1]})`);
  };
  const onTextChange = (e: any) => {
    let _editable: any = document.getElementById("editable-2");
    if (e.target.value === "") {
      let _editable: any = document.getElementById("editable-2");
      _editable.innerHTML =
        '<tspan dy="0" x="0">' + `"Your message here..."` + "</tspan>";
    } else {
      let _editable: any = document.getElementById("editable-2");
      _editable.innerHTML =
        '<tspan dy="0" x="0"> ' + e.target.value + "</tspan>";
    }
  };
  const getSvgContent = useCallback(async () => {
    const req = await fetch(src);
    const data = await req.text();
    let generateData: any = {
      size: 500,
      logo: qrOptions?.coreAttributes?.logo,
      backgroundColor: qrOptions?.coreAttributes?.backgroundColor,
      transparentBkg: qrOptions?.coreAttributes?.transparentBkg,
      qrCategory: "url",
      text: qrOptions?.url,
      qrData: qrOptions?.patternAttributes?.pattern,
      colorDark: qrOptions?.patternAttributes?.colorDark,
      color01: qrOptions?.patternAttributes?.color1,
      color02: qrOptions?.patternAttributes?.color2,
      eye_color: qrOptions?.eyeAttributes?.customEyeColor,
      eye_color01: qrOptions?.eyeAttributes?.color1,
      eye_color02: qrOptions?.eyeAttributes?.color2,
      eye_outer: qrOptions?.eyeAttributes?.eyeOuter,
      eye_inner: qrOptions?.eyeAttributes?.eyeInner,
      dot: "",
    };
    if (qrOptions?.frameAttributes?.frame) {
      generateData.frame = qrOptions?.frameAttributes?.frame;
      generateData.frameColor = qrOptions?.frameAttributes?.color1;
      generateData.frameColor2 = qrOptions?.frameAttributes?.color2;
      generateData.frameText = qrOptions?.frameAttributes?.text;
      generateData.frametextFont = qrOptions?.frameAttributes?.font;
    }
    const datasvg = await generateQRCode(generateData);
    setCustomQRUrl(datasvg?.url);
    let svg = `data:image/png;base64,${datasvg?.data}`;
    let _el: any = document.getElementById(`qrcode-2`);
    _el?.setAttribute("xlink:href", svg);
    setSvgFile(data);
  }, [qrOptions, src]);
  useEffect(() => {
    void getSvgContent();
    const draw: any = SVG()?.addTo("#svg")?.svg(svgFile)?.attr("width", "100%");
    const editable: any = draw?.findOne("#editable-2");
    editable?.text(customMessage);
    let elGet: any = document.getElementById("svg")?.firstChild?.firstChild;
    var viewBoxValue = elGet?.getAttribute("viewBox");
    let elSet: any = document.getElementById("svg")?.firstChild;
    elSet.setAttribute("viewBox", viewBoxValue);
    elGet?.setAttribute("width", "100%");
    setIsSvgReady(true);
    return () => {
      draw.remove();
    };
  }, [svgFile, customMessage, getSvgContent]);
  const checkSvgLoad = useMemo(() => {
    if (svgFile.length === 0) return true;
    else return false;
  }, [svgFile]);
  return (
    <>
      <LoadingBar
        color="#F11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="pt-1"
      />
      {src && (
        <>
          <Row>
            <Col>
              <div id="svgContainer" className="bg-light">
                <div className="flex min-h-screen items-center justify-center">
                  <div id="svg"></div>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="my-2">
            <Col>
              <InputGroup className="mb-3">
                <Form.Control
                  as={"textarea"}
                  placeholder="Your message here..."
                  onChange={onTextChange}
                  defaultValue={customMessage}
                  disabled={checkSvgLoad || inviteduser}
                />
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    onMoveLeft(10);
                  }}
                  disabled={!isSvgReady || checkSvgLoad}
                >
                  <i className={"bi bi-arrow-left-circle-fill"}></i>
                </Button>
                <Button variant={"secondary"} disabled={true}>
                  Move
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    onMoveRight(10);
                  }}
                  disabled={!isSvgReady || checkSvgLoad}
                >
                  <i className={"bi bi-arrow-right-circle-fill"}></i>
                </Button>
              </InputGroup>
            </Col>
          </Row>
          {inviteduser !== null ? <></>: <Row>
            <Col>
              <div className="d-grid gap-2">
                <Button
                  variant="success"
                  onClick={onClickSave}
                  disabled={isSaving || checkSvgLoad || inviteduser}
                >
                  {isSaving ? "Saving..." : "Next"}
                </Button>
              </div>
            </Col>
          </Row>}
        </>
      )}
    </>
  );
};
export default SVGLoaderEditor;
