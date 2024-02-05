import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import classNames from "classnames";
import { useRouter } from "next/router";
import { kidPanelConstant } from "shared/routes/routeConstant";
import { defaultAvatar } from "assets";
interface publisherInterface {
  publishing_logo: any;
  publishing_house: string;
  books_count: number;
  id: number;
}

function PublisherCard(props: publisherInterface) {
  const { publishing_logo, publishing_house, books_count, id } = props;
  const [color, setColor] = useState<any>("#FFEBFF");
  const colors = ["#E1FCFF", "#FFEBFF", "#FFF7EB", "#FDFFEB", "#FFF2FA"];
  const router = useRouter();

  useEffect(() => {
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, [id]);

  return (
    <div
      className={classNames(
        styles.publisherCard,
        "d-flex flex-column align-items-center justify-content-center mt-4"
      )}
      role="button"
      onClick={() => {
        router.push(kidPanelConstant.publisher.path.replace(":id", String(id)));
      }}
      style={{ backgroundColor: color }}
    >
      <img
        src={publishing_logo ? publishing_logo : defaultAvatar.src}
        alt="Image not found"
        className={classNames(styles.img)}
        height={1200}
        width={1120}
      />
      <label className={classNames(styles.title, "mt-3")}>
        {publishing_house}
      </label>
      <p className={classNames(styles.subtitle, "mt-2 mb-0")}>
        {books_count} Book{books_count > 1 || books_count === 0 ? "s" : ""}
      </p>
    </div>
  );
}

export default PublisherCard;
