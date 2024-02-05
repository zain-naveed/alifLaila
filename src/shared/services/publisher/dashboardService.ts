import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../../utils/interceptor";
import { store } from "shared/redux/store";

const GetDashboardData = () => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.dashboard.getDashboardStats
  );
};

const GetMostReadGenres = (take: number) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.dashboard.getMostReadGenres +
      `?take=${take}`
  );
};

const GetBooksStats = (take: number, sortBy: string) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.dashboard.getBooksStats +
      `?take=${take}&sort_by=${sortBy}`
  );
};

interface GetGraphsProps {
  from?: any;
  to?: any;
}

const GetGraphs = ({ from, to }: GetGraphsProps) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.dashboard.graph +
      `?from=${from}&to=${to}`
  );
};

export { GetDashboardData, GetMostReadGenres, GetBooksStats, GetGraphs };
