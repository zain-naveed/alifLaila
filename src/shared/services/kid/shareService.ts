import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const getShareInfo = ({ id }: any) => {
  return HTTP_CLIENT.get(Endpoint.kid.share.getShareInfo + `${id}`);
};

export { getShareInfo };
