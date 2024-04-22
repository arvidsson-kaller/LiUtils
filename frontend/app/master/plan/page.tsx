"use client";
import { ProxyBackendService } from "@/lib/backend";
import {
  CoursesResponseDTO,
  MasterProgramDTO,
  ProgramsResponseDTO,
  Semester,
  Specialization,
  StartYearDTO,
  StartYearResponseDTO,
} from "@/lib/backend-client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListSubheader,
  Modal,
  Popper,
  SxProps,
  TextField,
  Theme,
  Typography,
  styled,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";

const columns: GridColDef[] = [
  { field: "courseCode", headerName: "Course", flex: 1 },
  {
    field: "courseName",
    headerName: "Name",
    flex: 5,
    renderCell: (params: GridRenderCellParams<any, Date>) => (
      <Link
        target="_blank"
        referrerPolicy="no-referrer"
        href={`https://studieinfo.liu.se/kurs/${params.row.courseCode}`}
      >
        {params.row.courseName}
      </Link>
    ),
  },
  { field: "credits", headerName: "Credits", flex: 1 },
  { field: "level", headerName: "Level", flex: 1 },
  {
    field: "timetableModule",
    headerName: "Block",
    flex: 1,
    description: "Timetable Module/Block",
  },
  {
    field: "ECV",
    headerName: "ECV",
    flex: 1,
    description: "Elective/Compulsory/Voluntary",
  },
  {
    field: "exam",
    headerName: "Exam",
    flex: 1,
    renderCell: (params: GridRenderCellParams<any, Date>) => (
      <Link
        style={{ display: "flex", alignItems: "center", height: "100%" }}
        target="_blank"
        referrerPolicy="no-referrer"
        href={`https://ysektionen.se/student/tentastatistik/${params.row.courseCode}`}
      >
        <AssessmentIcon />
      </Link>
    ),
  },
  {
    field: "evaliuate",
    headerName: "Evaliuate",
    flex: 1,
    renderCell: (params: GridRenderCellParams<any, Date>) => (
      <Link
        style={{ display: "flex", alignItems: "center", height: "100%" }}
        target="_blank"
        referrerPolicy="no-referrer"
        href={`https://admin.evaliuate.liu.se/search/#${params.row.courseCode}`} // The course code has no effect on the link, it is just there to indicate which link was pressed
      >
        <HistoryEduIcon />
      </Link>
    ),
  },
  {
    field: "info",
    headerName: "Info",
    flex: 1,
    renderCell: (params: GridRenderCellParams<any, Date>) => (
      <InfoPopper info={params.row.info} />
    ),
  },
];

const InfoPopper = ({ info }: { info: string }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const infoRef = React.useRef(null);

  return info ? (
    <>
      <Button ref={infoRef} onClick={() => setOpen(!open)}>
        <InfoIcon />
      </Button>
      <Popper open={open} anchorEl={infoRef.current} placement="right">
        <Box sx={{ border: 1, p: 1, zIndex: 1000, bgcolor: "background.paper" }}>{info}</Box>
      </Popper>
    </>
  ) : (
    <></>
  );
};

export default function MasterPlan() {
  const [allPrograms, setAllPrograms] =
    React.useState<ProgramsResponseDTO | null>(null);
  const [allStartYears, setAllStartYears] =
    React.useState<StartYearResponseDTO | null>(null);
  const [allCourses, setAllCourses] = React.useState<CoursesResponseDTO | null>(
    null,
  );

  const [selectedProgram, setSelectedProgram] =
    React.useState<MasterProgramDTO | null>(null);
  const [selectedStartYear, setSelectedStartYear] =
    React.useState<StartYearDTO | null>(null);
  const [addedSemesters, setAddedSemesters] = React.useState<Semester[]>([]);

  React.useEffect(() => {
    ProxyBackendService.getAllPrograms().then(setAllPrograms);
  }, []);

  React.useEffect(() => {
    if (selectedProgram?.id) {
      setAllStartYears(null);
      setAddedSemesters([]);
      ProxyBackendService.getStartYears({
        programId: selectedProgram?.id,
      }).then(setAllStartYears);
    }
  }, [selectedProgram]);

  React.useEffect(() => {
    if (selectedStartYear?.id) {
      setAllCourses(null);
      setAddedSemesters([]);
      ProxyBackendService.getCourses({
        startYearId: selectedStartYear?.id,
      }).then(setAllCourses);
    }
  }, [selectedStartYear]);
  return (
    <Container
      sx={{
        display: "flex",
        bgcolor: "background.paper",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)",
        gap: 2,
      }}
    >
      <h1>Create Master Plan</h1>
      <ProgramAndStartYearSelection
        allPrograms={allPrograms}
        setSelectedProgram={setSelectedProgram}
        selectedProgram={selectedProgram}
        allStartYears={allStartYears}
        setSelectedStartYear={setSelectedStartYear}
      />
      {selectedStartYear &&
        (allCourses ? (
          <Semesters
            allSemesters={allCourses?.data?.semesters}
            addedSemesters={addedSemesters}
            setAddedSemesters={setAddedSemesters}
          />
        ) : (
          <CircularProgress />
        ))}
    </Container>
  );
}

const StyledListItem = styled(ListItem)({
  width: "100%",
});

function ModalBox(props: { children: React.ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "40vw",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        ...props.sx,
      }}
    >
      {props.children}
    </Box>
  );
}

function Courses({
  allSpecializations,
}: {
  allSpecializations: Specialization[];
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
  return (
    <Box>
      <h4>Selected Courses</h4>
      <Button variant="contained" color="success" onClick={handleOpen}>
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
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              maxHeight: "100%",
              "& ul": { padding: 0 },
            }}
            subheader={<li />}
          >
            {allSpecializations.map((specialization, specIndex) => (
              <li key={`specialization-${specialization.name}-${specIndex}`}>
                <ul>
                  <ListSubheader disableSticky>{`${specialization.name}`}</ListSubheader>
                  {allSpecializations[specIndex].periods.map(
                    (period, perIndex) => (
                      <li key={`period-${specialization.name}-${perIndex}`}>
                        <ul>
                          <ListSubheader disableSticky>{`${period.name}`}</ListSubheader>
                          <DataGrid
                            getRowId={(row) => row.courseCode}
                            rows={allSpecializations[specIndex].periods[
                              perIndex
                            ].courses.map((course) => {
                              return { ...course, period: period };
                            })}
                            columns={columns}
                            hideFooterPagination
                          />
                        </ul>
                      </li>
                    ),
                  )}
                </ul>
              </li>
            ))}
          </List>
        </ModalBox>
      </Modal>
    </Box>
  );
}

function Semesters({
  allSemesters,
  addedSemesters,
  setAddedSemesters,
}: {
  allSemesters: Semester[] | undefined;
  addedSemesters: Semester[];
  setAddedSemesters: React.Dispatch<React.SetStateAction<Semester[]>>;
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  if (!allSemesters) return <></>;
  return (
    <>
      <h3>Semesters</h3>
      <List sx={{ width: "100%" }}>
        {addedSemesters.map((semester, i) => (
          <StyledListItem key={`list-semester-${i}`}>
            <Accordion sx={{ width: "100%" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {semester.name}
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Courses allSpecializations={semester.specializations} />
              </AccordionDetails>
            </Accordion>
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

function ProgramAndStartYearSelection({
  allPrograms,
  setSelectedProgram,
  selectedProgram,
  allStartYears: allStartYears,
  setSelectedStartYear,
}: {
  allPrograms: ProgramsResponseDTO | null;
  setSelectedProgram: React.Dispatch<
    React.SetStateAction<MasterProgramDTO | null>
  >;
  selectedProgram: MasterProgramDTO | null;
  allStartYears: StartYearResponseDTO | null;
  setSelectedStartYear: React.Dispatch<
    React.SetStateAction<StartYearDTO | null>
  >;
}) {
  return (
    <>
      {allPrograms ? (
        <Autocomplete
          disablePortal
          id="program-selection"
          options={allPrograms.programs.sort((a, b) =>
            a.name.localeCompare(b.name),
          )}
          sx={{ width: "100%" }}
          renderInput={(params) => <TextField {...params} label="Program" />}
          onChange={(_, option) => setSelectedProgram(option)}
          getOptionLabel={(opt) => opt.name}
        />
      ) : (
        <CircularProgress />
      )}
      {selectedProgram &&
        (allStartYears ? (
          <Autocomplete
            disablePortal
            id="program-selection"
            options={allStartYears.startYears.sort((a, b) =>
              b.name.localeCompare(a.name),
            )}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Start Year" />
            )}
            onChange={(_, option) => setSelectedStartYear(option)}
            getOptionLabel={(opt) => opt.name}
          />
        ) : (
          <CircularProgress />
        ))}
    </>
  );
}
