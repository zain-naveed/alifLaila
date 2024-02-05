import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../../utils/interceptor";
import { store } from "shared/redux/store";

const CreateQuiz = (params: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.quiz.create,
    params
  );
};

const CreateQuestion = (params: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.question.add,
    params
  );
};
const publishQuiz = (quizId: any) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint +
      Endpoint.partner.question.publish +
      quizId
  );
};

const GetQuiz = (id: string) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint + Endpoint.partner.quiz.getQuiz + id
  );
};

const GetQuizByBook = (id: string) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.quiz.getQuizByBook +
      id
  );
};

const UpdateQuiz = (params: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.quiz.update,
    params
  );
};

const UpdateQuestion = (params: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.question.update,
    params
  );
};

const DeleteQuiz = (id: string) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.quiz.delete + id
  );
};

const DeleteQuestion = (params: {}) => {
  return HTTP_CLIENT.post(
    store.getState().root.login?.endpoint + Endpoint.partner.question.delete,
    params
  );
};

const getQuestion = (id: string) => {
  return HTTP_CLIENT.get(
    store.getState().root.login?.endpoint +
      Endpoint.partner.question.getQuestion +
      id
  );
};

export {
  CreateQuiz,
  CreateQuestion,
  GetQuiz,
  GetQuizByBook,
  getQuestion,
  UpdateQuiz,
  UpdateQuestion,
  DeleteQuiz,
  DeleteQuestion,
  publishQuiz,
};
