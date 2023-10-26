import React from "react";
import styles from "./Like.module.css";

const LikeButton = ({ id, onClick }: { id: string; onClick: () => void }) => {
  return (
    <div className="likeBox">
      <div className="likeBtnBox">
        <span id={`like-count-${id}`}>0</span>
        <button
          className={styles.like}
          style={{ zIndex: 5, marginLeft: "3px" }}
          onClick={() => {
            onClick();
          }}
        >
          <span>
            <i
              id={`like-icon-heart-${id}`}
              className={`bi-heart text-light`}
            ></i>
          </span>
        </button>
      </div>
    </div>
  );
};

export default LikeButton;
