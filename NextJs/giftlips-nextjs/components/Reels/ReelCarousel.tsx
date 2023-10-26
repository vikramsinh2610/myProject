// import { useMediaQuery } from "react-responsive";
import { getExtension } from "../../helpers/common";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const ReelCarousel = ({ entries, children, entry }: any) => {
  // const isMobile = useMediaQuery({ query: "(max-width: 912px)" });

  // const carouselOnClickItem = (index: number, item: any) => {
  //   devLog("onClickItem index, item", index, item);
  //   return;
  //   if (entries.length === 0) return;

  //   entries.forEach((entry: any) => {
  //     if (!["png", "jpg", "jpeg"].includes(getExtension(entry?.url))) {
  //       let video: any = document.getElementById(entry?._id);
  //       let _playCnt: any = document.getElementById(
  //         "play_container_" + entry?._id
  //       );
  //       let _playImg: any = document.getElementById("play_img_" + entry?._id);

  //       if (entry._id === item?.key) {
  //         devLog("yes it matched");
  //         if (video.paused) {
  //           video.play();
  //           if (_playCnt) {
  //             _playCnt.classList.remove("opacity-50");
  //             _playCnt.classList.add("opacity-0");
  //           }

  //           if (_playImg) {
  //             _playImg.classList.remove("animate__fadeIn");
  //             _playImg.classList.add("animate__fadeOut");
  //           }
  //         } else {
  //           video.pause();
  //           if (_playCnt) {
  //             _playCnt.classList.add("opacity-50");
  //             _playCnt.classList.remove("opacity-0");
  //           }

  //           if (_playImg) {
  //             _playImg.classList.remove("animate__fadeOut");
  //             _playImg.classList.add("animate__fadeIn");
  //           }
  //         }
  //       } else {
  //         video.pause();
  //         if (_playCnt) {
  //           _playCnt.classList.add("opacity-50");
  //           _playCnt.classList.remove("opacity-0");
  //         }

  //         if (_playImg) {
  //           _playImg.classList.remove("animate__fadeOut");
  //           _playImg.classList.add("animate__fadeIn");
  //         }
  //       }
  //     }
  //   });
  // };

  // const carouselOnSwipeEnd = (event: React.TouchEvent) => {
  //   devLog("onSwipeEnd event", event);
  // };

  const carouselOnChange = (index: number, item: any): any => {
    if (entries.length === 0) return;

    const _id = item?.key ? item.key.substring(2) : null;
    if (_id) {
      entries.forEach((entry: any) => {
        if (!["png", "jpg", "jpeg"].includes(getExtension(entry?.url))) {
          const video: any = document.getElementById(entry?._id);

          if (entry._id === _id && video.paused) {
            video.play();
          } else {
            video.pause();
          }
        }
      });
    }
  };

  return (
    <Carousel
      className="carousel-wrapper w-100"
      axis="vertical"
      width="auto"
      showArrows={false}
      showStatus={false}
      showIndicators={false}
      infiniteLoop={false}
      showThumbs={false}
      dynamicHeight={true}
      useKeyboardArrows={false}
      autoPlay={false}
      stopOnHover={true}
      swipeable={true}
      emulateTouch={true}
      autoFocus={false}
      centerMode={true}
      selectedItem={entry ? entry - 1 : 0}
      // selectedItem={entry}
      // onClickItem={carouselOnClickItem}
      // onSwipeEnd={carouselOnSwipeEnd}
      onChange={carouselOnChange}
      // onClickThumb={(index: number, item: React.ReactNode) => {
      //   devLog("onClickThumb index, item", index, item);
      //   devLog("onClickThumb index, item", index, item);
      // }}
      // onSwipeStart={(event: React.TouchEvent) => {
      //   devLog("onSwipeStart event", event);
      // }}
      // statusFormatter={(currentItem: number, total: number): any => {
      //   devLog("statusFormatter currentItem total", currentItem, total);
      // }}
    >
      {children}
    </Carousel>
  );
};

export default ReelCarousel;
