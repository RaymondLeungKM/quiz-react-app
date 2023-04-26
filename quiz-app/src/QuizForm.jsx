import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Button,
  TextField,
  Typography,
} from "@mui/material";

function QuizForm() {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizCategory, setQuizCategory] = useState("");
  const [quizDuration, setQuizDuration] = useState("");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(false);

  // Note that questions must be added before their corresponding answers can be added (questionId required)
  // Maybe it is better to separate the questions array and the answers array(maybe a map is better here)
  const addQuestionHandler = () => {
    this.setQuestions((prevState) => {
      const newState = [...prevState];
      newState.push({
        title: "",
        order: 0,
        // There must be 4 answers per question
        answers: [
          {
            content: "",
            order: 0,
            isCorrect: false,
          },
          {
            content: "",
            order: 1,
            isCorrect: false,
          },
          {
            content: "",
            order: 2,
            isCorrect: false,
          },
          {
            content: "",
            order: 3,
            isCorrect: false,
          },
        ],
      });
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("in handleSubmit!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4">Add Quiz Form</Typography>
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
      <Button
        sx={{ mt: 1, mr: 1 }}
        type="submit"
        variant="outlined"
        onClick={addQuestionHandler}
      >
        Add a question
      </Button>
      <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="contained">
        Add Quiz
      </Button>
    </form>
  );
}

export default QuizForm;
