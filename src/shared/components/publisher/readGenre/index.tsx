import NoContentCard from "shared/components/common/noContentCard";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";

interface Props {
  mostReadGenres: any;
}

function ReadGenre(props: Props) {
  const { mostReadGenres } = props;

  return mostReadGenres && mostReadGenres?.length ? (
    mostReadGenres?.map(
      (
        item: {
          name: string;
        },
        inx: number
      ) => {
        return (
          <ReadGenreItem
            genreTitle={item?.name}
            genreIndex={inx + 1}
            isNotfirstItem={inx !== 0}
            isLast={inx == mostReadGenres.length - 1}
            key={inx}
          />
        );
      }
    )
  ) : (
    <NoContentCard
      customContainer={classNames(
        "d-flex flex-column align-items-center gap-0 w-100"
      )}
      customIconContianer={styles.noFavBookIcon}
      customLabel1Style={styles.noFavBookLabel1}
      customLabel2Style={styles.noFavBookLabel2}
      label1="No record Found"
      label2="There is no record available"
    />
  );
}

interface GenreItemProps {
  isNotfirstItem: boolean;
  isLast: boolean;
  genreIndex: number;
  genreTitle: string;
}

const ReadGenreItem = (props: GenreItemProps) => {
  const { isNotfirstItem, isLast, genreIndex, genreTitle } = props;
  return (
    <div
      className={classNames(
        "d-flex",
        styles.genreWrapper,
        isNotfirstItem ? styles.padingTop18 : "",
        !isLast ? styles.borderWithPaddingBottom : ""
      )}
    >
      <span className={classNames(styles.numItem)}>
        {genreIndex < 10 ? "0" + genreIndex : genreIndex}
      </span>
      <span className={classNames(styles.itemText)}>{genreTitle}</span>
    </div>
  );
};

export default ReadGenre;
