import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Grid,
  Box,
  Button,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchQuizzes, fetchCategories } from "./api/react-query-actions";

function AllQuiz() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    isLoading,
    error,
    data: quizzes,
  } = useQuery(["allQuiz"], fetchQuizzes, {
    placeholderData: [],
  });

  const {
    data: categories,
    isCategoryLoading,
    isCatgegoryError,
  } = useQuery(["allCategory"], fetchCategories, {
    placeholderData: [],
  });

  const navigate = useNavigate();

  return (
    <Box>
      {!selectedCategory && (
        <>
          <Typography variant="h3" marginBottom={4}>
            Browse by category:
          </Typography>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap={4}
            columns={{ xs: 4, sm: 12 }}
          >
            {categories.length > 0 &&
              categories.map((category) => (
                <Grid
                  item
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  xs={4}
                  sm={4}
                  md={4}
                  key={category.id}
                >
                  <Card
                    sx={{ minWidth: "350px", width: "30rem", height: "200px" }}
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardActionArea sx={{ width: "100%", height: "100%" }}>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {category.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </>
      )}

      {selectedCategory && (
        <>
          <Typography variant="h6">
            Selected Category:
            <Button variant="outlined" endIcon={<ClearIcon />} sx={{ ml: 2 }} onClick={() => setSelectedCategory(null)}>
              {categories.find((cat) => cat.id == selectedCategory).name}
            </Button>
          </Typography>

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
              quizzes
                .filter(
                  (quiz) =>
                    quiz.category.find((cat) => cat.id == selectedCategory) !=
                    null
                )
                .map((quiz) => (
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
                      sx={{
                        width: "30rem",
                        minWidth: "300px",
                        height: "200px",
                      }}
                      key={quiz.id}
                      onClick={() => navigate(`/quiz/${quiz.id}`)}
                    >
                      <CardActionArea sx={{ width: "100%", height: "100%" }}>
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            Quiz Name: {quiz.quiz_name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 4 }}
                          >
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
                                    py: 1,
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
            {quizzes.length == 0 && <>No Quizzes yet!</>}
          </Grid>
        </>
      )}

      {isLoading && <p>Loading...</p>}
      {error && <p>Something wrong!</p>}
    </Box>
  );
}

export default AllQuiz;
