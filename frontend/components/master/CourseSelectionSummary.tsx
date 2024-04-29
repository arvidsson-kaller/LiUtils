import { SemesterPlan } from "@/lib/backend-client";
import { getNumericCourseCredit } from "@/lib/utils";
import { Box } from "@mui/material";

export const CourseSelectionSummary = ({
  semesterPlan,
  selectedSpecialization,
  semesterPlans,
}: {
  semesterPlan?: SemesterPlan;
  selectedSpecialization: string;
  semesterPlans?: SemesterPlan[];
}) => {
  const credits: {
    [key: string]: {
      value: number;
      isAdvanced: boolean;
      isOfSpecialization: boolean;
    };
  } = {}; // How many credits a course gives
  const periodSpans: { [key: string]: number } = {}; // How many periods a course spans over
  for (const semPlan of semesterPlans || (semesterPlan ? [semesterPlan] : [])) {
    for (const period of semPlan.periods) {
      for (const course of period.courses) {
        credits[course.courseCode] = {
          value: getNumericCourseCredit(course),
          isAdvanced: course.level.startsWith("A"),
          isOfSpecialization: Boolean(
            course.specializations.find(
              (specialization) =>
                specialization.name === selectedSpecialization,
            ),
          ),
        };
        if (!(course.courseCode in periodSpans)) {
          periodSpans[course.courseCode] = 0;
        }
        periodSpans[course.courseCode] += 1;
      }
    }
  }

  return (
    <>
      <h3>Points:</h3>
      <Box>
        <h5>Total</h5>
        <p>{Object.values(credits).reduce((a, b) => a + b.value, 0)}</p>
      </Box>
      {semesterPlan && semesterPlan.periods.map((period) => (
        <Box key={`summary-${period.name}`}>
          <h5>{period.name}</h5>
          <p>
            {period.courses
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
      <Box>
        <h5>{selectedSpecialization}</h5>
        <p>
          {Object.values(credits).reduce(
            (a, b) => a + (b.isOfSpecialization ? b.value : 0),
            0,
          )}
        </p>
      </Box>
    </>
  );
};
