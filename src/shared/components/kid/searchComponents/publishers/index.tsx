import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import classNames from "classnames";
import Image from "next/image";
import { defaultAvatar } from "assets";
import CustomPagination from "shared/components/kid/customPagination";
import { getPublishersList } from "shared/services/kid/publisherService";
import { useRouter } from "next/router";
import BoxLoader from "shared/loader/box";
import NoContentCard from "shared/components/common/noContentCard";
import { kidPanelConstant } from "shared/routes/routeConstant";

interface PublishersProps {
  total: number;
  setTotal: (val: number) => void;
}

const Publishers = ({ total, setTotal }: PublishersProps) => {
  const router = useRouter();
  const [publishers, setPublishers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const colors = ["#E1FCFF", "#FFEBFF", "#FFF7EB", "#FDFFEB", "#FFF2FA"];

  const getPublishers = () => {
    getPublishersList({
      page: currentPage,
      search: router?.query?.text,
      limit: 20,
    })
      .then(
        ({
          data: {
            data: { data, total },
            status,
            message,
          },
        }) => {
          if (status) {
            setPublishers(data);
            setTotal(total);
          }
        }
      )
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    setPublishers([]);
    getPublishers();
  }, [router?.query?.text, currentPage]);

  return (
    <div
      className={classNames(styles.customContainer, "px-3 px-sm-0 mt-5 w-100")}
    >
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start flex-wrap gap-3 gap-md-4 gap-lg-5"
        )}
      >
        {loading ? (
          Array.from(Array(10).keys()).map((itm, inx) => {
            return (
              <div
                className={classNames(styles.pubContainer)}
                key={inx}
                style={{ border: "1px solid #e5e4e2" }}
              >
                <BoxLoader iconStyle={classNames(styles.avatar)} />
                <BoxLoader iconStyle={classNames(styles.titleLoader)} />
                <BoxLoader iconStyle={classNames(styles.countLoader)} />
              </div>
            );
          })
        ) : (
          <>
            {publishers?.length > 0 ? (
              <>
                {publishers?.map((itm, inx) => {
                  return (
                    <div
                      className={classNames(styles.pubContainer)}
                      style={{
                        backgroundColor:
                          colors[Math.floor(Math.random() * colors.length)],
                      }}
                      key={inx}
                      role="button"
                      onClick={() => {
                        router.push(
                          kidPanelConstant.publisher.path.replace(
                            ":id",
                            itm?.id
                          )
                        );
                      }}
                    >
                      <img
                        src={
                          itm?.publishing_logo
                            ? itm?.publishing_logo
                            : defaultAvatar.src
                        }
                        className={classNames(styles.avatar)}
                        alt="publisher-pic"
                        height={100}
                        width={100}
                      />
                      <label className={classNames(styles.title)} role="button">
                        {itm?.publishing_house}
                      </label>
                      <label className={classNames(styles.count)} role="button">
                        {itm?.books_count} Book{itm?.books_count > 1 ? "s" : ""}
                      </label>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className={classNames("w-100")}>
                <NoContentCard label1="No Publisher Found" />
              </div>
            )}
          </>
        )}
      </div>
      <div
        className={classNames(
          "w-100 d-flex align-items-center justify-content-center mt-4"
        )}
      >
        <CustomPagination
          currentPage={currentPage}
          totalCount={total}
          pageSize={20}
          onPageChange={(page: any) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Publishers;
