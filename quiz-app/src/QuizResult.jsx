import { useEffect } from "react";
import { fetchQuizResult } from "./api/react-query-actions";
import { Typography, Link, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { formatISODate } from "./utils/dateUtils";

function QuizResult() {
  const navigate = useNavigate();

  const {
    isLoading,
    error,
    data: quizResults,
  } = useQuery(["quizResults"], fetchQuizResult);

  return (
    <>
      <Typography variant="h4">Quiz Results:</Typography>
      {quizResults && quizResults.length > 0 && (
        <Box>
          {quizResults.map((result) => (
            <Box
              key={result.id}
              sx={{ border: "1px solid", borderRadius: 3, p: 3, my: 4 }}
            >
              <Typography>Quiz: {result.quizId}</Typography>
              <Typography>Score: {result.score}</Typography>
              <Typography>
                Quiz Date: {formatISODate(result.created_date)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      {quizResults && quizResults.length == 0 && (
        <Typography>
          No results yet!
          <Link
            sx={{ ml: 1 }}
            component="button"
            onClick={() => {
              navigate("/quiz");
            }}
          >
            Attemp a quiz now!
          </Link>
        </Typography>
      )}
    </>
  );
}

export default QuizResult;
