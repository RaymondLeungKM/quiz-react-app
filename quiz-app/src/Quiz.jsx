import { Box, Typography, Button, Grid, MobileStepper  } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import { useNavigate, useParams } from "react-router-dom";

import { useQuery } from "react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const fetchQuiz = (id) =>
  axios.get(`http://localhost:3000/quiz/${id}`).then((res) => res.data);

let maxSteps = 0;

function Quiz() {
  const [quizStarted, setQuizStarted] = useState(false);

  const [activeStep, setActiveStep] = useState(0);

  const startQuiz = () => {
    maxSteps = quiz.questions.length;
    setQuizStarted(true);
  };

  const { id } = useParams();

  const theme = useTheme();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const {
    isLoading,
    error,
    data: quiz,
  } = useQuery("allQuiz", () => fetchQuiz(id), {
    placeholderData: {},
  });

  const navigate = useNavigate();

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        sx={{ position: "absolute", top: "2rem", left: "2rem" }}
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
      {!quizStarted && (
        <Box>
          <Typography>Quiz Name: {quiz.quiz_name}</Typography>
          <Typography>Quiz Category: {quiz.category}</Typography>
          <Typography>Number of questions: {quiz.questions?.length}</Typography>
          <Button variant="contained" onClick={startQuiz}>
            Start Quiz!
          </Button>
        </Box>
      )}
      {quizStarted && (
        <Box>
          <Typography>Question: {quiz.questions[activeStep].title}</Typography>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {quiz.questions[activeStep].answers.map((answer) => (
              <Grid item xs={6} key={answer.id}>
                <Typography>{answer.content}</Typography>
              </Grid>
            ))}
          </Grid>
          <MobileStepper
            variant="text"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                Next
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </Box>
      )}
    </Box>
  );
}

export default Quiz;
