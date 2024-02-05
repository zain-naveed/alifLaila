import classNames from "classnames";
import React, { useState } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import Rating from "shared/components/common/rating";

interface SingleTestimonialProps {
  name: string;
  role: string;
  feedback: string;
  rating: number;
  profile_picture: any;
  index: any;
}

const SingleTestimonial = ({
  name,
  role,
  feedback,
  rating,
  profile_picture,
  index,
}: SingleTestimonialProps) => {
  return (
    <div
      className={classNames(
        styles.testmonialContainer,
        "d-flex flex-column align-items-start justify-content-start py-4 px-4 gap-3"
      )}
      style={
        index % 2 === 0
          ? { borderColor: "#EF437B" }
          : { borderColor: "#F9A11B" }
      }
    >
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start gap-3"
        )}
      >
        <img
          alt="testimonial-user-pic"
          src={profile_picture}
          className={classNames(styles.assetStyle)}
          height={72}
          width={72}
        />
        <div
          className={classNames(
            "d-flex flex-column align-items-start justify-content-start"
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-2"
            )}
          >
            <label className={classNames(styles.userName)}>{name}</label>
            <div
              className={classNames(
                "d-sm-flex align-items-center justify-content-start gap-1 d-none"
              )}
            >
              <Rating active={rating} />
            </div>
          </div>
          <label className={classNames(styles.post)}>{role}</label>
        </div>
      </div>
      <div className={classNames("d-flex flex-column align-items-start gap-2")}>
        <div
          className={classNames(
            "d-flex d-sm-none align-items-center justify-content-start gap-1"
          )}
        >
          <Rating active={rating} />
        </div>
        <label className={classNames(styles.post)}>"{feedback}"</label>
      </div>
    </div>
  );
};

export default SingleTestimonial;
