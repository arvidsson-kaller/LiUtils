import { DataGrid } from "@mui/x-data-grid";
import { Fade, Paper, Popper } from "@mui/material";
import React from "react";
import {
  Course,
  PlannedCourse,
  Semester,
  SemesterPlan,
} from "@/lib/backend-client";
import { SemesterPlanOverview } from "../overview/SemesterPlanOverview";
import { getColumns } from "./CourseSelectionGridColumns";

const OverViewPopper = ({
  popperPlan,
  anchorEl,
  open,
  setOpen,
}: {
  popperPlan: SemesterPlan | undefined;
  anchorEl: HTMLButtonElement | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Popper
      sx={{ zIndex: 3000 }}
      open={open}
      anchorEl={anchorEl}
      placement={"left"}
      transition
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper elevation={20}>
            {popperPlan && (
              <SemesterPlanOverview
                plan={popperPlan}
                selectedSpecialization=""
                readOnly={true}
              />
            )}
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export const CourseSelectionGrid = ({
  courses,
  addedCourses,
  onCourseAdd,
  onCourseRemove,
  semesterPlan,
  currentSemester,
  allSemesters,
  semester,
}: {
  courses: Course[];
  addedCourses: PlannedCourse[] | undefined;
  onCourseAdd: (course: Course) => void;
  onCourseRemove: (course: Course) => void;
  semesterPlan: SemesterPlan | undefined;
  currentSemester: Semester;
  allSemesters: Semester[];
  semester: Semester;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [open, setOpen] = React.useState(false);
  const [popperPlan, setPopperPlan] = React.useState<SemesterPlan>();

  const columns = getColumns(
    addedCourses,
    semesterPlan,
    currentSemester,
    allSemesters,
    semester,
    onCourseRemove,
    onCourseAdd,
    setAnchorEl,
    setOpen,
    setPopperPlan,
  );

  return (
    <>
      <DataGrid
        getRowId={(row) => row.courseCode}
        rows={courses}
        columns={columns}
        hideFooterPagination
        disableRowSelectionOnClick
      />
      <OverViewPopper
        anchorEl={anchorEl}
        open={open}
        popperPlan={popperPlan}
        setOpen={setOpen}
      />
    </>
  );
};
