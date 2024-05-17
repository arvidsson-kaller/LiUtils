"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect } from "react";
import { ExpandMore } from "@mui/icons-material";
import {
  MasterPlanResponseDTO,
  MasterProgramDTO,
  ProgramsResponseDTO,
  StartYearDTO,
  StartYearResponseDTO,
  UserDTO,
} from "@/lib/backend-client";
import { specLabel } from "@/lib/master/helpers";
import SpecializationOverview from "./master/overview/SpecializationOverview";
import SemestersOverview from "./master/overview/SemestersOverview";
import NextLink from "./NextLink";
import { ProxyBackendService } from "@/lib/backend";
import { ProgramAndStartYearSelection } from "./master/plan/ProgramAndStartYearSelection";
import Image from "next/image";

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
                  <MasterPlanPreview masterplan={plan}></MasterPlanPreview>
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
                <MasterPlanPreview masterplan={plan}></MasterPlanPreview>
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
}: {
  masterplan: MasterPlanResponseDTO;
}) {
  const plan = masterplan.plan;
  const user = masterplan.user;
  return (
    <Box>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {plan.program.name}, {specLabel(plan.specialization)}
      </Typography>
      <Typography sx={{ fontSize: 10 }} color="text.secondary" gutterBottom>
        {plan.startYear.name}
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        {user.picture ? (
          <Avatar>
            <Image src={user.picture} alt={user.name} fill sizes="40px" />
          </Avatar>
        ) : (
          <Avatar>{user.name.at(0)?.toUpperCase()}</Avatar>
        )}

        <Typography variant="h5" component="div">
          {masterplan.title}
          <Typography sx={{ fontSize: 12 }} component="div">
            by {user.name}
          </Typography>
        </Typography>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: 250 }}>
          <SemestersOverview masterplan={masterplan} />
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
