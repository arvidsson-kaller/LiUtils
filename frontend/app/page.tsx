import { Box, Container } from "@mui/material";
import {
  CalendarComponent,
  CalendarEventData,
} from "@/components/master/CalendarComponent";
import { getUserSession } from "@/lib/session";
import { BackendService } from "@/lib/backend";
const ical = require("ical");

export default async function Home() {
  let icsData: CalendarEventData | null = null;
  let teProxyURL: string | null = null;
  const user = await getUserSession();
  if (user?.choosenMasterPlan) {
    const chosenPlan = await BackendService.getMasterPlanById({
      id: user.choosenMasterPlan,
    });
    const currentYear = new Date().getFullYear().toString();
    const activeSemesters = chosenPlan.plan.semesters.filter((semester) =>
      semester.name.includes(currentYear),
    );
    const activeCourses = Array.from(
      new Set(
        activeSemesters.flatMap((semester) =>
          semester.periods.flatMap((period) =>
            period.courses.map((course) => course.courseCode),
          ),
        ),
      ),
    );
    teProxyURL = `https://te.liutils.se/${activeCourses.join("+")}`
    try {
      const icsText = await (
        await fetch(`${teProxyURL}.ics`)
      ).text();
      icsData = ical.parseICS(icsText);
    } catch (e) {
      console.error(e);
    }
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
        {icsData && teProxyURL ? (
          <CalendarComponent icsData={icsData} teProxyURL={teProxyURL} />
        ) : (
          <span>Failed to fetch calendar data</span>
        )}
      </Box>
    </Container>
  );
}
