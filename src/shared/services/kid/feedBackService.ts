import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const getFeedBacks = () => {
  return HTTP_CLIENT.get(Endpoint.kid.feedback.feedback);
};

export { getFeedBacks };
