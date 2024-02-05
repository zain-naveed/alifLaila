import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../../utils/interceptor";
import { store } from "shared/redux/store";

const getPubliserBook = (params: any, page: any) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint +
      Endpoint.partner.book.allBook +
      `?page=${page}`,
    params
  );
};
const getPubliserBookDetail = (bookId?: string) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.book.bookDetail +
      bookId
  );
};
const addBook = (params: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.book.addBook,
    params
  );
};
const updateBook = (params: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.book.updateBook,
    params
  );
};
const uploadBook = (params: {}, config: any) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.book.uploadBook,
    params,
    config
  );
};
const getGenreList = () => {
  return HTTP_CLIENT.get(Endpoint.partner.book.genreList);
};
const getTagList = () => {
  return HTTP_CLIENT.get(Endpoint.partner.book.tagList);
};
const getLangList = () => {
  return HTTP_CLIENT.get(Endpoint.partner.book.languateList);
};
const getAgeRangeList = () => {
  return HTTP_CLIENT.get(Endpoint.partner.book.ageRange);
};
const getBookPreviewList = (id: string) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.book.bookPreviewAll +
      id +
      "/all"
  );
};
const deleteBook = (formBody: any) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.book.deleteBook,
    formBody
  );
};
const submitRevision = (params: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint +
      Endpoint.partner.book.submitRevision,
    params
  );
};
const getRevisions = (id: any, page: any) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.book.revisions +
      id +
      `?page=${page}`
  );
};
const getSingleBookStats = (bookId: string) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.book.singleBookStats.replace(":id", bookId)
  );
};
export {
  getPubliserBook,
  uploadBook,
  addBook,
  getGenreList,
  getTagList,
  getLangList,
  getAgeRangeList,
  getPubliserBookDetail,
  getBookPreviewList,
  deleteBook,
  updateBook,
  submitRevision,
  getRevisions,
  getSingleBookStats,
};
