import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

interface GetPublishersListProps {
  search: string | any;
  page: number;
  limit?: number;
}

const getPublishersList = (params: GetPublishersListProps) => {
  return HTTP_CLIENT.get(
    Endpoint.kid.publisher.list +
      `?page=${params.page}&&search=${params.search}&&limit=${
        params?.limit ? params?.limit : 8
      }`
  );
};
const getPublisherProfile = (prfileId: string | number | any) => {
  return HTTP_CLIENT.get(Endpoint.kid.publisher.profile + prfileId);
};

const getAssociatedAuthorsList = (page: any, id: any) => {
  return HTTP_CLIENT.get(
    Endpoint.kid.publisher.associatedPartner + id + `?page=${page}`
  );
};

export { getPublishersList, getPublisherProfile, getAssociatedAuthorsList };
