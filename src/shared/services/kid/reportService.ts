import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const getReportList = (type: any) => {
  return HTTP_CLIENT.get(Endpoint.kid.report.list + `?type=${type}`);
};
const report = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.report.report, params);
};
export { getReportList, report };
