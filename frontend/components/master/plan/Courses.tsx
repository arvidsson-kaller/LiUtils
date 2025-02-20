import {
  Course,
  MasterPlan,
  Period,
  PeriodName,
  PlannedCourse,
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
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import { CourseSelectionSummary } from "../CourseSelectionSummary";
import { SemesterPlanOverview } from "../overview/SemesterPlanOverview";
import AddIcon from "@mui/icons-material/Add";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CourseSelectionGrid } from "./CourseSelectionGrid";
import Link from "next/link";
import {
  addCourseToSemesterPlan,
  removeCourseFromSemesterPlan,
} from "@/lib/utils";

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
  const [openCourse, setOpenCourse] = React.useState<PlannedCourse | null>(
    null,
  );
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
    addCourseToSemesterPlan(
      course,
      semesterPlanCopy,
      semester,
      allSemesters,
      currentSemester,
    );
    updateSemesterPlan(semesterPlanCopy);
  };

  const removeCourse = (course: Course | PlannedCourse) => {
    if (!semesterPlan) {
      return;
    }
    const semesterPlanCopy = structuredClone(semesterPlan);
    removeCourseFromSemesterPlan(course, semesterPlanCopy);
    updateSemesterPlan(semesterPlanCopy);
  };

  const updateCourseNote = (course: Course | PlannedCourse, note: string) => {
    if (!semesterPlan) {
      return;
    }
    const semesterPlanCopy = structuredClone(semesterPlan);

    for (const periodPlan of semesterPlanCopy.periods) {
      const foundCourse = periodPlan.courses.find(
        (plannedCourse) => plannedCourse.courseCode === course.courseCode,
      );
      if (foundCourse) {
        foundCourse.note = note;
      }
    }
    updateSemesterPlan(semesterPlanCopy);
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
            onClickCourse={(course) => setOpenCourse(course)}
          />
        </>
      )}
      <Button variant="contained" color="success" onClick={() => handleOpen()}>
        <AddIcon />
        Add Course
      </Button>
      <CourseSelectionModal
        isModalOpen={isModalOpen}
        allSemesters={allSemesters}
        currentSemester={currentSemester}
        addCourse={addCourse}
        semesterPlan={semesterPlan}
        removeCourse={removeCourse}
        blockFilter={blockFilter}
        periodFilter={periodFilter}
        handleClose={handleClose}
        spec={currentPlan.specialization}
      />
      <OpenCourseModal
        key={openCourse?.courseCode}
        openCourse={openCourse}
        setOpenCourse={setOpenCourse}
        updateCourseNote={updateCourseNote}
        removeCourse={removeCourse}
      />
    </Box>
  );
}

function OpenCourseModal({
  openCourse,
  setOpenCourse,
  updateCourseNote,
  removeCourse,
}: {
  openCourse: PlannedCourse | null;
  setOpenCourse: (course: PlannedCourse | null) => void;
  updateCourseNote: (course: PlannedCourse, note: string) => void;
  removeCourse: (course: PlannedCourse) => void;
}) {
  const [note, setNote] = React.useState<string>(openCourse?.note || "");

  return (
    <Modal
      open={openCourse !== null}
      onClose={() => {
        if (openCourse) {
          updateCourseNote(openCourse, note);
        }
        setOpenCourse(null);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalBox sx={{ overflow: "auto", height: "80svh", width: "80vw" }}>
        {openCourse && (
          <>
            <Typography variant="h6" component="h2">
              {openCourse.courseCode} - {openCourse.courseName}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              {openCourse.credits} Credits {openCourse.level} - {openCourse.ECV}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                paddingBottom: 3,
              }}
            >
              <Link
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
                target="_blank"
                referrerPolicy="no-referrer"
                href={`https://admin.evaliuate.liu.se/search/#${openCourse.courseCode}`} // The course code has no effect on the link, it is just there to indicate which link was pressed
              >
                <HistoryEduIcon /> Evaliuate
              </Link>
              <Link
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
                target="_blank"
                referrerPolicy="no-referrer"
                href={`https://ysektionen.se/student/tentastatistik/${openCourse.courseCode}`}
              >
                <AssessmentIcon /> Exam Statistics
              </Link>
            </Box>
            <TextField
              sx={{ width: "100%" }}
              label="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              maxRows={4}
            />
            <Box sx={{ alignSelf: "flex-end", marginTop: "auto" }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  updateCourseNote(openCourse, note);
                  removeCourse(openCourse);
                  setOpenCourse(null);
                }}
              >
                Remove Course
              </Button>
              <Button
                variant="contained"
                color="info"
                onClick={() => {
                  updateCourseNote(openCourse, note);
                  setOpenCourse(null);
                }}
              >
                Save & Close
              </Button>
            </Box>
          </>
        )}
      </ModalBox>
    </Modal>
  );
}

function CourseSelectionModal({
  isModalOpen,
  allSemesters,
  currentSemester,
  addCourse,
  semesterPlan,
  removeCourse,
  blockFilter,
  periodFilter,
  handleClose,
  spec,
}: {
  isModalOpen: boolean;
  allSemesters: Semester[];
  currentSemester: Semester;
  addCourse: (
    course: Course,
    semester: Semester,
    allSemesters: Semester[],
  ) => void;
  semesterPlan: SemesterPlan | undefined;
  removeCourse: (course: Course) => void;
  blockFilter: string | undefined;
  periodFilter: string | undefined;
  handleClose: () => void;
  spec: string;
}) {
  const getFilteredCourses = (courses: Course[]) => {
    return courses.filter((course) =>
      blockFilter ? course.timetableModule.includes(blockFilter) : true,
    );
  };

  return (
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
                                      semesterPlan={semesterPlan}
                                      allSemesters={allSemesters}
                                      currentSemester={currentSemester}
                                      semester={semester}
                                      spec={spec}
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
  );
}
