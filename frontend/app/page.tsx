import { Box, Container } from "@mui/material";
import { getUserSession } from "@/lib/session";

export default async function Home() {
  const user = await getUserSession();
  return (
    <Container>
      <Box
        sx={{
          height: "calc(100vh - 64px)",
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
