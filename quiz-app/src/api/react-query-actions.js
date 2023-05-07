import axios from "axios";

export const fetchQuiz = (id) =>
  axios.get(`http://localhost:3000/quiz/${id}`).then((res) => res.data);

export const fetchQuizzes = () =>
  axios.get("http://localhost:3000/quiz").then((res) => res.data);

export const deleteQuiz = (id) =>
  axios.post(`http://localhost:3000/quiz/delete/${id}`).then((res) => res.data);

export const fetchCategories = () =>
  axios.get("http://localhost:3000/category").then((res) => res.data);

export const deleteCategory = (id) =>
  axios
    .post(`http://localhost:3000/category/delete/${id}`)
    .then((res) => res.data);

export const editCategory = (category) =>
  axios.post(`http://localhost:3000/category/${category.id}/edit`, category);

export const addCategory = (category) => {
  return axios
    .post("http://localhost:3000/category/add", category)
    .then((res) => res.data);
};
