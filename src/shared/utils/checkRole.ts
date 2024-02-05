import {
  authorRoute,
  familyKidRoutes,
  individualKidRoutes,
  parentRoutes,
  partnerAuthorRoute,
  partnersPendingRoute,
  publicRoute,
  publisherParentEnabledRoute,
  publisherRoute,
} from "shared/routes/allRoutes";
import { accountStatus, kidAccountRole, roles } from "./enum";
import { redirePathConstant } from "./redirectPathConstant";

const checkRole = (
  role: number,
  pathName: string,
  kid_role?: number,
  status?: any,
  isPartnerAuthor?: number,
  isPartnerEnaled?: number
) => {
  switch (role) {
    case roles.school:
      return {
        path: "",
        isAutherized: true,
      };

    case roles.teacher:
      return {
        path: "",
        isAutherized: true,
      };

    case roles.parent:
      return {
        path: redirePathConstant.parent,
        isAutherized: validatePath(parentRoutes, pathName),
      };

    case roles.reader:
      switch (kid_role) {
        case kidAccountRole.individual:
          return {
            path: redirePathConstant.kid,
            isAutherized: validatePath(individualKidRoutes, pathName),
          };
        case kidAccountRole.family:
          return {
            path: redirePathConstant.kid,
            isAutherized: validatePath(familyKidRoutes, pathName),
          };
        default:
          return {
            path: redirePathConstant.kid,
            isAutherized: validatePath(individualKidRoutes, pathName),
          };
      }

    case roles.author:
      switch (isPartnerAuthor) {
        case 1:
          return {
            path: redirePathConstant.partners,
            isAutherized: validatePath(partnerAuthorRoute, pathName),
          };
        case 0:
          if (status === accountStatus.pending) {
            return {
              path: redirePathConstant.partners,
              isAutherized: validatePath(partnersPendingRoute, pathName),
            };
          } else if (status === accountStatus.approved) {
            return {
              path: redirePathConstant.partners,
              isAutherized: validatePath(authorRoute, pathName),
            };
          } else {
            return {
              path: redirePathConstant.partners,
              isAutherized: validatePath(authorRoute, pathName),
            };
          }
        default:
          if (status === accountStatus.pending) {
            return {
              path: redirePathConstant.partners,
              isAutherized: validatePath(partnersPendingRoute, pathName),
            };
          } else if (status === accountStatus.approved) {
            return {
              path: redirePathConstant.partners,
              isAutherized: validatePath(authorRoute, pathName),
            };
          } else {
            return {
              path: redirePathConstant.partners,
              isAutherized: validatePath(authorRoute, pathName),
            };
          }
      }

    case roles.publisher:
      switch (status) {
        case accountStatus.pending:
          return {
            path: redirePathConstant.partners,
            isAutherized: validatePath(partnersPendingRoute, pathName),
          };
        case accountStatus.approved:
        default:
          const selectedRoute = isPartnerEnaled
            ? publisherParentEnabledRoute
            : publisherRoute;
          return {
            path: redirePathConstant.partners,
            isAutherized: validatePath(selectedRoute, pathName),
          };
      }

    case roles.mainSite:
      return {
        path: redirePathConstant.mainSite,
        isAutherized: validatePath(publicRoute, pathName),
      };

    default:
      return {
        path: redirePathConstant.mainSite,
        isAutherized: validatePath(publicRoute, pathName),
      };
  }
};
const validatePath = (routeArr: [any], pathName: string) => {
  if (routeArr.findIndex((ii: any) => ii.path == pathName) > -1) {
    return true;
  } else {
    let lasItem: any = pathName.split("/").pop();
    pathName = pathName.replace(lasItem, ":id");
    if (routeArr.findIndex((ii: any) => ii.path == pathName) > -1) {
      return true;
    } else {
    }
    return false;
  }
};
export { checkRole };
