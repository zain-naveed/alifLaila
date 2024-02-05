//use client
import axios from "axios";
import { store } from "../redux/store";
import { BaseURL } from "./endpoints";
import { resetLoginUser } from "shared/redux/reducers/loginSlice";
import { resetCart } from "shared/redux/reducers/cartSlice";

export const HTTP_CLIENT = axios.create({
  baseURL: BaseURL,
});

const isServer = typeof window === "undefined";
const setupAxios = (token?: any) => {
  HTTP_CLIENT.interceptors.request.use(
    (config: any) => {
      if (!isServer) {
        const token = store.getState().root.login?.token;
        config.headers["authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (err) => Promise.reject(err)
  );
};

HTTP_CLIENT.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err?.response?.status === 401) {
      const { login } = store.getState().root;
      if (login?.token) {
        store.dispatch(resetLoginUser());
        store.dispatch(resetCart());
        document.cookie.split(";").forEach(function (c) {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });
        window.location.reload();
      } else {
        if (document) {
          document?.cookie.split(";").forEach(function (c) {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(
                /=.*/,
                "=;expires=" + new Date().toUTCString() + ";path=/"
              );
          });
          window.location.reload();
        }
      }
    }
    return Promise.reject(err);
  }
);

// HTTP_CLIENT.defaults.headers["Authorization"] = `Bearer ${toke}`;
export const initialConfig = () => {
  setupAxios();
};
initialConfig();
export { setupAxios };
