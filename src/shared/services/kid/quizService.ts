import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";
const getQuiz = (id: number | string) => {
  return HTTP_CLIENT.get(Endpoint.kid.quiz.startQuiz + id);
};
const getQuizQuestion = (id: number | string, page: number) => {
  return HTTP_CLIENT.get(Endpoint.kid.quiz.getQuestion + id + `?page=${page}`);
};
const atemptedQuiz = (body: any) => {
  return HTTP_CLIENT.post(Endpoint.kid.quiz.quizAttempt, body);
};
const getQuizResult = (id: number | string) => {
  return HTTP_CLIENT.get(Endpoint.kid.quiz.result + id);
};

export { getQuiz, getQuizQuestion, atemptedQuiz, getQuizResult };
