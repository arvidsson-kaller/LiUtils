import {
  Course,
  MasterPlan,
  Period,
  PeriodName,
  PlannedCourseSpecialization,
  Semester,
  SemesterPlan,
} from "@/lib/backend-client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListSubheader,
  Modal,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import { CourseSelectionSummary } from "./CourseSelectionSummary";
import { SemesterPlanOverview } from "./SemesterPlanOverview";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CourseSelectionGrid } from "./CourseSelectionGrid";

const ModalBox = styled(Box)({
  position: "absolute",
  top: "10vh",
  left: "10vw",
  backfaceVisibility: "hidden",
  width: "80vw",
  backgroundColor: "white",
  padding: "1.5em",
  borderRadius: "3px",
  display: "flex",
  flexDirection: "column",
  gap: 1,
});

const StyledAccordion = styled(Accordion)({
  width: "100%",
});

export function Courses({
  currentSemester,
  allSemesters,
  addOrUpdateSemesterPlan,
  currentPlan,
}: {
  currentSemester: Semester;
  allSemesters: Semester[];
  addOrUpdateSemesterPlan: (semesterPlan: SemesterPlan) => void;
  currentPlan: MasterPlan;
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [blockFilter, setBlockFilter] = React.useState<string | undefined>();
  const [periodFilter, setPeriodFilter] = React.useState<string | undefined>();
  const handleOpen = (
    blockFilter: string | undefined = undefined,
    periodFilter: string | undefined = undefined,
  ) => {
    setBlockFilter(blockFilter);
    setPeriodFilter(periodFilter);
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setBlockFilter(undefined);
    setPeriodFilter(undefined);
    setIsModalOpen(false);
  };

  const [semesterPlan, setSemesterPlan] = React.useState<SemesterPlan>();

  React.useEffect(() => {
    const semPlan: SemesterPlan = { name: currentSemester.name, periods: [] };
    const periods = new Set<PeriodName>();
    for (const specialization of currentSemester.specializations) {
      for (const period of specialization.periods) {
        periods.add(period.name);
      }
    }
    for (const uniquePeriod of Array.from(periods)) {
      semPlan.periods.push({ name: uniquePeriod, courses: [] });
    }
    setSemesterPlan(semPlan);
  }, [currentSemester]);

  React.useEffect(() => {
    const savedSemester = currentPlan.semesters.find(
      (sem) => sem.name === currentSemester.name,
    );
    if (savedSemester) setSemesterPlan(savedSemester);
  }, [currentPlan, currentSemester]);

  const updateSemesterPlan = (semesterPlan: SemesterPlan) => {
    setSemesterPlan(semesterPlan);
    addOrUpdateSemesterPlan(semesterPlan);
  };

  const addCourse = (
    course: Course,
    semester: Semester,
    allSemesters: Semester[],
  ) => {
    if (!semesterPlan) {
      return;
    }
    const semesterPlanCopy = structuredClone(semesterPlan);
    // Create list of all specializations that have the course
    const plannedSpecializations: PlannedCourseSpecialization[] = [];
    const coursePeriods: Period[] = [];
    for (const sem of allSemesters) {
      for (const spec of sem.specializations) {
        for (const per of spec.periods) {
          for (const cor of per.courses) {
            if (cor.courseCode === course.courseCode) {
              if (!plannedSpecializations.find((s) => s.name === spec.name)) {
                plannedSpecializations.push({
                  name: spec.name,
                  ECV: cor.ECV,
                });
              }
              if (!coursePeriods.find((p) => p.name === per.name)) {
                coursePeriods.push(per);
              }
            }
          }
        }
      }
    }
    for (const coursePeriod of coursePeriods) {
      const existingPeriodPlan = semesterPlanCopy.periods.find(
        (p) => p.name === coursePeriod.name,
      );
      const courseInPeriod = coursePeriod.courses.find(
        (c) => c.courseCode === course.courseCode,
      );
      if (!courseInPeriod) {
        continue;
      }
      // Only add the course if it is not already added
      if (
        !existingPeriodPlan?.courses.find(
          (c) => c.courseName === course.courseName,
        )
      ) {
        existingPeriodPlan?.courses.push({
          ...courseInPeriod,
          semester:
            currentSemester.name === semester.name ? null : semester.name,
          note: "",
          specializations: plannedSpecializations,
        });
      }
    }
    updateSemesterPlan(semesterPlanCopy);
  };

  const removeCourse = (course: Course) => {
    if (!semesterPlan) {
      return;
    }
    const semesterPlanCopy = structuredClone(semesterPlan);
    for (const periodPlan of semesterPlanCopy.periods) {
      periodPlan.courses = periodPlan.courses.filter(
        (plannedCourse) => plannedCourse.courseCode !== course.courseCode,
      );
    }
    updateSemesterPlan(semesterPlanCopy);
  };

  const getFilteredCourses = (courses: Course[]) => {
    return courses.filter((course) =>
      blockFilter ? course.timetableModule.includes(blockFilter) : true,
    );
  };

  return (
    <Box>
      <h4>Selected Courses</h4>
      {semesterPlan && (
        <>
          <Card sx={{ width: "100%" }}>
            <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <CourseSelectionSummary
                semesterPlan={semesterPlan}
                selectedSpecialization={currentPlan.specialization}
              />
            </CardContent>
          </Card>
          <SemesterPlanOverview
            plan={semesterPlan}
            selectedSpecialization={currentPlan.specialization}
            onAddCourse={(block, period) => handleOpen(block, period)}
            onClickCourse={(course) => console.log(course)}
          />
        </>
      )}
      <Button variant="contained" color="success" onClick={() => handleOpen()}>
        <AddIcon />
        Add Course
      </Button>
      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBox sx={{ overflow: "auto", maxHeight: "80svh", width: "80vw" }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select course to add
          </Typography>
          <List
            dense
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              maxHeight: "100%",
            }}
            subheader={<li />}
          >
            {allSemesters.map((semester, semIndex) => (
              <li key={`semester-${semester.name}-${semIndex}`}>
                <ul>
                  <StyledAccordion
                    variant="outlined"
                    defaultExpanded={currentSemester.name === semester.name}
                    slotProps={{ transition: { unmountOnExit: true } }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      {semester.name}
                    </AccordionSummary>
                    <AccordionDetails>
                      {semester.specializations.map(
                        (specialization, specIndex) => (
                          <li
                            key={`specialization-${specialization.name}-${specIndex}`}
                          >
                            <ul>
                              <ListSubheader
                                disableSticky
                              >{`${specialization.name}`}</ListSubheader>
                              {specialization.periods
                                .filter((period) =>
                                  periodFilter
                                    ? period.name === periodFilter
                                    : true,
                                )
                                .map((period, perIndex) => (
                                  <li
                                    key={`period-${specialization.name}-${perIndex}`}
                                  >
                                    <ul>
                                      <ListSubheader
                                        disableSticky
                                      >{`${period.name}`}</ListSubheader>
                                      <CourseSelectionGrid
                                        courses={getFilteredCourses(
                                          period.courses,
                                        )}
                                        addedCourses={
                                          semesterPlan?.periods.find(
                                            (p) => p.name === period.name,
                                          )?.courses
                                        }
                                        onCourseAdd={(course) =>
                                          addCourse(
                                            course,
                                            semester,
                                            allSemesters,
                                          )
                                        }
                                        onCourseRemove={removeCourse}
                                      />
                                    </ul>
                                  </li>
                                ))}
                            </ul>
                          </li>
                        ),
                      )}
                    </AccordionDetails>
                  </StyledAccordion>
                </ul>
              </li>
            ))}
          </List>
        </ModalBox>
      </Modal>
    </Box>
  );
}
