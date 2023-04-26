import {
  Box,
  Typography,
  Button,
  Grid,
  MobileStepper,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import { useNavigate, useParams } from "react-router-dom";

import { useQuery } from "react-query";
import axios from "axios";
import { useEffect, useState } from "react";

let maxSteps = 0;
let duration = 0;
const answerMap = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D'
}

const fetchQuiz = (id) =>
  axios.get(`http://localhost:3000/quiz/${id}`).then((res) => {
    maxSteps = res.data.questions.length;
    duration = res.data.duration;
    return res.data;
  });

function Quiz() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isReview, setIsReview] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timer, setTimer] = useState(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [activeStep, setActiveStep] = useState(0);

  const [chosenAnswers, setChosenAnswers] = useState(null);
  const [quizResult, setQuizResult] = useState([]);

  const startQuiz = () => {
    setChosenAnswers(new Array(maxSteps).fill(null));
    setTimeRemaining(duration * 60);
    setQuizStarted(true);
    countDownTimer();
  };

  const countDownTimer = () => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 30;
        } else {
          return null;
        }
      });
    }, 1000);
    setTimer(interval);
  };

  const clearTimer = () => {
    clearInterval(timer);
  };

  const { id } = useParams();

  const theme = useTheme();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const handleDialogClose = () => {
    setQuizStarted(false);
    setDialogOpen(false);
    // Suppose it should proceed to the results / summary page here
  };

  const backOut = () => {
    clearTimer();
    navigate(-1);
  };

  const handleChooseAnswer = (event) => {
    setChosenAnswers((prevState) => {
      const newState = [...prevState];
      newState[activeStep] = +event.target.value;
      return newState;
    });
  };

  const submit = () => {
    if (dialogOpen) {
      setDialogOpen(false)
    }
    axios
      .post("http://localhost:3000/checkAnswers", { answers: chosenAnswers })
      .then((res) => {
        clearTimer();
        setQuizResult(res.data);
        setQuizSubmitted(true);
      });
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizSubmitted(false);
    setSnackOpen(false);
    setDialogOpen(false);
    setIsReview(false);
    setTimer(null);
    setTimeRemaining(null);
    setActiveStep(0);
    setChosenAnswers(null);
    setQuizResult([]);
  };

  useEffect(() => {
    if (timeRemaining == 150) {
      setSnackOpen(true);
    } else if (timeRemaining == 0) {
      setDialogOpen(true);
      clearTimer();
    }
  }, [timeRemaining]);

  const {
    isLoading,
    error,
    data: quiz,
  } = useQuery("allQuiz", () => fetchQuiz(id), {
    placeholderData: {},
  });

  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          width: "80vw",
          minHeight: "15vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {!quizStarted && (
          <>
            <Box sx={{ mb: 8 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>Quiz Name: {quiz.quiz_name}</Typography>
              <Typography>Quiz Category: {quiz.category}</Typography>
              <Typography>
                Number of questions: {quiz.questions?.length}
              </Typography>
              <Typography>Duration: {quiz.duration} minutes</Typography>
            </Box>
            <Box>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={backOut}
                sx={{ mr: 4 }}
              >
                Go Back
              </Button>
              <Button variant="contained" onClick={startQuiz}>
                Start Quiz!
              </Button>
            </Box>
          </>
        )}
        {quizStarted && !quizSubmitted && (
          <>
            <Typography>Remaining Time: {timeRemaining}</Typography>
            <Typography variant="h4" sx={{ mb: 8 }}>
              Question: {quiz.questions[activeStep].title}
            </Typography>
            <Box sx={{ flexGrow: 1, mb: 8 }}>
              <FormControl sx={{ width: "100%" }}>
                <RadioGroup
                  aria-labelledby="radio-buttons-group-label"
                  name="radio-buttons-group"
                  sx={{ width: "100%" }}
                  value={chosenAnswers[activeStep]}
                  onChange={handleChooseAnswer}
                >
                  <Grid container gap={4} justifyContent="center">
                    {quiz.questions[activeStep].answers.map((answer, index) => (
                      <Grid
                        item
                        key={answer.id}
                        sx={{
                          border: "1px solid",
                          borderRadius: 2,
                          flexBasis: "45% !important",
                        }}
                      >
                        <FormControlLabel
                          sx={{ pl: 2, py: 4, width: { xs: "80vw", md: "100%" }  }}
                          value={answer.id}
                          control={<Radio />}
                          label={answerMap[index] + '. ' + answer.content}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Box>
            {activeStep + 1 == maxSteps && (
              <Button variant="contained" onClick={submit} sx={{ minHeight: "100px" }}>
                Submit
              </Button>
            )}
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
          </>
        )}
        {quizSubmitted && !isReview && (
          <>
            <Typography>Results:</Typography>
            <Typography>
              You got {quizResult.correctCount} out of {maxSteps} questions
              correct!
            </Typography>
            <Typography>Score: {quizResult.score}</Typography>
            <Button variant="contained" onClick={() => setIsReview(true)}>
              Review your answers
            </Button>
          </>
        )}
        {quizSubmitted && isReview && (
          <>
            <Typography sx={{ mb: 4 }}>Review Mode</Typography>
            {quiz.questions.map((question, index) => (
              <Box key={question.id} sx={{ mb: 8 }}>
                <Typography sx={{ mb: 6 }}>
                  Question: {question.title} - (
                  {quizResult.list[index].isCorrect == true
                    ? "Correct"
                    : "Wrong"}
                  )
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <FormControl sx={{ width: "100%" }}>
                    <RadioGroup
                      aria-labelledby="radio-buttons-group-label"
                      name="radio-buttons-group"
                      sx={{ width: "100%" }}
                      value={quizResult.list[index].id}
                    >
                      <Grid container gap={4} justifyContent="center">
                        {question.answers.map((answer) => (
                          <Grid
                            item
                            xs={6}
                            key={answer.id}
                            sx={{
                              borderRadius: 2,
                              flexBasis: "45% !important",
                              display: "flex",
                              alignItems: "center"
                            }}
                            border={
                              quizResult.list[index].id == answer.id ? (quizResult.list[index].isCorrect == true ? "2px solid green" : "2px solid red") : "1px solid"
                            }
                            color={
                              quizResult.list[index].id == answer.id ? (quizResult.list[index].isCorrect == true ? "green" : "red") : "inherit"
                            }
                          >
                            <FormControlLabel
                              sx={{ ml: 2 }}
                              value={answer.id}
                              control={<Radio disabled={true} color={quizResult.list[index].isCorrect == true ? "success" : "warning" } />}
                              label={answer.content}
                              disabled={quizResult.list[index].id == answer.id ? false : true}
                            />
                            {quizResult.list[index].id == answer.id ? (quizResult.list[index].isCorrect == true ? <CheckIcon sx={{ fontSize: '30px', color: "green" }} /> : <CloseIcon fontSize="medium" sx={{ fontSize: '30px', color: "red" }} />) : null}
                          </Grid>
                        ))}
                      </Grid>
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Box>
            ))}
            <Button variant="contained" onClick={resetQuiz}>
              Restart Quiz
            </Button>
          </>
        )}
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackOpen}
        onClose={handleSnackClose}
        autoHideDuration={5000}
        key="topcenter"
      >
        <Alert severity="warning">You have 150 seconds left</Alert>
      </Snackbar>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Time is up!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Quiz will end now!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetQuiz}>Retry Quiz</Button>
          <Button onClick={submit} autoFocus>Submit Anyway</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Quiz;
