import { useEffect } from "react";
import { fetchQuizzes, fetchQuizResult } from "./api/react-query-actions";
import { Typography, Link, Box, Button, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { formatISODate } from "./utils/dateUtils";

function QuizResult() {
  const navigate = useNavigate();

  const reviewResultsHandler = (result) => {
    sessionStorage.setItem("reviewMode", true);
    const quizResult = {
      correctCount: result.correctCount,
      score: result.score,
      list: result.resultsArr.split(","),
      answers: result.answers.split(","),
      correctAnswers: result.correctAnswers.split(","),
    };
    console.log(quizResult);
    sessionStorage.setItem("quizResult", JSON.stringify(quizResult));
    navigate(`/quiz/${result.quizId}`);
  };

  const {
    isLoading,
    error,
    data: quizResults,
  } = useQuery(["quizResults"], fetchQuizResult);

  const { data: quizzes } = useQuery(["allQuiz"], fetchQuizzes);

  return (
    <>
      <Box
        sx={{
          width: { xs: "100%", sm: "30rem", md: "40rem", lg: "50rem" },
          minWidth: "18rem",
        }}
      >
        <Typography variant="h4">Quiz Results:</Typography>
        {quizResults && quizResults.length > 0 && (
          <Box>
            {quizResults.map((result) => (
              <Box
                key={result.id}
                sx={{ border: "1px solid", borderRadius: 3, p: 3, my: 4 }}
              >
                <Stack gap={3}>
                  <Typography>
                    Quiz:{" "}
                    {quizzes &&
                      quizzes.find((quiz) => quiz.id == result.quizId)
                        .quiz_name}
                  </Typography>
                  <Typography>
                    Category:
                    {quizzes
                      .find((quiz) => quiz.id == result.quizId)
                      .category.map((cat) => (
                        <Typography
                          variant="span"
                          key={cat.id}
                          sx={{
                            border: "1px solid",
                            borderRadius: 999,
                            mx: 1,
                            px: 2,
                            py: 1,
                          }}
                        >
                          {cat.name}
                        </Typography>
                      ))}
                  </Typography>
                  <Typography>
                    Score: {result.score} ({result.correctCount}/
                    {result.correctAnswers.split(",").length})
                  </Typography>
                  <Typography>
                    Quiz Date: {formatISODate(result.quiz_date)}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 1 }}
                    onClick={() => reviewResultsHandler(result)}
                  >
                    Review results
                  </Button>
                </Stack>
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
                navigate("/allquiz");
              }}
            >
              Attemp a quiz now!
            </Link>
          </Typography>
        )}
      </Box>
    </>
  );
}

export default QuizResult;
