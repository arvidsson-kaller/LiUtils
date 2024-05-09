import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  Modal,
  Typography,
  styled,
} from "@mui/material";
import { CourseSelectionSummary } from "../CourseSelectionSummary";
import { Courses } from "./Courses";
import { MasterPlan, Semester, SemesterPlan } from "@/lib/backend-client";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StyledListItem = styled(ListItem)({
  width: "100%",
});

const StyledAccordion = styled(Accordion)({
  width: "100%",
});

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

export function Semesters({
  allSemesters,
  addedSemesters,
  setAddedSemesters,
  addOrUpdateSemesterPlan,
  currentPlan,
}: {
  allSemesters: Semester[] | undefined;
  addedSemesters: Semester[];
  setAddedSemesters: React.Dispatch<React.SetStateAction<Semester[]>>;
  addOrUpdateSemesterPlan: (semesterPlan: SemesterPlan) => void;
  currentPlan: MasterPlan;
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  if (!allSemesters) return <></>;
  return (
    <>
      <h3>Semesters</h3>
      <Card sx={{ width: "100%" }}>
        <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <CourseSelectionSummary
            semesterPlans={currentPlan.semesters}
            selectedSpecialization={currentPlan.specialization}
          />
        </CardContent>
      </Card>
      <List sx={{ width: "100%" }}>
        {addedSemesters.map((semester, i) => (
          <StyledListItem key={`list-semester-${i}`}>
            <StyledAccordion variant="outlined">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {semester.name}
              </AccordionSummary>
              <AccordionDetails>
                <Courses
                  currentSemester={semester}
                  allSemesters={allSemesters}
                  addOrUpdateSemesterPlan={addOrUpdateSemesterPlan}
                  currentPlan={currentPlan}
                />
              </AccordionDetails>
            </StyledAccordion>
          </StyledListItem>
        ))}
        {allSemesters.length > addedSemesters.length && (
          <StyledListItem>
            <Button variant="contained" color="success" onClick={handleOpen}>
              <AddIcon />
              Add Semester
            </Button>
          </StyledListItem>
        )}
      </List>
      <Modal
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBox>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select semester to add
          </Typography>
          {allSemesters
            .filter((semester) => !addedSemesters.includes(semester))
            .map((semester, i) => (
              <Button
                onClick={() =>
                  setAddedSemesters(
                    [...addedSemesters, semester].sort(
                      (a, b) =>
                        allSemesters.indexOf(a) - allSemesters.indexOf(b),
                    ),
                  )
                }
                key={`semester-add-${i}`}
                variant="outlined"
                color="inherit"
              >
                {semester.name}
                <AddIcon />
              </Button>
            ))}
        </ModalBox>
      </Modal>
    </>
  );
}
