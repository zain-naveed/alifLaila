import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../../utils/interceptor";
import { store } from "shared/redux/store";

interface FeaturBookListProps {
  page: number;
  search: string;
  status?: string;
}

const getPublishedBooks = (page: any, search: string) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.feature.getPublishedBooks +
      `?page=${page}&search=${search ? search : ""}`
  );
};

const getRecentCovers = (id: any) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.feature.getRecentCovers +
      "/" +
      id
  );
};

const requestFeature = (body: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.feature.request,
    body
  );
};

const getFeatureBookList = ({ page, search, status }: FeaturBookListProps) => {
  let params = "";
  if (status !== "" && status !== undefined) {
    params = `?page=${page}&search=${search}&status=${status}`;
  } else {
    params = `?page=${page}&search=${search}`;
  }
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.feature.getList +
      params
  );
};

const cancelRequest = (id: any) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint +
      Endpoint.partner.feature.cancel +
      "/" +
      id
  );
};

export {
  getPublishedBooks,
  getRecentCovers,
  requestFeature,
  getFeatureBookList,
  cancelRequest,
};
