import cookie from "cookie";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { checkRole } from "./checkRole";
import { ProxyURL } from "./endpoints";
import { accountStatus, roles } from "./enum";
import { parentPathConstants } from "./sidebarConstants/parentConstants";
import {
  independentAuthorPathConstants,
  publisherPathConstants,
  partnerPendingPathConstants,
  partnerAuthorPathConstant,
} from "./sidebarConstants/partnerConstants";
import { publisherPartnerEnabledPathConstants } from "./sidebarConstants/partnerConstants";

const classNames = require("classnames");

function percentage(partialValue: number, totalValue: number) {
  return (100 * partialValue) / totalValue;
}

function getWindowDimensions() {
  if (typeof window !== "undefined") {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  } else {
    return {
      width: 0,
      height: 0,
    };
  }
}

function parseCookies(req: any) {
  return cookie.parse(
    req
      ? req.headers.cookie || req.headers.get("cookie") || "" || ""
      : document.cookie
  );
}

const getDataFromCookies = (req: any, key: string) => {
  if (Object.keys(req).includes(key)) {
    return JSON.parse(req[key]);
  } else {
    return { role: roles.mainSite };
  }
};

const redirectBasedOnRole = (req: any, pathName: string) => {
  if (req) {
    const persistRole = getDataFromCookies(parseCookies(req), "user");
    let isAuthenticated = checkRole(
      persistRole.role,
      pathName,
      persistRole.kid_role ? persistRole.kid_role : null,
      persistRole.status ? persistRole?.status : 0,
      persistRole?.is_partner_enabled ? persistRole?.is_partner_enabled : 0,
      persistRole?.is_partner_enabled_server
        ? persistRole?.is_partner_enabled_server
        : 0
    );
    return isAuthenticated;
  }
};

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const SUPPORTED_FORMATS_Pdf = ["application/pdf"];
const SUPPORTED_FORMATS_file = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
  "application/pdf",
  "text/plain",
  "application/vnd.ms-excel",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

function checkFileType(filetype: string): boolean {
  if (SUPPORTED_FORMATS.includes(filetype)) {
    return true;
  } else {
    return false;
  }
}

function checkFileIsPdf(filetype: string): boolean {
  if (SUPPORTED_FORMATS_Pdf.includes(filetype)) {
    return true;
  } else {
    return false;
  }
}

function checkFileIsDoc(filetype: string): boolean {
  if (SUPPORTED_FORMATS_file.includes(filetype)) {
    return true;
  } else {
    return false;
  }
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

interface routeProps {
  path?: string;
  title: string;
  Icon?: any;
}

const checkActivePath = (
  role: number,
  path: string,
  status?: any,
  isPartnerAuthor?: any,
  isPartnerEnabled?: any
) => {
  if (
    (role === roles.publisher || role === roles.author) &&
    status === accountStatus.pending
  ) {
    let isExistIndex = partnerPendingPathConstants.findIndex(
      (ii: routeProps) => ii.path == path
    );
    return isExistIndex;
  } else if (role === roles.publisher) {
    if (isPartnerEnabled) {
      let isExistIndex = publisherPartnerEnabledPathConstants.findIndex(
        (ii: routeProps) => ii.path == path
      );
      return isExistIndex;
    } else {
      let isExistIndex = publisherPathConstants.findIndex(
        (ii: routeProps) => ii.path == path
      );
      return isExistIndex;
    }
  } else if (role === roles.parent) {
    let isExistIndex = parentPathConstants.findIndex(
      (ii: routeProps) => ii.path === path
    );
    return isExistIndex;
  } else if (role === roles.author && !isPartnerAuthor) {
    let isExistIndex = independentAuthorPathConstants.findIndex(
      (ii: routeProps) => ii.path === path
    );
    return isExistIndex;
  } else if (role === roles.author && isPartnerAuthor) {
    let isExistIndex = partnerAuthorPathConstant.findIndex(
      (ii: routeProps) => ii.path === path
    );
    return isExistIndex;
  }
  return 0;
};

function isNumberCheck(e: any) {
  e = e || window.event;
  return /[\d.]/.test(e.key);
}

function isAlphaNumericCheck(e: any) {
  e = e || window.event;
  var charCode = e.which ? e.which : e.keyCode;
  return /[\d\W]+/.test(String.fromCharCode(charCode));
}

async function downloadLink(url: string, filename: string) {
  fetch(ProxyURL + url, {
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
  })
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    })
    .catch(console.error);
}

function downloadLocalFile(path: string) {
  const link = document.createElement("a");
  link.download = "downloaded_file_name";
  link.href = path;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function roundNum(number: string, decPlaces: number) {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10, decPlaces);

  // Enumerate number abbreviations
  var abbrev = ["k", "m", "b", "t"];

  // Go through the array backwards, so we do the largest first
  for (var i = abbrev.length - 1; i >= 0; i--) {
    // Convert array index to "1000", "1000000", etc
    var size = Math.pow(10, (i + 1) * 3);

    // If the number is bigger or equal do the abbreviation
    if (size <= Number(number)) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = String(
        Math.round((Number(number) * decPlaces) / size) / decPlaces
      );

      // Handle special case where we round up to the next abbreviation
      if (Number(number) === 1000 && i < abbrev.length - 1) {
        number = String(1);
        i++;
      }

      // Add the letter for the abbreviation
      number += abbrev[i];

      // We are done... stop
      break;
    }
  }

  return number;
}

const getNumberOfDays = (date: any) => {
  var today = new Date();
  var date_to_reply = new Date(date);
  var timeinmilisec = date_to_reply.getTime() - today.getTime();
  return Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24));
};

const isEnglishAlphabet = (e: any) => {
  var englishAlphabetAndWhiteSpace =
    /[a-zA-Z0-9!@#$%^&*()-_=+[\]{}|;:'",.<>/?`~\\ +$]/g;
  if (englishAlphabetAndWhiteSpace.test(e)) {
    return true;
  } else {
    return false;
  }
};

const isEnglishString = (text: string) => {
  const result = text.replace(/[^a-zA-Z+$]/g, "");
  var englishAlphabet = /^[A-Za-z]+$/g;
  if (englishAlphabet.test(result)) {
    return true;
  } else {
    return false;
  }
};

function withError<P extends { [key: string]: unknown }>(
  gssp: GetServerSideProps<P>
) {
  return async (context: GetServerSidePropsContext) => {
    try {
      return await gssp(context);
    } catch (e: any) {
      if (e) {
        context.res.statusCode = 401;
        return { props: { errorStatus: 401 } } as InferGetServerSidePropsType<
          typeof gssp
        >; //XXX hack it not to get compilation error on nextpage, error is handled by ErrorBoundary
      } else {
        throw e;
      }
    }
  };
}

export {
  checkActivePath,
  checkFileIsDoc,
  checkFileIsPdf,
  checkFileType,
  classNames,
  downloadLink,
  downloadLocalFile,
  formatBytes,
  getDataFromCookies,
  getNumberOfDays,
  getWindowDimensions,
  isAlphaNumericCheck,
  isEnglishAlphabet,
  isNumberCheck,
  parseCookies,
  percentage,
  redirectBasedOnRole,
  roundNum,
  withError,
  isEnglishString,
};
