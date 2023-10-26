import Image from "next/image";
import audioIcon from "../../public/images/audio-tune-icon.svg";
import { Button } from "react-bootstrap";

const EntryGallery = ({ card, entries, userId, handleDeleteVideo }: any) => {
  return (
    <>
      {entries?.map((entry: any) => (
        <div
          className="col-lg-3 pb-3 col-md-4 col-sm-4 col-6 "
          key={entry?._id}
        >
          <div className="position-relative width-fit-content">
            <Image
              src={entry?.thumbnailUrl || audioIcon}
              alt="thumbnail image"
              className={
                entry?.thumbnailUrl ? "thumbnailImage" : "thumbnailImageAudio"
              }
              width={128}
              height={128}
            />

            {(userId && (card?.userId === userId || entry?.userId?._id === userId)) && (
              <Button
                onClick={() => handleDeleteVideo(entry?._id)}
                className="position-absolute p-0 rounded-circle border border-danger bg-light text-danger thumbnailImageDelete"
              >
                <i className="bi bi-trash"></i>
              </Button>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default EntryGallery;
