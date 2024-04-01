import { Box, Container } from "@mui/material";
import { getUserSession } from "@/lib/session";
import SignIn from "@/components/SignIn";

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
        <pre>{JSON.stringify(user)}</pre>
        <SignIn />
      </Box>
    </Container>
  );
}
