import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  } = useQuery(["allQuiz"], fetchQuizzes, {
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
            gap={4}
            columns={{ xs: 4, sm: 12 }}
          >
            {quizzes.length > 0 &&
              quizzes.map((quiz) => (
                <Grid
                  item
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  xs={4}
                  sm={4}
                  md={4}
                  key={quiz.id}
                >
                  <Card
                    sx={{ width: "500px", height: "200px" }}
                    key={quiz.id}
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                  >
                    <CardActionArea sx={{ width: "100%", height: "100%" }}>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          Quiz Name: {quiz.quiz_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 4}}>
                          {quiz.category &&
                            quiz.category.map((cat) => (
                              <Typography
                                variant="span"
                                key={cat.id}
                                sx={{
                                  border: "1px solid",
                                  borderRadius: 999,
                                  mx: 1,
                                  px: 2,
                                  py: 1
                                }}
                              >
                                {cat.name}
                              </Typography>
                            ))}
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
