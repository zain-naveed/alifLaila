import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../utils/interceptor";

const LoginUser = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.auth.login, params);
};

const LogoutUser = () => {
  return HTTP_CLIENT.post(Endpoint.auth.logout);
};

const RegisterUser = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.auth.register, params);
};

const SendEmailOtp = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.auth.sendEmailOtp, params);
};

const VerifyEmailOtp = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.auth.verifyEmailOtp, params);
};

const SetResetPassword = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.auth.resetPassword, params);
};

const CheckEmail = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.auth.checkEmail, params);
};

const SocialLogin = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.auth.socialLogin, params);
};

const SocialRegister = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.auth.socialRegister, params);
};

export {
  LoginUser,
  LogoutUser,
  RegisterUser,
  SendEmailOtp,
  VerifyEmailOtp,
  SetResetPassword,
  CheckEmail,
  SocialLogin,
  SocialRegister,
};
