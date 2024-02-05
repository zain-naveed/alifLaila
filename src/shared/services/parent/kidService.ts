import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const getkidProgress = (body: any, page: any, id: any) => {
  return HTTP_CLIENT.post(
    Endpoint.parent.kids.progress + id + `?page=${page}`,
    body
  );
};

const updateKid = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.parent.kids.update, params);
};

const unAssignBook = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.parent.kids.unAssign, params);
};

const assignBook = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.parent.kids.assign, params);
};

const assigneeList = (id: any) => {
  return HTTP_CLIENT.get(Endpoint.parent.kids.assigneelist + id);
};

export { getkidProgress, updateKid, unAssignBook, assignBook, assigneeList };
