import { useEffect, useState } from "react";
import BoxLoader from "shared/loader/box";
import { getSingleBookStats } from "shared/services/publisher/bookService";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";

function BookStatistics({ bookDetail }: any) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    getSingleBookStats(bookDetail?.id)
      .then(({ data: { data, status } }) => {
        if (status) {
          setStats(data);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div
      className={classNames("d-flex flex-column align-items-center w-100 py-2")}
    >
      <div className={classNames("d-flex p-4 flex-wrap gap-3 w-100")}>
        <BookInfoItem
          heading={"Borrow"}
          value={stats?.borrow_count}
          loading={loading}
        />
        <BookInfoItem
          heading={"Life Time Buy"}
          value={stats?.buy_count}
          loading={loading}
        />
        <BookInfoItem
          heading={"Sales"}
          value={stats?.sales_count}
          loading={loading}
        />
        <BookInfoItem
          heading={"Total Coins"}
          value={stats?.total_coins}
          loading={loading}
        />
      </div>
      <div className={classNames(styles.seperator)} />
      <div className={classNames("d-flex p-4 flex-wrap gap-3 w-100")}>
        <BookInfoItem
          heading={"Views"}
          value={stats?.views_count}
          loading={loading}
        />
        <BookInfoItem
          heading={"Complete Rate"}
          value={stats?.complete_count}
          loading={loading}
        />
        <BookInfoItem
          heading={"Quiz Attempted"}
          value={stats?.quiz_attempt_count}
          loading={loading}
        />
      </div>
    </div>
  );
}
interface BookProps {
  heading: string;
  value: string | number;
  loading: boolean;
}
const BookInfoItem = (props: BookProps) => {
  const { heading, value, loading } = props;
  return (
    <>
      <div
        className={classNames(
          "d-flex flex-column align-items-start",
          styles.contentContainer
        )}
      >
        <label className={classNames(styles.bookItemHeading)}>{heading}</label>

        {loading ? (
          <BoxLoader iconStyle={classNames(styles.statsLoader)} />
        ) : (
          <span>{value}</span>
        )}
      </div>
    </>
  );
};

export default BookStatistics;
