"use client";
import { LogoIcon } from "assets";
import classNames from "classnames";
import { useState } from "react";
import { SubscribeNewsletter } from "shared/services/generalService";
import CustomButton from "../customButton";
import CustomInput from "../customInput";
import { toastMessage } from "../toast";
import styles from "./style.module.scss";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = () => {
    if (!email) {
      return false;
    } else if (!email.includes("@")) {
      toastMessage("error", "Please enter valid email");
      return;
    }
    setLoading(true);
    SubscribeNewsletter({
      email: email,
    })
      .then(({ data: { status, message } }) => {
        if (status) {
          toastMessage("success", message);
          setEmail("");
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err: any) => {
        var errors = err.response.data.errors;
        if (errors) {
          for (var key in errors) {
            toastMessage("error", errors[key][0]);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div
      className={classNames(
        styles.newsLetterContainer,
        "d-flex flex-column-reverse flex-sm-row justify-content-center align-items-center gap-4 my-5"
      )}
    >
      <div
        className={classNames(
          styles.subscribeContainer,
          "d-flex flex-column align-items-center gap-3"
        )}
      >
        <label className={classNames(styles.label1)}>
          Stay upto date by <span className={styles.secondary}>joining</span>{" "}
          our <span className={styles.primary}>newsletter</span>
        </label>
        <label className={styles.label2}>
          Parents and Educators, subscribe to our newsletter to elevate your
          kids’ reading journey.
        </label>
        <div
          className={classNames(
            styles.inputArea,
            "d-flex flex-row justify-content-start gap-2"
          )}
        >
          <CustomInput
            placeholder="Enter your email"
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            type="email"
            value={email}
            onChange={handleChange}
          />
          <CustomButton
            title="Send"
            containerStyle={classNames(styles.btnStyle)}
            onClick={handleSubscribe}
            loading={loading}
            disabled={loading}
          />
        </div>
      </div>
      <div className={classNames(styles.logoArea)}>
        <LogoIcon className={classNames(styles.logo)} />
      </div>
    </div>
  );
};

export default NewsLetter;
