import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Home from "../Home";
import AllQuiz from "../AllQuiz";
import Quiz from "../Quiz";
import QuizForm from "../QuizForm";
import Register from "../Register";
import Login from "../Login";
import Logout from "../Logout";
import Admin from "../Admin";
import QuizResult from "../QuizResult";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Home */}
        <Route path="/" element={<Home />} />
        {/* Quiz Related */}
        <Route path="/quiz" element={<AllQuiz />} />
        <Route path="/quiz/result" element={<QuizResult />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/quiz/:id/edit" element={<QuizForm />} />
        <Route path="/quiz/add" element={<QuizForm />} />
        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
