import ReactPlayer from "react-player";
import { MdPause, MdPlayArrow, MdVolumeOff, MdVolumeUp } from "react-icons/md";
import { FaCommentDots, FaHeart } from "react-icons/fa";
import { useRef, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import http from "../../services/http.service";
import { devLogError } from "../../helpers/logger";

let url: string = process.env.NEXT_PUBLIC_SERVICE_BASE_URL as string;

if (process.env.NEXT_PUBLIC_SERVICE_BASE_URL) {
  url = process.env.NEXT_PUBLIC_SERVICE_BASE_URL;
}

const socket = io(url);

const ReelEntry = ({ entry, description, handlePlayer, mockupPhone }: any) => {
  const playerRef: any = useRef(null);
  const [playerProgress, setPlayerProgress] = useState(0);
  const session: any = useSession();
  const [cardMember, setCardMember] = useState<any>(null);
  const [commentList, setCommentList] = useState<any>("");
  const [height, setHeight] = useState(0);

  if (session.status === "authenticated") {
    socket.emit("joinRoom", {
      cardId: entry?.cardId,
      userId: session.data?.user?.id,
    });

    socket.on("likeResult", (response: any) => {
      updateLikeCounter(response?.data);

      let btnLike: any = document.getElementById(
        `like-${response?.data?.entryId}`
      );

      if (response?.message === "Video is liked.") {
        btnLike.classList.remove("tw-text-slate-50");
        btnLike.classList.add("tw-text-red-600");
      }

      if (response?.message === "Video is unliked.") {
        btnLike.classList.remove("tw-text-red-600");
        btnLike.classList.add("tw-text-slate-50");
      }
    });

    socket.on("comment", (response: any) =>
      updateCommentCounter(response?.data)
    );
  }

  const getCardMember = async () => {
    if (session.status === "authenticated") {
      localStorage.setItem("user", JSON.stringify(session.data));
    }

    try {
      let response = await http.get(
        `/card-members/${entry?.cardId}/get-by-card-id`
      );
      setCardMember(response?.data);
    } catch (error: any) {
      devLogError(error);
    }
  };

  const getLikes = async () => {
    try {
      let resultLike = await http.get(`/entries/${entry?._id}/getLikes`);
      let getLikeduser = resultLike?.data?.data?.like;
      let result: any = "";

      if (getLikeduser.length > 0) {
        result = getLikeduser.find(
          (X: any) => X._id === session.data?.user?.id
        );
      }

      if (result) {
        let btnLike: any = document.getElementById(
          `like-${resultLike?.data?.data?.entryId}`
        );

        if (
          resultLike?.data?.data?.like.length > 0 &&
          result?._id === session.data?.user?.id
        ) {
          btnLike.classList.remove("tw-text-slate-50");
          btnLike.classList.add("tw-text-red-600");
        }
      }

      updateLikeCounter(resultLike?.data?.data);
    } catch (error: any) {
      devLogError(error);
    }
  };

  const getComments = async () => {
    try {
      let res = await http.get(`/entries/${entry?._id}/getComments`);
      setCommentList(res?.data?.data?.comments);
      updateCommentCounter(res?.data?.data);
    } catch (error: any) {
      devLogError(error);
    }
  };

  const updateLikeCounter = (likesData: any) => {
    let countLikes = 0;

    if (likesData?.videoCount) {
      countLikes = likesData?.videoCount;
    } else if (likesData?.like) {
      countLikes = likesData?.like?.length;
    } else {
      countLikes = 0;
    }

    const likeCount: any = document.getElementById(
      `like-count-${likesData?.entryId}`
    );
    likeCount.innerText = countLikes === undefined ? 0 : `${countLikes}`;
  };

  const updateCommentCounter = (comments: any) => {
    let countcomment = comments?.comments.length;
    const commentCount: any = document.getElementById(
      `comment-count-${comments?.entryId}`
    );
    commentCount.innerText =
      countcomment === undefined ? `${0}` : `${countcomment}`;
  };

  const updateCommentList = (comments: any) => {
    const AllComments: any = document.getElementById(
      `comment-list-${entry?._id}`
    );
    let commnetInnerHtml = "";
    commnetInnerHtml += `
        <div className="commentBox" style="margin-bottom: 15px;
        border: 1px solid #333;
        padding: 4px 8px;
        border-radius: 0 8px 8px 8px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;">
          <h6 style="font-size: 12px;
          margin-top: -10px;
          background: #000;
          padding: 0 6px;
          margin-left: -5px;
          display: inline-block;
          margin-bottom: 3px;">
          ${session.data?.user?.firstName}
          </h6>
          <p style="font-size: 13px;
          color: #bbb;
          margin: 0;
          display: inline-block;
          word-break: break-word;">
          ${comments}
          </p>
        </div>
        `;
    AllComments.innerHTML += commnetInnerHtml;

    let commentPost: any = document.getElementById(
      `comment-text-${entry?._id}`
    );
    commentPost.value = "";
  };

  const openCommentsModal = () => {
    const commentModal: any = document.getElementById(
      `comment-modal-${entry?._id}`
    );

    if (commentModal.classList.contains("d-none")) {
      commentModal.classList.remove("d-none");
    } else {
      commentModal.classList.add("d-none");
    }
  };

  useEffect(() => {
    setHeight(window.innerHeight);
    void getCardMember();
    void getLikes();
    void getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clickLike = () => {
    socket.emit("likeVideo", {
      cardId: entry?.cardId,
      userId: session.data?.user?.id,
      entryId: entry?._id,
      cardMemberId: cardMember?._id,
    });
  };

  const clickComment = (comment: string) => {
    updateCommentList(comment);
    socket.emit("addComment", {
      cardId: entry?.cardId,
      userId: session.data?.user?.id,
      entryId: entry?._id,
      cardMemberId: cardMember?._id,
      comments: {
        user: session.data?.user?.id,
        message: comment,
      },
    });
  };

  const handleSend = () => {
    const commentPost: any = document.getElementById(
      `comment-text-${entry?._id}`
    );

    if (commentPost?.value.length > 0) {
      clickComment(commentPost?.value);
    } else {
      return true;
    }
  };

  return (
    <div className="tw-relative tw-prose tw-mx-auto tw-flex tw-flex-col">
      <div className="tw-absolute tw-w-full tw-p-4">
        <div className="tw-flex tw-items-center tw-justify-between">
          {entry.playing ? (
            <MdPause
              onClick={() => handlePlayer(entry?._id, false, true)}
              className="tw-h-6 tw-w-6 tw-text-slate-50"
              type="button"
            />
          ) : (
            <MdPlayArrow
              onClick={() => handlePlayer(entry?._id, true, false)}
              className="tw-h-6 tw-w-6 tw-text-slate-50"
              type="button"
            />
          )}

          {entry.muted ? (
            <MdVolumeOff
              onClick={() => handlePlayer(entry?._id, true, false)}
              className="tw-h-6 tw-w-6 tw-text-slate-50"
              type="button"
            />
          ) : (
            <MdVolumeUp
              onClick={() => handlePlayer(entry?._id, false, true)}
              className="tw-h-6 tw-w-6 tw-text-slate-50"
              type="button"
            />
          )}
        </div>
      </div>

      <div
        className="tw-relative"
        style={{ height: `${mockupPhone ? "568" : height}px` }}
        onClick={() => handlePlayer(entry?._id, !entry.playing, !entry.muted)}
      >
        <ReactPlayer
          ref={playerRef}
          url={entry.url}
          playing={entry.playing}
          muted={entry.muted}
          onProgress={(progress: any) =>
            setPlayerProgress(progress.playedSeconds)
          }
          loop
          playsinline
          height="100%"
          width="100%"
        />
      </div>

      <div className="tw-absolute tw-bottom-1 tw-w-full tw-p-4">
        <div className="tw-flex tw-items-center tw-justify-between">
          <div className="tw-text-slate-50">{description}</div>

          {session.status === 'authenticated' && (
            <div className="tw-flex tw-gap-4">
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center">
                <FaHeart
                  id={`like-${entry?._id}`}
                  className="tw-h-6 tw-w-6 tw-text-slate-50"
                  type="button"
                  onClick={() => clickLike()}
                />
                <span
                  id={`like-count-${entry?._id}`}
                  className="tw-dui-badge tw-dui-badge-sm"
                />
              </div>
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center">
                <FaCommentDots
                  className="tw-h-6 tw-w-6 tw-text-slate-50"
                  type="button"
                  onClick={() => openCommentsModal()}
                />
                <span
                  id={`comment-count-${entry?._id}`}
                  className="tw-dui-badge tw-dui-badge-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <progress
        className="tw-dui-progress tw-dui-progress-error tw-absolute tw-bottom-0 tw-h-[1px] tw-w-full"
        value={playerProgress}
        max={playerRef.current?.getDuration()}
      />

      <div
        id={`comment-modal-${entry?._id}`}
        className="chatBlock openComment d-none tw-prose tw-mx-auto"
        style={{ height: `${mockupPhone ? "568" : height}px` }}
      >
        <div className="chatBlock__data">
          <div className="chatBlock__header tw-px-4 tw-py-2">
            <h5 className="chatBlock__title">Comments</h5>
            <button
              className="chatBlock__header-btn"
              onClick={() => openCommentsModal()}
            >
              Close
            </button>
          </div>

          <div className="chatBlock__content" id={`comment-list-${entry?._id}`}>
            {commentList &&
              commentList.map((comment: any) => (
                <>
                  {comment.message && (
                    <div key={comment._id} className="commentBox">
                      <h6>
                        {comment.user.firstName[0].toUpperCase() +
                          comment.user.firstName.slice(1)}
                      </h6>
                      <p>
                        {comment.message[0].toUpperCase() +
                          comment.message.slice(1)}
                      </p>
                    </div>
                  )}
                </>
              ))}
          </div>

          <div className="chatBlock__form">
            <input
              id={`comment-text-${entry?._id}`}
              type="text"
              placeholder="Add a comment..."
            />
            <button onClick={handleSend}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelEntry;
