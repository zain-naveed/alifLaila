import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";
interface PaginationProps {
  page: number;
  id: number;
  type: number;
  filter: string;
}

interface ProgressProps {
  page?: number;
  search?: string;
  sort_by?: string;
  take?: number;
}

const getBook = ({ id }: any) => {
  return HTTP_CLIENT.get(Endpoint.kid.book.getBook + `${id}`);
};
const allBookForKid = (filterBody: any, page: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.book.all + `?page=${page}`, filterBody);
};
const addBookFav = (body: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.book.bookFavorite, body);
};
const removeBookFav = (body: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.book.removeFavourite, body);
};
const getBookPreiview = (id: any) => {
  return HTTP_CLIENT.get(Endpoint.kid.book.bookPreview + id);
};
const trackBookPages = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.book.trackBook, params);
};
const bookFavList = (body: any, page: any) => {
  return HTTP_CLIENT.post(
    Endpoint.kid.book.bookFavList + `?page=${page}`,
    body
  );
};
const sharedBookList = (search: any, page: any, sort_by: any) => {
  return HTTP_CLIENT.get(
    Endpoint.kid.book.sharedBooks +
      `?page=${page}&search=${search}&sort_by=${sort_by}`
  );
};
const bookSharedList = (page: any) => {
  return HTTP_CLIENT.get(Endpoint.kid.book.sharedBooks + `?page=${page}`);
};
const getBookReviewList = ({ type, page, id, filter }: PaginationProps) => {
  return HTTP_CLIENT.get(
    Endpoint.kid.book.bookReviewList +
      `?book_id=${id}&type=${type}&page=${page}&sort_by=${filter}`
  );
};
const getBookSuggestionList = ({ take, page }: any) => {
  if (take) {
    return HTTP_CLIENT.get(Endpoint.kid.book.suggestion + `?take=${take}`);
  } else {
    return HTTP_CLIENT.get(Endpoint.kid.book.suggestion + `?page=${page}`);
  }
};
const getRatingStats = ({ id, type }: any) => {
  return HTTP_CLIENT.get(
    Endpoint.kid.book.ratingStats + `?book_id=${id}&type=${type}`
  );
};
const addRating = (body: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.book.addRating, body);
};
const myyBooksList = (body: any, page: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.book.myBooks + `?page=${page}`, body);
};
const buyBook = (body: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.book.buy, body);
};
const finishBook = (body: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.book.finishBook, body);
};
const getProgress = ({ page, search, sort_by, take }: ProgressProps) => {
  if (take) {
    return HTTP_CLIENT.post(Endpoint.kid.book.progress, {
      take: take,
    });
  } else {
    return HTTP_CLIENT.post(Endpoint.kid.book.progress + `?page=${page}`, {
      search: search,
      sort_by: sort_by,
    });
  }
};
const getFewBooks = (formBody: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.book.listFewBooks, formBody);
};
const getNewArrivalBooksList = ({ take, page }: any) => {
  if (take) {
    return HTTP_CLIENT.get(Endpoint.kid.book.newArrival + `?take=${take}`);
  } else {
    return HTTP_CLIENT.get(Endpoint.kid.book.newArrival + `?page=${page}`);
  }
};
const getBookAccess = ({ id }: any) => {
  return HTTP_CLIENT.get(Endpoint.kid.book.access + `/${id}`);
};

const markBookAsRead = ({ id }: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.book.markAsRead + `${id}`);
};

export {
  addBookFav,
  addRating,
  allBookForKid,
  bookFavList,
  buyBook,
  finishBook,
  getBook,
  getBookAccess,
  getBookPreiview,
  getBookReviewList,
  getBookSuggestionList,
  getFewBooks,
  getNewArrivalBooksList,
  getProgress,
  getRatingStats,
  myyBooksList,
  removeBookFav,
  trackBookPages,
  bookSharedList,
  sharedBookList,
  markBookAsRead,
};
