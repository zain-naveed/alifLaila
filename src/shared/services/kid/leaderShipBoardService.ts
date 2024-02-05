import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const getLeadershipStats = ({ category, age_range_id }: any) => {
  return HTTP_CLIENT.get(
    Endpoint.kid.leadershipBoard.getStats +
      `?category=${category}&age_range_id=${age_range_id}`
  );
};

export { getLeadershipStats };
