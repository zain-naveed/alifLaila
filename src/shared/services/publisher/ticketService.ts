import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../../utils/interceptor";
import { store } from "shared/redux/store";

const getRoomId = () => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint + Endpoint.partner.chat.getRoomId
  );
};

const getList = () => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint + Endpoint.partner.chat.getList
  );
};

const getMessages = (roomId: number) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.chat.getMessages +
      roomId
  );
};

const sendMessage = (params: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.chat.sendMessage,
    params
  );
};

const createTicket = (params: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.chat.createTicket,
    params
  );
};

const closeTicket = (id: any) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint +
      Endpoint.partner.chat.closeTicket +
      id
  );
};

export {
  getRoomId,
  getMessages,
  sendMessage,
  getList,
  createTicket,
  closeTicket,
};
