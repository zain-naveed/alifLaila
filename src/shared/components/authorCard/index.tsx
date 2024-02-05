import { defaultAvatar } from "assets";
import classNames from "classnames";
import Image from "next/image";
import styles from "./style.module.scss";
import { useRouter } from "next/router";
import { kidPanelConstant, routeConstant } from "shared/routes/routeConstant";
interface AuthorCardProps {
  isPublication?: any;
  item: any;
}

function AuthorCard({ item, isPublication }: AuthorCardProps) {
  const router = useRouter();
  return (
    <div
      className={classNames(
        styles.publisherCard,
        "d-flex flex-column align-items-center justify-content-center mt-4 position-relative"
      )}
      role="button"
      onClick={() => {
        router.push(kidPanelConstant.author.path.replace(":id", item?.id));
      }}
    >
      {isPublication && (
        <div className={styles.tag}>{isPublication?.publishing_house}</div>
      )}
      <img
        src={item?.profile_picture ? item?.profile_picture : defaultAvatar.src}
        alt="Image not found"
        className={classNames(styles.img)}
        height={1200}
        width={1120}
      />
      <label className={classNames(styles.title, "mt-3")}>
        {item?.full_name}
      </label>
      <p className={classNames(styles.subtitle, "mt-2 mb-0")}>
        {item?.books_count ? item?.books_count : 0} Books
      </p>
    </div>
  );
}

export default AuthorCard;
