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
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchQuizzes, fetchCategories } from "./api/react-query-actions";
import BackdropContext from "./context/BackdropContext";

import { motion, AnimatePresence } from "framer-motion";

function AllQuiz() {
  const backdropContext = useContext(BackdropContext);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    isLoading,
    error,
    data: quizzes,
  } = useQuery(["allQuiz"], fetchQuizzes);

  useEffect(() => {
    if (isLoading) {
      backdropContext.show();
    } else {
      backdropContext.hide();
    }
  }, [isLoading]);

  const {
    data: categories,
    isCategoryLoading,
    isCatgegoryError,
  } = useQuery(["allCategory"], fetchCategories);

  const navigate = useNavigate();

  return (
    <Box>
      {!selectedCategory && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Typography variant="h3" marginBottom={4}>
              Browse by category:
            </Typography>

            <Grid
              component={motion.div}
              layout
              container
              direction="row"
              alignItems="center"
              rowGap={4}
            >
              {categories &&
                categories.length > 0 &&
                categories.map((category) => (
                  <Grid
                    item
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexGrow={1}
                    maxWidth="50%"
                    key={category.id}
                  >
                    <Card
                      sx={{
                        width: "30rem",
                        minWidth: "300px",
                        height: "200px",
                      }}
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
          </motion.div>
        </AnimatePresence>
      )}

      {selectedCategory && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Typography variant="h6">
              Selected Category:
              <Button
                variant="outlined"
                endIcon={<ClearIcon />}
                sx={{ ml: 2 }}
                onClick={() => setSelectedCategory(null)}
              >
                {categories.find((cat) => cat.id == selectedCategory).name}
              </Button>
            </Typography>

            <Typography variant="h3" marginBottom={4}>
              All Quizzes:
            </Typography>

            {quizzes.length > 0 && (
              <Grid
                component={motion.div}
                layout
                container
                direction="row"
                alignItems="center"
                rowGap={4}
              >
                {quizzes
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
                      key={quiz.id}
                      flexGrow={1}
                      maxWidth="50%"
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
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
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
              </Grid>
            )}
            {quizzes.filter(
              (quiz) =>
                quiz.category.find((cat) => cat.id == selectedCategory) != null
            ).length == 0 && <>No Quizzes yet!</>}
          </motion.div>
        </AnimatePresence>
      )}
      {error && <p>Something wrong!</p>}
    </Box>
  );
}

export default AllQuiz;
