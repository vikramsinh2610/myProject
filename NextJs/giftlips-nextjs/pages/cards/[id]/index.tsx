import { useCallback, useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { NextSeo } from "next-seo";
import { devLogError } from "../../../helpers/logger";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useRouter } from "next/router";
import http from "../../../services/http.service";
import GLReels from "../../../components/Reels/GLReels";

const Reels = () => {
  const router = useRouter();
  const { id: cardId } = router.query;
  const [card, setCard] = useState<any>(null);
  const [progress, setProgress] = useState(30);

  const getCard = useCallback(async () => {
    try {
      setProgress(30);
      const response = await http.get(`/cards/${cardId}`);
      const data = await response.data;
      setCard(data);
    } catch (error) {
      devLogError(error);
    } finally {
      setProgress(100);
    }
  }, [cardId]);

  useEffect(() => {
    if (router.isReady) {
      setProgress(100);
      void getCard();
    }
  }, [router, getCard]);

  return (
    <>
      <NextSeo noindex={true} />

      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="pt-1"
      />

      <GLReels cardEntries={card?.entries} />
    </>
  );
};

export default Reels;
