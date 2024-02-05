import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

interface PlansHistoryProps {
  page: number;
  search: string;
  status?: string;
  subscribe_id?: string
}

const getPlans = () => {
  return HTTP_CLIENT.get(Endpoint.general.plans);
};

const buyPlan = (body: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.plans.buy, body);
};

const getCurrentPlan = () => {
  return HTTP_CLIENT.get(Endpoint.kid.plans.activePlan);
};

const buyCoins = (body: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.plans.buyCoins, body);
};

const uploadReceiptInfo = (body: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.plans.uploadTransactionSlip, body);
};

const getPlansHistory = ({ page, search, status }: PlansHistoryProps) => {
  let params = "";
  if (status !== "" && status) {
    params = `?page=${page}&search=${search}&status=${status}`;
  } else {
    params = `?page=${page}&search=${search}`;
  }
  return HTTP_CLIENT.get(Endpoint.kid.plans.history + params);
};

const getTransactionsHistory = ({
  page,
  search,
  status,
  subscribe_id
}: PlansHistoryProps) => {
  let params = "";
  
  if (status !== "" && status) {
    params = `?page=${page}&search=${search}&status=${status}`;
  } else if (subscribe_id !== "" && subscribe_id) {
    params = `?page=${page}&search=${search}&subscribe_id=${subscribe_id}`;
  } else {
    params = `?page=${page}&search=${search}`
  }
  
  return HTTP_CLIENT.get(Endpoint.kid.plans.transactionHistory + params);
};

const getTopUps = () => {
  return HTTP_CLIENT.get(Endpoint.kid.plans.topUps);
};

const getTopUpsHistory = (id: any) => {
  return HTTP_CLIENT.get(Endpoint.kid.plans.topUpsHistory + id);
};

export {
  getPlans,
  buyPlan,
  getCurrentPlan,
  buyCoins,
  getTopUps,
  getPlansHistory,
  getTopUpsHistory,
  uploadReceiptInfo,
  getTransactionsHistory,
};
