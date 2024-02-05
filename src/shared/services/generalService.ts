import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

interface GetAuthorListProps {
  search: string | any;
  page: number;
  limit?: number;
}

const getTerms = () => {
  return HTTP_CLIENT.get(Endpoint.general.terms);
};

const getPrivacy = () => {
  return HTTP_CLIENT.get(Endpoint.general.privacy);
};

const SubscribeNewsletter = (parms: {}) => {
  return HTTP_CLIENT.post(Endpoint.general.newsLetter, parms);
};

const getAuthorList = (params: GetAuthorListProps) => {
  return HTTP_CLIENT.get(
    Endpoint.general.authors +
      `?page=${params.page}&&search=${params.search}&&limit=${
        params?.limit ? params?.limit : 8
      }`
  );
};
const getAuthorProfile = (prfileId: string | number | any) => {
  return HTTP_CLIENT.get(Endpoint.general.authorProfile + prfileId);
};

export {
  getTerms,
  getPrivacy,
  SubscribeNewsletter,
  getAuthorList,
  getAuthorProfile,
};
