import { useState, useEffect } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Button,
  TextField,
  Typography,
  Box,
  Checkbox,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Stack from "@mui/joy/Stack";
import DeleteIcon from "@mui/icons-material/Delete";

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { useQuery } from "react-query";

import { enqueueSnackbar } from "notistack";

let questionsTotal = 0;
let duration = 0;

const fetchQuiz = (id) =>
  axios.get(`http://localhost:3000/quiz/edit/${id}`).then((res) => {
    questionsTotal = res.data.questions.length;
    duration = res.data.duration;
    return res.data;
  });

function QuizForm() {
  const [backDropVisible, setBackDropVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizCategory, setQuizCategory] = useState("");
  const [quizDuration, setQuizDuration] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(false);

  const [formHasError, setFormHasError] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState("");

  const navigate = useNavigate();

  // Change to edit mode if id exists in params;
  const { id } = useParams();

  useEffect(() => {
    if (id != undefined) {
      setEditMode(true);
    }
  }, []);

  const { fetchQuizIsLoading, fetchQuizError } = useQuery(
    ["quiz", id],
    () => fetchQuiz(id),
    {
      placeholderData: {},
      enabled: !!id,
      onSuccess: (data) => {
        console.log(data);
        setQuizTitle(data.quiz_name);
        setQuizCategory(data.category);
        setQuizDuration(data.duration);
        const modifiedQuestionArr = data.questions.map((question) => {
          return {
            title: question.title,
            order: question.order,
          };
        });
        setQuestions(modifiedQuestionArr);
        const modifiedAnswersArr = data.questions.map((question) => {
          const ansArr = [];
          question.answers.forEach((answer) => {
            ansArr.push({
              content: answer.content,
              order: answer.order,
              isCorrect: answer.isCorrect,
            });
          });
          return ansArr;
        });
        setAnswers(modifiedAnswersArr);
      },
    }
  );

  // Note that questions must be added before their corresponding answers can be added (questionId required)
  // Maybe it is better to separate the questions array and the answers array(maybe a map is better here)
  const addQuestionHandler = () => {
    setQuestions((prevState) => {
      const newState = [...prevState];
      const newQuestionOrder = newState.length;
      newState.push({
        title: "",
        order: newQuestionOrder ? newQuestionOrder : 0,
      });
      return newState;
    });
  };

  const removeQuestionHandler = (qIndex) => {
    console.log(qIndex);
    // Remove answers of that questions first
    setAnswers((prevState) => {
      const newState = [...prevState];
      newState.splice(qIndex, 1);
      return newState;
    });
    setQuestions((prevState) => {
      const newState = [...prevState];
      newState.splice(qIndex, 1);
      // update the questions' order
      return updateOrder(newState);
    });
  };

  const updateOrder = (arr) => {
    const newArr = arr.map((item, index) => {
      return {
        ...item,
        order: index,
      };
    });
    return newArr;
  };

  const setQuestionProperty = (e, index, property) => {
    const value = e.target.value;
    setQuestions((prevState) => {
      const newState = [...prevState];
      newState[index][property] = value;
      return newState;
    });
  };

  const setAnswerProperty = (e, qIndex, aIndex, property) => {
    let value;
    if (property === "isCorrect") {
      value = e.target.checked;
      // only allow 1 answer to be chosen as correct per question
      setAnswers((prevState) => {
        const newState = [...prevState];
        const existingCorrectAnswer = newState[qIndex].find(
          (ans) => ans.isCorrect == true
        );
        if (existingCorrectAnswer != null) {
          existingCorrectAnswer.isCorrect = false;
        }
        newState[qIndex][aIndex][property] = value;
        return newState;
      });
    } else {
      value = e.target.value;
      setAnswers((prevState) => {
        const newState = [...prevState];
        newState[qIndex][aIndex][property] = value;
        return newState;
      });
    }
  };

  const addAnswerHandler = (qIndex) => {
    // There must be 4 answers per question
    setAnswers((prevState) => {
      const newState = [...prevState];
      if (!newState[qIndex]) {
        newState[qIndex] = [];
      }
      const newAnswerOrder = newState[qIndex].length;
      newState[qIndex].push({
        content: "",
        order: newAnswerOrder ? newAnswerOrder : 0,
        isCorrect: false,
      });
      return newState;
    });
  };

  const removeAnswerHandler = (qIndex, aIndex) => {
    setAnswers((prevState) => {
      const newState = [...prevState];
      newState[qIndex].splice(aIndex, 1);
      // update the answers' order
      newState[qIndex] = updateOrder(newState[qIndex]);
      return newState;
    });
  };

  const handleSubmit = (event) => {
    setBackDropVisible(true);
    event.preventDefault();
    // Need to have some form validation here.. but lets just skip it for now
    let errorFlag = false;
    let errorMsg = "";
    answers.forEach((answerArr) => {
      // Check exactly 1 ans must be chosen as the
      if (answerArr.filter((ans) => ans.isCorrect).length != 1) {
        errorFlag = true;
        errorMsg = "1 answer must be chosen as the correct answer for each question!";
        // setFormHasError(true);
        // setFormErrorMsg("1 answer must be chosen as the correct answer for each question!");
      }
    });

    if (errorFlag) {
      enqueueSnackbar(errorMsg, { variant: "error" });
      setBackDropVisible(false);
      return;
    }

    const quizData = {
      quiz: {
        quiz_name: quizTitle,
        category: quizCategory,
        duration: quizDuration,
      },
      questions,
      answers,
    };
    if (editMode) {
      console.log("in edit mode");
      quizData.quiz.id = id;
      axios.post("http://localhost:3000/quiz/edit", quizData).then((res) => {
        console.log(res);
        setBackDropVisible(false);
        enqueueSnackbar("Quiz updated successfully!", { variant: "success" });
        navigate(`/quiz/${res.data.id}`);
      });
    } else {
      console.log("in add mode");
      axios.post("http://localhost:3000/quiz/add", quizData).then((res) => {
        console.log(res);
        // show some kind of popup / alert to notify the user that the adding was success
        setBackDropVisible(false);
        enqueueSnackbar("Quiz created successfully!", { variant: "success" });
        navigate(`/quiz/${res.data.id}`);
      });
    }
  };

  // For checking and debugging purpose only
  // useEffect(() => {
  //   console.log("questions", questions);
  //   console.log("answers", answers);
  // }, [questions, answers]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        {"editMode=" + editMode}
        <Stack>
          <Typography variant="h4">
            {editMode ? "Edit" : "Add"} Quiz Form
          </Typography>
          <FormControl sx={{ m: 3 }} error={error} variant="standard">
            <TextField
              id="quiz-title"
              label="Quiz Title"
              value={quizTitle}
              onChange={(event) => {
                setQuizTitle(event.target.value);
              }}
            />
          </FormControl>
          <FormControl sx={{ m: 3 }} error={error} variant="standard">
            <TextField
              id="quiz-category"
              label="Quiz Category"
              value={quizCategory}
              onChange={(event) => {
                setQuizCategory(event.target.value);
              }}
            />
          </FormControl>
          <FormControl sx={{ m: 3 }} error={error} variant="standard">
            <TextField
              id="quiz-duration"
              label="Quiz Duration (mins)"
              value={quizDuration}
              onChange={(event) => {
                setQuizDuration(event.target.value);
              }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
          </FormControl>
          {/* Questions Group Start */}
          {questions.length > 0 &&
            questions.map((question, qIndex) => (
              <Box
                key={qIndex}
                sx={{ p: 2, border: "1px solid", borderRadius: 2, mb: 4 }}
              >
                <Typography>Question {qIndex + 1}</Typography>
                <FormControl sx={{ m: 3 }} error={error} variant="standard">
                  <TextField
                    id={"question-" + `${qIndex + 1}` + "-title"}
                    label={"Question " + `${qIndex + 1}` + " Title"}
                    value={question.title}
                    onChange={(e) => setQuestionProperty(e, qIndex, "title")}
                  />
                </FormControl>
                <FormControl sx={{ m: 3 }} error={error} variant="standard">
                  <TextField
                    id={"question-" + `${qIndex + 1}` + "-order"}
                    label={"Question " + `${qIndex + 1}` + " Order"}
                    value={question.order}
                    onChange={(e) => setQuestionProperty(e, qIndex, "order")}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  />
                </FormControl>
                {/* Answers Group Start */}
                {answers[qIndex] &&
                  answers[qIndex].length > 0 &&
                  answers[qIndex].map((anwser, aIndex) => (
                    <Box key={aIndex} sx={{ pl: 4 }}>
                      <Typography>Answer {aIndex + 1}</Typography>
                      <Stack direction="row" alignItems="center">
                        <FormControl
                          sx={{ m: 3 }}
                          error={error}
                          variant="standard"
                        >
                          <TextField
                            id={"anwser-" + `${+aIndex + 1}` + "-content"}
                            label={"Answer " + `${+aIndex + 1}` + " Content"}
                            value={anwser.content}
                            onChange={(e) =>
                              setAnswerProperty(e, qIndex, aIndex, "content")
                            }
                          />
                        </FormControl>
                        <FormControl
                          sx={{ m: 3 }}
                          error={error}
                          variant="standard"
                        >
                          <TextField
                            id={"anwser-" + `${+aIndex + 1}` + "-order"}
                            label={"Anwser " + `${+aIndex + 1}` + " Order"}
                            value={anwser.order}
                            onChange={(e) =>
                              setAnswerProperty(e, qIndex, aIndex, "order")
                            }
                            inputProps={{
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                            }}
                          />
                        </FormControl>
                        <FormControl
                          sx={{ m: 3 }}
                          error={error}
                          variant="standard"
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={anwser.isCorrect}
                                onChange={(e) =>
                                  setAnswerProperty(
                                    e,
                                    qIndex,
                                    aIndex,
                                    "isCorrect"
                                  )
                                }
                                inputProps={{
                                  "aria-label":
                                    "answer-" + aIndex + "-isCorrect",
                                }}
                              />
                            }
                            label="Correct"
                          />
                        </FormControl>
                        <IconButton
                          aria-label="delete"
                          sx={{ mr: 4 }}
                          variant="outlined"
                          onClick={() => removeAnswerHandler(qIndex, aIndex)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Box>
                  ))}
                {/* End of Answers Group */}
                <Button
                  sx={{ mt: 1, mr: 1 }}
                  variant="outlined"
                  onClick={() => addAnswerHandler(qIndex)}
                >
                  Add an answer
                </Button>
                <Button
                  sx={{ mt: 1, mr: 1 }}
                  variant="outlined"
                  onClick={() => removeQuestionHandler(qIndex)}
                >
                  Remove this question
                </Button>
              </Box>
            ))}
          {/* End of Questions Group */}
          <Button
            sx={{ mt: 1, mr: 1 }}
            variant="outlined"
            onClick={addQuestionHandler}
          >
            Add a question
          </Button>
          <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="contained">
            {editMode ? "Submit" : "Add Quiz"}
          </Button>
        </Stack>
      </form>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDropVisible}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default QuizForm;
