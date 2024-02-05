import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const getUser = () => {
  return HTTP_CLIENT.get(Endpoint.kid.user.profile);
};
const UpdateAddress = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.kid.user.updateAddress, params);
};
const getUserAddress = () => {
  return HTTP_CLIENT.get(Endpoint.kid.user.getAddress);
};
const getUserAchievements = () => {
  return HTTP_CLIENT.get(Endpoint.kid.user.getAchievements);
};
export { getUser, UpdateAddress, getUserAddress, getUserAchievements };
