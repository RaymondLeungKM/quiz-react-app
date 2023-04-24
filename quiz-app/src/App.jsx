import { useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const fetchQuizzes = () => axios.get("http://localhost:3000/quiz").then(res=>res.data);

function App() {
  // const [quizzes, setQuizzes] = useState([]);

  const { isLoading, error, data: quizzes } = useQuery("allQuiz", fetchQuizzes, {
    placeholderData: []
  })

  const navigate = useNavigate();

  return (
    <>
      <div>
        <h1>Weclome to the Quiz App!</h1>
        <div>
          <h2>All Quizzes:</h2>
          {quizzes.length > 0 && quizzes.map(quiz=> (
            <div className="quiz-card" key={quiz.id} onClick={() => navigate(`/quiz/${quiz.id}`)}>
              <h3>Quiz Name: {quiz.name}</h3>
              <p>Category: {quiz.category}</p>
            </div>
          ))}
          {isLoading && <p>Loading...</p>}
          {error && <p>Something wrong!</p>}
        </div>
      </div>
    </>
  );
}

export default App;
