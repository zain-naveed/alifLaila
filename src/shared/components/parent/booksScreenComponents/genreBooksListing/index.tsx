import { NoFavBookIcon } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import NoContentCard from "shared/components/common/noContentCard";
import BookCard from "shared/components/parent/bookCard";
import BookLoader from "shared/loader/pageLoader/kid/books";
import { getFewBooks } from "shared/services/kid/bookService";
import { genreColors } from "shared/utils/pageConstant/landingPageConstant";
import styles from "./style.module.scss";
import { useRouter } from "next/router";
import { parentPanelConstant } from "shared/routes/routeConstant";
import { TabsEnums } from "shared/utils/pageConstant/parent/booksConstants";

interface GenreBookListingCardProps {
  genres: any;
}

const GenreBookListingCard = ({ genres }: GenreBookListingCardProps) => {
  const {
    sidebar: { isShown },
  } = useSelector((state: any) => state.root);
  const router = useRouter();
  const timeoutRef = useRef<any>(null);
  const activeIndexRef = useRef<any>(0);
  const genreListRef = useRef<any>([]);
  const [activeGenre, setActiveGenre] = useState<any>(null);
  const [genreList, setGenreList] = useState<any>([]);
  const [booksList, setBooksList] = useState([]);
  const [booksLoading, setBooksLoading] = useState<boolean>(true);

  const navigateHandler = () => {
    router.push({
      pathname: parentPanelConstant.books.path,
      query: { keyword: TabsEnums.allBooks },
    });
  };

  const handleBookClick = (id: any) => {
    router.push(parentPanelConstant.preview.path.replace(":id", id));
  };

  const handleGetGenreList = () => {
    let temp: any = genres?.data ? [...genres?.data] : [];
    let i = 0;
    for (let k = 0; k < temp.length; k++) {
      temp[k]["color"] = genreColors[i];
      if (i !== genreColors.length - 1) {
        i++;
      } else {
        i = 0;
      }
    }
    setGenreList(temp);
    genreListRef.current = temp;
    handleGetBookList(genres?.data?.[0]?.id);
    setActiveGenre(genres?.data?.[0]);
  };

  const handleGetBookList = (genreId: number) => {
    setBooksLoading(true);
    let formData = new FormData();
    formData.append("take", "10");
    formData.append("genres[]", String(genreId));
    getFewBooks(formData)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          setBooksList(data);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
              if (activeIndexRef.current !== genreListRef.current.length - 1) {
                activeIndexRef.current += 1;
              } else {
                activeIndexRef.current = 0;
              }
              handleGetBookList(
                genreListRef.current[activeIndexRef.current]?.id
              );
              setActiveGenre(genreListRef.current[activeIndexRef.current]);
              scroll(activeIndexRef.current);
            }, 10000);
          } else {
            timeoutRef.current = setTimeout(() => {
              if (activeIndexRef.current !== genreListRef.current.length - 1) {
                activeIndexRef.current += 1;
              } else {
                activeIndexRef.current = 0;
              }
              handleGetBookList(
                genreListRef.current[activeIndexRef.current]?.id
              );
              setActiveGenre(genreListRef.current[activeIndexRef.current]);
              scroll(activeIndexRef.current);
            }, 10000);
          }
        }
      })
      .catch((err) => {})
      .finally(() => {
        setBooksLoading(false);
      });
  };

  const scroll = (newindex: number) => {
    var elem: any = document?.getElementById(`genre-list-container`);
    var imgElem: any = document?.getElementById(`genre${newindex}`);
    if (elem) {
      const scrollRect = elem?.getBoundingClientRect();
      const activeRect = imgElem?.getBoundingClientRect();
      elem.scrollLeft =
        elem?.scrollLeft +
        (activeRect?.left -
          scrollRect?.left -
          scrollRect?.width / 2 +
          activeRect?.width / 2);
    }
  };

  useEffect(() => {
    handleGetGenreList();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div className={classNames(styles.genreBookContainer, "my-5 py-5")}>
      <div
        className={classNames(
          styles.customContainer,
          "px-3 px-sm-0 d-flex align-items-center flex-column justify-content-center w-100"
        )}
      >
        <label className={classNames(styles.title)}>
          Explore books by <span>Genre</span>
        </label>
        <div
          className={classNames(
            styles.genreFilterContainer,
            "mt-0  mt-xxl-3 justify-content-center "
          )}
        >
          <div
            className={classNames(styles.filterContainer)}
            id="genre-list-container"
          >
            {genres?.data?.map((itm: any, inx: any) => {
              return (
                <div
                  className={classNames(styles.filter)}
                  key={inx}
                  id={`genre${inx}`}
                  onClick={() => {
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                    }
                    setActiveGenre(itm);
                    activeIndexRef.current = inx;
                    handleGetBookList(itm?.id);
                    scroll(activeIndexRef.current);
                  }}
                  role="button"
                  style={
                    activeGenre?.name === itm?.name
                      ? {
                          backgroundColor: itm?.color,
                          zIndex: genreList?.length,
                        }
                      : {
                          zIndex: genreList?.length - inx,
                          borderBottom: `2px solid ${activeGenre?.color}`,
                        }
                  }
                >
                  <span
                    className={classNames(
                      styles.filterLabel,
                      activeGenre?.name === itm?.name &&
                        styles.filterLabelActive
                    )}
                    style={
                      activeGenre?.name !== itm?.name
                        ? { color: itm?.color }
                        : { color: "white" }
                    }
                    role="button"
                  >
                    {itm?.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {booksLoading ? (
          <div
            className={classNames(
              "w-100 d-flex align-items-center justify-content-start flex-wrap"
            )}
          >
            <BookLoader
              Iteration={10}
              customContainer={classNames("mt-4 mt-lg-5")}
              isQuartor={isShown}
              isParentModule={true}
            />
          </div>
        ) : (
          <>
            {booksList?.length < 1 && !booksLoading ? (
              <div
                className={classNames(
                  "col-12 d-flex align-items-center justify-content-start flex-wrap gap-4 p-0 px-md-2 mt-4 mt-lg-5"
                )}
              >
                <NoContentCard
                  customContainer={classNames(
                    "d-flex flex-column align-items-center gap-0 w-100"
                  )}
                  Icon={NoFavBookIcon}
                  label1="No Books found"
                  label2="There is no Book available in this genre"
                />
              </div>
            ) : (
              <div
                className={classNames(
                  "w-100 d-flex align-items-start justify-content-start flex-wrap position-relative"
                )}
                id="parent-genre-book-list-container"
              >
                {booksList?.map((itm: any, inx: any) => {
                  return (
                    <BookCard
                      item={itm}
                      key={inx}
                      index={inx}
                      onClick={() => handleBookClick(itm?.id)}
                      customContainerStyle={classNames("mt-4 mt-lg-5")}
                      parentElementId="parent-genre-book-list-container"
                      isQuator={isShown}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
        {booksList?.length > 0 && !booksLoading ? (
          <CustomButton
            title="View All Books"
            containerStyle={classNames(styles.viewAllBooksBtn, "mt-4 mt-md-5")}
            role="button"
            onClick={navigateHandler}
          />
        ) : null}
      </div>
    </div>
  );
};

export default GenreBookListingCard;
