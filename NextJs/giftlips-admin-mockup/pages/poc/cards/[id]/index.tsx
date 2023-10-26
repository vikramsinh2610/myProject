import Layout from "@/components/Layout";
import { devLog } from "@/helpers/logger";
import http from "@/services/http.service";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Cards() {
  const router = useRouter();
  const { id: cardId } = router.query;
  const [card, setCard] = useState<any>(null);
  const [cardEntries, setCardEntries] = useState<any[]>([]);

  const getCard = useCallback(async () => {
    const response = await http.get(`/cards/${cardId}`);
    const data = await response.data;
    setCard(data);
    devLog(data);
  }, [cardId]);

  const getCardEntries = useCallback(async () => {
    const response = await http.get(`/entries?cardId=${cardId}`);
    const data = await response.data;
    setCardEntries(
      data.map((entry: any) => ({
        ...entry,
        playing: false,
        muted: true,
      }))
    );
    devLog(data);
  }, [cardId]);

  useEffect(() => {
    if (router.isReady) {
      void getCard();
      void getCardEntries();
    }
  }, [router, getCard, getCardEntries]);

  const handleSlideChange = (index: number, item: any) => {
    devLog(index, item);
    setCardEntries(
      cardEntries.map((entry: any) => {
        if (entry._id === item.props.id) {
          return {
            ...entry,
            playing: true,
            muted: false,
          };
        }

        return {
          ...entry,
          playing: false,
          muted: true,
        };
      })
    );
  };

  return (
    <Layout>
      <div className="flex items-center bg-black">
        <Carousel
          emulateTouch
          showThumbs={false}
          showIndicators={false}
          showArrows={false}
          showStatus={false}
          useKeyboardArrows
          onChange={handleSlideChange}
        >
          {cardEntries.map((entry) => (
            <ReactPlayer
              id={entry._id}
              key={entry._id}
              url={entry.url}
              playing={entry.playing}
              muted={entry.muted}
              controls
              loop
              height="100%"
              width="100%"
            />
          ))}
        </Carousel>
      </div>
    </Layout>
  );
}
