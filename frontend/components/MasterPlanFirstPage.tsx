"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Fade,
  Paper,
  Popper,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect } from "react";
import { ExpandMore } from "@mui/icons-material";
import {
  MasterPlanResponseDTO,
  MasterProgramDTO,
  ProgramsResponseDTO,
  SemesterPlan,
  StartYearDTO,
  StartYearResponseDTO,
  UserDTO,
} from "@/lib/backend-client";
import { SemesterPlanOverview } from "./master/overview/SemesterPlanOverview";
import { specLabel } from "@/lib/master/helpers";
import SpecializationOverview from "./master/overview/SpecializationOverview";
import SemestersOverview, {
  SemesterPlanWithSpec,
} from "./master/overview/SemestersOverview";
import NextLink from "./NextLink";
import { ProxyBackendService } from "@/lib/backend";
import { ProgramAndStartYearSelection } from "./master/plan/ProgramAndStartYearSelection";

const StyledAccordian = styled(Accordion)({
  width: "100%",
});

export default function MasterPlanFirstPage({
  myMasterPlans: previewMyMasterPlans,
  allMasterPlans,
  user,
  allPrograms,
}: {
  myMasterPlans?: MasterPlanResponseDTO[];
  allMasterPlans: MasterPlanResponseDTO[];
  user?: UserDTO;
  allPrograms: ProgramsResponseDTO;
}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [open, setOpen] = React.useState(false);
  const [popperSemester, setPopperPlan] =
    React.useState<SemesterPlanWithSpec>();

  const [myMasterPlans, setMyMasterPlans] = React.useState<
    MasterPlanResponseDTO[] | undefined
  >(previewMyMasterPlans);

  useEffect(() => {
    if (user) {
      ProxyBackendService.getMyMasterPlans().then((plans) =>
        setMyMasterPlans(plans),
      );
    }
  }, [user]);

  const handleSemesterHover = (
    event: React.MouseEvent<any> | null,
    plan: SemesterPlanWithSpec,
    open: boolean,
  ) => {
    if (event) {
      setAnchorEl(event.currentTarget);
    }
    setOpen((prev) => open);
    setPopperPlan(plan);
  };

  const [allStartYears, setAllStartYears] =
    React.useState<StartYearResponseDTO | null>(null);
  const [selectedProgram, setSelectedProgram] =
    React.useState<MasterProgramDTO | null>(null);
  const [selectedStartYear, setSelectedStartYear] =
    React.useState<StartYearDTO | null>(null);

  const updateSelectedStartYear = React.useCallback(
    (startYear: StartYearDTO | null) => {
      setSelectedStartYear(startYear);
    },
    [],
  );
  const updateSelectedProgram = React.useCallback(
    (program: MasterProgramDTO | null) => {
      setSelectedProgram(program);
      if (program) {
        setSelectedStartYear(null);
        ProxyBackendService.getStartYears({
          programId: program.id,
        }).then(setAllStartYears);
      }
    },
    [],
  );

  const allNotEmptyMasterPlans = React.useMemo(() => {
    return allMasterPlans.filter(
      (p) =>
        p.plan.semesters.flatMap((s) => s.periods.flatMap((p) => p.courses))
          .length > 6,
    );
  }, [allMasterPlans]);

  const filteredMasterPlans = React.useMemo(() => {
    let plans = allNotEmptyMasterPlans;
    if (selectedProgram) {
      plans = plans.filter((p) => p.plan.program.id === selectedProgram.id);
    }
    if (selectedStartYear) {
      plans = plans.filter((p) => p.plan.startYear.id === selectedStartYear.id);
    }
    return plans;
  }, [selectedProgram, selectedStartYear, allNotEmptyMasterPlans]);

  return (
    <Box sx={{ width: "100%" }}>
      <Popper
        sx={{ zIndex: 1200 }}
        open={open}
        anchorEl={anchorEl}
        placement={"right"}
        transition
        onMouseOver={() => handleSemesterHover(null, popperSemester!, true)}
        onMouseLeave={() => handleSemesterHover(null, popperSemester!, false)}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper elevation={20}>
              {popperSemester && (
                <SemesterPlanOverview
                  plan={popperSemester.plan}
                  selectedSpecialization={popperSemester.spec}
                  readOnly={true}
                />
              )}
            </Paper>
          </Fade>
        )}
      </Popper>
      {myMasterPlans && user && (
        <StyledAccordian defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            {user.name}
            {`'`}s master plans ({myMasterPlans.length})
          </AccordionSummary>
          <AccordionDetails>
            {myMasterPlans.map((plan) => (
              <Card variant="outlined" key={plan.id} sx={{ mt: 1 }}>
                <CardContent>
                  <MasterPlanPreview
                    masterplan={plan}
                    handleSemesterHover={handleSemesterHover}
                  ></MasterPlanPreview>
                </CardContent>
                <CardActions>
                  <Button>
                    <NextLink href={"/master/plan?id=" + plan.id}>
                      View plan
                    </NextLink>
                  </Button>
                </CardActions>
              </Card>
            ))}
          </AccordionDetails>
        </StyledAccordian>
      )}
      <StyledAccordian>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          All master plans ({allNotEmptyMasterPlans.length})
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              bgcolor: "background.paper",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <ProgramAndStartYearSelection
              allPrograms={allPrograms}
              setSelectedProgram={updateSelectedProgram}
              selectedProgram={selectedProgram}
              allStartYears={allStartYears}
              setSelectedStartYear={updateSelectedStartYear}
              selectedStartYear={selectedStartYear}
            />
          </Box>

          {filteredMasterPlans.map((plan) => (
            <Card variant="outlined" key={plan.id} sx={{ mt: 1 }}>
              <CardContent>
                <MasterPlanPreview
                  masterplan={plan}
                  handleSemesterHover={handleSemesterHover}
                ></MasterPlanPreview>
              </CardContent>
              <CardActions>
                <Button>
                  <NextLink href={"/master/plan?id=" + plan.id}>
                    View plan
                  </NextLink>
                </Button>
                <Button>
                  <NextLink href={"/master/plan?id=" + plan.id}>
                    Duplicate
                  </NextLink>
                </Button>
              </CardActions>
            </Card>
          ))}
        </AccordionDetails>
      </StyledAccordian>
    </Box>
  );
}

function MasterPlanPreview({
  masterplan,
  handleSemesterHover,
}: {
  masterplan: MasterPlanResponseDTO;
  handleSemesterHover?: (
    event: React.MouseEvent<any>,
    plan: SemesterPlanWithSpec,
    open: boolean,
  ) => void;
}) {
  const plan = masterplan.plan;

  return (
    <Box>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {plan.program.name}, {specLabel(plan.specialization)}
      </Typography>
      <Typography sx={{ fontSize: 10 }} color="text.secondary" gutterBottom>
        {plan.startYear.name}
      </Typography>
      <Typography variant="h5" component="div">
        {masterplan.title}
      </Typography>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: 250 }}>
          <SemestersOverview
            masterplan={masterplan}
            handleSemesterHover={handleSemesterHover}
          />
        </Box>
        <Box
          sx={{
            width: 800,
            px: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <SpecializationOverview masterplan={masterplan} size={300} />
        </Box>
      </Box>
    </Box>
  );
}
