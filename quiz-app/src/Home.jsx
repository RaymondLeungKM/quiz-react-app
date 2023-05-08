import { Typography, Box, Fade } from "@mui/material";

function Home() {
  return (
    <>
      <Fade in={true} timeout={3000} >
        <Box>
          <Typography variant="h2" marginBottom={4}>
            Weclome to the Quiz App!
          </Typography>
        </Box>
      </Fade>
    </>
  );
}

export default Home;
