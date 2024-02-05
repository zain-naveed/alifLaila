import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../../utils/interceptor";
import { store } from "shared/redux/store";

const ChangePassword = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.partner.user.changePassword, params);
};

const UpdateProfile = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.partner.user.updateProfile, params);
};

const UpdateBankAccount = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.partner.user.updateBankAccount, params);
};

const GetBankDetails = () => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint + Endpoint.partner.user.bankDetails
  );
};

export { ChangePassword, UpdateProfile, UpdateBankAccount, GetBankDetails };
