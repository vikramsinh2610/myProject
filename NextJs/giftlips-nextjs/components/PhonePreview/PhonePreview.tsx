import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  children?: ReactNode;
  [x: string]: any;
};

const PhonePreview = ({ children, ...props }: Props) => {
  const [isOnPageLoading, setIsOnPageLoading] = useState<any>({ page: true });

  useEffect(() => {
    setTimeout(() => {
      const splashScreen: any = document.querySelector(
        ".frame-base-wrapper .splash-screen"
      );
      if (splashScreen) {
        splashScreen.className += " animate__animated animate__fadeOut";
        setTimeout(() => splashScreen.remove(), 500);
        setTimeout(
          () =>
            setIsOnPageLoading((beforeVal: any) => ({
              ...beforeVal,
              page: false,
            })),
          600
        );
      }
    }, 2000);
  }, []);

  return (
    <div className="frame-base-wrapper">
      <div className="frame-base">
        <div className="frame-base-light"></div>
        <div className="side-button mute"></div>
        <div className="side-button volume-up"></div>
        <div className="side-button volume-down"></div>
        <div className="side-button hold"></div>
        <div className="stripe top"></div>
        <div className="stripe bottom"></div>
        <div className="port"></div>
        <div className="layer2">
          <div className="layer2-light"></div>
          <div className="layer2-light light-right"></div>
          <div className="screen">
            <div id="background">
              <div id="splash-screen" className="splash-screen">
                <picture>
                  <source
                    srcSet="/static/img/logo/logo-large.webp"
                    media="(min-width:1200px)"
                  />
                  <source
                    srcSet="/static/img/logo/logo-medium.webp"
                    media="(min-width:768px)"
                  />
                  <source
                    srcSet="/static/img/logo/logo-small.webp"
                    media="(min-width:0px)"
                  />
                  <Image
                    src="/static/img/logo/logo-large.webp"
                    alt="wave hands"
                    width="80"
                    height="40"
                  />
                </picture>
                <div id="giftlips-loader-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div
                className={!isOnPageLoading?.page ? "" : "invisible"}
                style={{ height: "100%" }}
              >
                {children}
              </div>
            </div>
            <div className="mask">
              <div className="left-pie"></div>
              <div className="right-pie"></div>
              <div className="speaker"></div>
              <div className="camera">
                <div className="lenz left"></div>
                <div className="lenz right"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;
