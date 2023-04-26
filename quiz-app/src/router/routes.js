import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Home from "../Home";
import Quiz from "../Quiz";

const routes = () => {
  return (
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/quiz/:id" element={<Quiz />} />
    </Route>
  );
};

export default routes;
