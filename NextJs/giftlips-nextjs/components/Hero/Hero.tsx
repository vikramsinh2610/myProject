import "animate.css";
import Lottie from "lottie-react";
import styles from "./Hero.module.css";
import { useEffect, useState } from "react";
import banner320 from "../../assets/animation-json/banner-320.json";
import banner768 from "../../assets/animation-json/banner-768.json";
import banner1024 from "../../assets/animation-json/banner-1024.json";
import banner1366 from "../../assets/animation-json/banner-1366.json";
import banner1600 from "../../assets/animation-json/banner-1600.json";

const Hero = () => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setAnimationData(banner320);
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      setAnimationData(banner768);
    } else if (window.innerWidth >= 1024 && window.innerWidth < 1366) {
      setAnimationData(banner1024);
    } else if (window.innerWidth >= 1366 && window.innerWidth < 1600) {
      setAnimationData(banner1366);
    } else if (window.innerWidth >= 1600) {
      setAnimationData(banner1600);
    }
  }, []);

  return (
    <div className={styles.banner}>
      <div
        className={`${styles.content} animate__animated animate__fadeIn animate__delay-2s`}
      >
        <h1 className={styles.heading}>
          Make Someone’s Day with a{" "}
          <b style={{ color: "#fd3259" }}>Personalized</b> Video Greeting Card
        </h1>
        <h3 className={styles.excerpt}>
          Give a digital dimension to your greeting cards by adding{" "}
          <b style={{ color: "#595cd4" }}>video messages</b> of friends and
          family for an extra engaging surprise!
        </h3>
      </div>

      <Lottie animationData={animationData} loop={false} />
    </div>
  );
};

export default Hero;
