import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const addKid = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.parent.dashboard.addKid, params);
};

const getKidsList = () => {
  return HTTP_CLIENT.get(Endpoint.parent.dashboard.getKids);
};

const activateKid = (id: any) => {
  return HTTP_CLIENT.post(Endpoint.parent.dashboard.activateKid + id);
};

const deActivateKid = (id: any) => {
  return HTTP_CLIENT.post(Endpoint.parent.dashboard.deActivateKid + id);
};

const assignCoins = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.parent.dashboard.assignCoins, params);
};

export { addKid, activateKid, deActivateKid, getKidsList, assignCoins };
