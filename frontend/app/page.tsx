import { Box, Container } from "@mui/material";
import {
  CalendarComponent,
  CalendarEventData,
} from "@/components/master/CalendarComponent";
const ical = require("ical");

export default async function Home() {
  let icsData: CalendarEventData | null = null;
  try {
    const icsText = await (
      await fetch("https://te.liutils.se/tddd27+tdde51+taop88.ics")
    ).text();
    icsData = ical.parseICS(icsText);
  } catch (e) {
    console.error(e);
  }

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
        {icsData ? (
          <CalendarComponent icsData={icsData} />
        ) : (
          <span>Failed to fetch calendar data</span>
        )}
      </Box>
    </Container>
  );
}
