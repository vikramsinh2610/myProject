import { useCallback, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import ReelEntry from "./ReelEntry";

const GLReels = ({ cardEntries, mockupPhone }: any) => {
  const [entries, setEntries] = useState<any[] | null>(null);
  const [lastPlayedEntry, setLastPlayedEntry] = useState<string | null>(null);
  const [phoneHeight, setPhoneHeight] = useState(0);

  useEffect(() => {
    setPhoneHeight(phoneHeight);
  }, [phoneHeight]);

  useEffect(() => {
    setEntries(
      cardEntries?.map((entry: any, i: number) => {
        if (i === 0) {
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
  }, [cardEntries]);

  const handleSlideChange = (index: number, item: any) => {
    if (entries) {
      setEntries(
        entries.map((entry: any) => {
          if (entry?._id === item.props.id) {
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
    }
  };

  const handlePlayer = useCallback(
    (id: string, playing: boolean, muted: boolean) => {
      if (entries) {
        setEntries(
          entries.map((entry: any) => {
            if (entry?._id === id) {
              return { ...entry, playing, muted };
            }

            return {
              ...entry,
              playing: false,
              muted: true,
            };
          })
        );
      }
    },
    [entries]
  );

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      let entry = entries?.find((entry: any) => entry?.playing === true);
      setLastPlayedEntry(entry?._id);

      if (lastPlayedEntry) {
        handlePlayer(lastPlayedEntry, false, true);
      }
    } else {
      if (lastPlayedEntry) {
        handlePlayer(lastPlayedEntry, true, false);
      }
    }
  }, [entries, handlePlayer, lastPlayedEntry]);

  // useEffect(() => {
  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [handleVisibilityChange]);

  return (
    <div
      className="tw-flex tw-items-center tw-justify-center tw-bg-black tw-h-screen"
      style={{ minHeight: `${mockupPhone ? "568" : phoneHeight}px` }}
    >
      {entries && entries.length === 0 && <span>No entries found.</span>}

      {entries && entries.length > 0 && (
        <Carousel
          className="tw-h-full"
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
          onChange={handleSlideChange}
        >
          {entries.map((entry: any, i: number) => (
            <ReelEntry
              id={entry?._id}
              key={entry?._id}
              entry={entry}
              description={`${i + 1}/${entries.length}`}
              handlePlayer={handlePlayer}
              mockupPhone={mockupPhone}
            />
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default GLReels;
