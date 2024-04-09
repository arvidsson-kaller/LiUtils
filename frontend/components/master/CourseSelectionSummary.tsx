import { Course, Name, Semester } from "@/common/dist/studieinfo";
import { getNumericCourseCredit } from "@/lib/utils";
import { Box, Card, CardContent } from "@mui/material";

export const CourseSelectionSummary = ({
  courseCodes,
  semester,
}: {
  courseCodes: string[];
  semester: Semester;
}) => {
  const credits: { [key: string]: { value: number; isAdvanced: boolean } } = {}; // How many credits a course gives
  const periodSpans: { [key: string]: number } = {}; // How many periods a course spans over
  const periods: { [key in Name]?: Course[] } = {}; // Which courses are in which period
  for (const specialization of semester?.specializations || []) {
    for (const period of specialization.periods) {
      if (!(period.name in periods)) {
        periods[period.name] = [];
      }
      for (const course of period.courses) {
        if (
          courseCodes.includes(course.courseCode) &&
          !periods[period.name]
            ?.map((c) => c.courseCode)
            .includes(course.courseCode) // Avoid adding same course multiple times in the same period
        ) {
          periods[period.name]?.push(course);
          credits[course.courseCode] = {
            value: getNumericCourseCredit(course),
            isAdvanced: course.level.startsWith("A"),
          };
          if (!(course.courseCode in periodSpans)) {
            periodSpans[course.courseCode] = 0;
          }
          periodSpans[course.courseCode] += 1;
        }
      }
    }
  }

  return (
    <>
      <h2>Summary</h2>
      <h3>Points:</h3>
      <Box>
        <h5>Total</h5>
        <p>{Object.values(credits).reduce((a, b) => a + b.value, 0)}</p>
      </Box>
      {Object.entries(periods).map(([period, courses]) => (
        <Box key={period}>
          <h5>{period}</h5>
          <p>
            {courses
              .map(
                (course) =>
                  credits[course.courseCode].value /
                  periodSpans[course.courseCode],
              )
              .reduce((a, b) => a + b, 0)}
          </p>
        </Box>
      ))}
      <Box>
        <h5>Advanced</h5>
        <p>
          {Object.values(credits).reduce(
            (a, b) => a + (b.isAdvanced ? b.value : 0),
            0,
          )}
        </p>
      </Box>
      <h3>Blocks:</h3>
      {Object.entries(periods).map(([period, courses]) => (
        <Box key={period}>
          <h5>{period}</h5>
          <p>
            {courses
              .map((course) => course.timetableModule)
              .sort()
              .join(", ")}
          </p>
        </Box>
      ))}
    </>
  );
};
