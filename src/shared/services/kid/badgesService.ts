import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const getBadgesList = () => {
  return HTTP_CLIENT.get(Endpoint.kid.badges.listAll);
};

export { getBadgesList };
