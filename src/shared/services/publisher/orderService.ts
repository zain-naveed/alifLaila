import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../../utils/interceptor";
import { store } from "shared/redux/store";

const GetOrdersList = (body: any, currentPage: any) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint +
      Endpoint.partner.order.list +
      `?page=${currentPage}`,
    body
  );
};
const GetOrderStats = () => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint + Endpoint.partner.order.stats
  );
};
const GetOrderDetail = (id: any) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.order.detail +
      `/${id}`
  );
};
const rejectOrder = (params: any) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.order.cancel,
    params
  );
};
const updateOrderStatus = (params: any) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.order.updateStatus,
    params
  );
};

export {
  GetOrdersList,
  GetOrderStats,
  GetOrderDetail,
  rejectOrder,
  updateOrderStatus,
};
