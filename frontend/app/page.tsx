import { Box, Container } from "@mui/material";

export default function Home() {
  return (
    <Container>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Hello World!</h1>
      </Box>
    </Container>
  );
}
