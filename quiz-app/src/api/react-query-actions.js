import axios from "../utils/axios";

export const fetchQuiz = (id) =>
  axios.get(`/quiz/${id}`).then((res) => res.data);

export const fetchQuizzes = () => axios.get("/quiz").then((res) => res.data);

export const deleteQuiz = (id) =>
  axios.post(`/quiz/delete/${id}`).then((res) => res.data);

export const fetchCategories = () =>
  axios.get("/category").then((res) => res.data);

export const deleteCategory = (id) =>
  axios.post(`/category/delete/${id}`).then((res) => res.data);

export const editCategory = (category) =>
  axios.post(`/category/${category.id}/edit`, category);

export const addCategory = (category) => {
  return axios.post("/category/add", category).then((res) => res.data);
};

export const fetchQuizResult = () => {
  return axios.get("/quiz/result").then(res => res.data.list)
}

export const login = (name, password) => {
  return axios.post("/login", { name, password }).then((res) => res.data);
};

export const register = (name, email, password) => {
  return axios.post("/register", { name, email, password }).then(res => res.data);
}