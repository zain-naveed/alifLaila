import { store } from "shared/redux/store";
import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const addAuthors = (params: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.authors.create,
    params
  );
};

const updateAuthors = (params: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.authors.update,
    params
  );
};

const getAuthorsList = ({ page, search, filter }: any) => {
  if (filter) {
    return HTTP_CLIENT.get(
      store.getState().root.login?.endpoint +
        Endpoint.partner.authors.list +
        `?page=${page}&search=${search}` +
        filter
    );
  } else {
    return HTTP_CLIENT.get(
      store.getState().root.login?.endpoint +
        Endpoint.partner.authors.list +
        `?page=${page}&search=${search}`
    );
  }
};

const activateAuthor = (id: any) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint +
      Endpoint.partner.authors.activate +
      id
  );
};

const deActivateAuthor = (id: any) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint +
      Endpoint.partner.authors.deActivate +
      id
  );
};

const getAuthorsBook = (params: any, page: any, id: any) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint +
      Endpoint.partner.authors.books +
      id +
      `/books?page=${page}`,
    params
  );
};

const getPartnerAuthorPayments = (page: any, authorId: any, status?: any) => {
  if (status || status === 0) {
    return HTTP_CLIENT.get(
      store.getState().root.login?.endpoint +
        Endpoint.partner.authors.payments.replace(":id", authorId) +
        `?page=${page}&status=${status}`
    );
  } else {
    return HTTP_CLIENT.get(
      store.getState().root.login?.endpoint +
        Endpoint.partner.authors.payments.replace(":id", authorId) +
        `?page=${page}`
    );
  }
};

const getPartnerAuthorBooksSales = (authorId: any, payment_id: any) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.authors.bookSales
        .replace(":id", authorId)
        .replace(":payment_id", payment_id)
  );
};

const sendAuthorsPayments = (params: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint +
      Endpoint.partner.authors.sendPayment,
    params
  );
};

export {
  addAuthors,
  updateAuthors,
  getAuthorsList,
  activateAuthor,
  deActivateAuthor,
  getAuthorsBook,
  getPartnerAuthorPayments,
  getPartnerAuthorBooksSales,
  sendAuthorsPayments,
};
