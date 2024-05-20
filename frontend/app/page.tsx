import { Box, Container } from "@mui/material";
import { CalendarComponent } from "@/components/master/CalendarComponent";
import { getUserSession } from "@/lib/session";

export default async function Home() {
  const user = await getUserSession();

  return (
    <Container sx={{ backgroundColor: "white" }}>
      <Box
        sx={{
          height: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>LiUtils</h1>
        <CalendarComponent user={user} />
      </Box>
    </Container>
  );
}
