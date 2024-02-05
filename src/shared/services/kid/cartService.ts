import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const getCartList = () => {
  return HTTP_CLIENT.get(Endpoint.kid.cart.list);
};
const addToCart = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.cart.add, params);
};
const increaseQuantity = (id: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.cart.changeQuantity + id + `/increase`);
};
const decreaseQuantity = (id: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.cart.changeQuantity + id + `/decrease`);
};
const removefromCart = (id: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.cart.remove + id);
};
const getCartCount = () => {
  return HTTP_CLIENT.get(Endpoint.kid.cart.count);
};

const checkout = () => {
  return HTTP_CLIENT.post(Endpoint.kid.cart.checkout);
};

const getOrderList = (page: any, search: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.cart.orderList + `?page=${page}`, {
    search: search,
  });
};

const cancelOrder = (body: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.cart.cancelOrder, body);
};

export {
  addToCart,
  getCartList,
  increaseQuantity,
  decreaseQuantity,
  removefromCart,
  getCartCount,
  checkout,
  getOrderList,
  cancelOrder,
};
