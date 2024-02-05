import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../../utils/interceptor";
import { store } from "shared/redux/store";

const GetMou = () => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint + Endpoint.partner.mou.get
  );
};

const SignMou = (params: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.mou.sign,
    params
  );
};

const DeclineMou = (id: string) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.mou.decline + id
  );
};

export { GetMou, SignMou, DeclineMou };
