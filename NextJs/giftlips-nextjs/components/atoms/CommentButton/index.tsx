import React from "react";
import styles from "./comment.module.css";

const CommentButton = ({
  id,
  onClick,
}: {
  id: string;
  onClick: () => void;
}) => {
  return (
    <div className="chatBox">
      <div className="likeBtnBox">
        <span id={`comment-count-${id}`}>0</span>
        <button
          className={styles.comment}
          style={{ zIndex: 5, marginLeft: "3px" }}
          onClick={() => {
            onClick();
          }}
        >
          <span>
            <i
              id={`coment-icon-heart-${id}`}
              className={`bi bi-chat text-light`}
            ></i>
          </span>
        </button>
      </div>
    </div>
  );
};

export default CommentButton;
