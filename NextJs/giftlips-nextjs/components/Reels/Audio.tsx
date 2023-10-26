import Image from "next/image";
import React, { Component } from "react";

const PlayIcon = "/static/img/videos/play.png";
const Background = "/static/img/audio/background.webp";
const LogoIcon = "/static/img/logos/logo.webp";

export default class Audio extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      timestamps: [],
      isPlaying: props.autoPlay,
      display: "none",
      isReady: false,
    };
  }

  videoRef = React.createRef();

  handlePlay = () => {
    // @ts-ignore
    if (this.state.isPlaying === true) {
      // @ts-ignore
      this.videoRef.current.pause();
      this.setState({
        isPlaying: false,
        display: undefined,
      });
    } else {
      // @ts-ignore
      this.videoRef.current.play();
      this.setState({
        isPlaying: true,
        display: "none",
      });
    }
  };

  handlePause = () => {
    this.setState({
      display: undefined,
    });
  };

  handlePlaying = () => {
    this.setState({
      display: "none",
    });
  };

  render() {
    return (
      <div className="position-relative" onClick={this.handlePlay}>
        <div
          // @ts-ignore
          id={`play_container_${this.props.id}`}
          onClick={this.handlePlay}
          className={`mt-1 position-absolute opacity-50`}
          style={{
            backgroundColor: "rgb(0, 0, 0)",
            zIndex: "50",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
          role="button"
        >
          <Image
            src={PlayIcon}
            width={115}
            height={115}
            alt="play"
            className="animate__animated animate__fadeIn"
            // @ts-ignore
            style={{ width: 115, height: 115, display: this.state.display }}
          />
        </div>

        <Image
          src={Background}
          width={200}
          height={300}
          // layout="fill"
          alt="play"
          className="animate__animated animate__fadeIn w-100"
          // @ts-ignore
          // style={{ width: 115, height: 115  }}
        />
        {
          // @ts-ignore
          !this.state.isReady && (
            <Image
              src={LogoIcon}
              alt="card"
              fill={true}
              style={{ width: "100%" }}
            />
          )
        }
        <audio
          // @ts-ignore
          id={this.props.id}
          // @ts-ignore
          ref={this.videoRef}
          //   width="100%"
          //   hight="100%"
          muted={false}
          // @ts-ignore
          autoPlay={this.props.autoPlay}
          onPause={this.handlePause}
          onPlaying={this.handlePlaying}
          loop={true}
          // @ts-ignore
          src={this.props.url}
          onLoadedData={() =>
            this.setState({
              isReady: true,
            })
          }
        />
      </div>
    );
  }
}
