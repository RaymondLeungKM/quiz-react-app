import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Home from "../Home";
import Quiz from "../Quiz";
import QuizForm from "../QuizForm";
import Admin from "../Admin";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Home */}
        <Route path="/" element={<Home />} />
        {/* Quiz Related */}
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/quiz/:id/edit" element={<QuizForm />} />
        <Route path="/quiz/add" element={<QuizForm />} />
        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
