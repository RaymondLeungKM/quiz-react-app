import * as React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ColorModeContext from "./context/ColorModeContext";

import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Grid,
  Box,
} from "@mui/material";

const fetchQuizzes = () =>
  axios.get("http://localhost:3000/quiz").then((res) => res.data);

function Home() {
  const {
    isLoading,
    error,
    data: quizzes,
  } = useQuery("allQuiz", fetchQuizzes, {
    placeholderData: [],
  });

  const navigate = useNavigate();

  return (
    <>
      <Box>
        <Typography variant="h2" marginBottom={4}>
          Weclome to the Quiz App!
        </Typography>
        <Box>
          <Typography variant="h3" marginBottom={4}>
            All Quizzes:
          </Typography>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={0}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {quizzes.length > 0 &&
              quizzes.map((quiz) => (
                <Grid
                  item
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  xs={2}
                  sm={4}
                  md={4}
                  key={quiz.id}
                >
                  <Card
                    sx={{ maxWidth: 200 }}
                    key={quiz.id}
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          Quiz Name: {quiz.quiz_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Category: {quiz.category}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
          </Grid>
          {isLoading && <p>Loading...</p>}
          {error && <p>Something wrong!</p>}
        </Box>
      </Box>
    </>
  );
}

export default Home;
