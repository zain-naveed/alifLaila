import { store } from "shared/redux/store";
import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const getPayments = (page: any, status?: any) => {
  if (status || status === 0) {
    return HTTP_CLIENT.get(
      store.getState().root.login?.endpoint +
        Endpoint.partner.wallet.payments +
        `?page=${page}&status=${status}`
    );
  } else {
    return HTTP_CLIENT.get(
      store.getState().root.login?.endpoint +
        Endpoint.partner.wallet.payments +
        `?page=${page}`
    );
  }
};

const getUserSpendings = (page: any, search: string, type?: any) => {
  if (type) {
    return HTTP_CLIENT.get(
      store.getState().root.login?.endpoint +
        Endpoint.partner.wallet.userSpendings +
        `?page=${page}&search=${search}&type=${type}`
    );
  } else {
    return HTTP_CLIENT.get(
      store.getState().root.login?.endpoint +
        Endpoint.partner.wallet.userSpendings +
        `?page=${page}&search=${search}`
    );
  }
};

const getBooksSales = (id: any) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.wallet.bookSales +
      id
  );
};

export { getPayments, getUserSpendings, getBooksSales };
