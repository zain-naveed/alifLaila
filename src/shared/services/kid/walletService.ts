import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const getWallet = () => {
  return HTTP_CLIENT.get(Endpoint.kid.wallet.wallet);
};

const getWalletHistory = (page: any, search: any, id?: any) => {
  if (id) {
    return HTTP_CLIENT.post(
      Endpoint.kid.wallet.history + `/` + id + `?page=${page}`,
      {
        search: search,
      }
    );
  } else {
    return HTTP_CLIENT.post(Endpoint.kid.wallet.history + `?page=${page}`, {
      search: search,
    });
  }
};

export { getWallet, getWalletHistory };
