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
import React from "react";
import { ExpandMore } from "@mui/icons-material";
import {
  MasterPlanResponseDTO,
  SemesterPlan,
  UserDTO,
} from "@/lib/backend-client";
import { SemesterPlanOverview } from "./master/overview/SemesterPlanOverview";
import { specLabel } from "@/lib/master/helpers";
import SpecializationOverview from "./master/overview/SpecializationOverview";
import SemestersOverview from "./master/overview/SemestersOverview";
import NextLink from "./NextLink";

const StyledAccordian = styled(Accordion)({
  width: "100%",
});

export default function MasterPlanFirstPage({
  myMasterPlans,
  allMasterPlans,
  user,
}: {
  myMasterPlans: MasterPlanResponseDTO[];
  allMasterPlans: MasterPlanResponseDTO[];
  user: UserDTO;
}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [open, setOpen] = React.useState(false);
  const [popperPlan, setPopperPlan] = React.useState<SemesterPlan>();

  const handleClick = (event: React.MouseEvent<any>, plan: SemesterPlan) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => popperPlan?.name !== plan.name || !prev);
    setPopperPlan(plan);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Popper
        sx={{ zIndex: 1200 }}
        open={open}
        anchorEl={anchorEl}
        placement={"right"}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper elevation={20}>
              {popperPlan && (
                <SemesterPlanOverview
                  plan={popperPlan}
                  selectedSpecialization=""
                />
              )}
            </Paper>
          </Fade>
        )}
      </Popper>
      <StyledAccordian defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          {user.name}'s master plans ({myMasterPlans.length})
        </AccordionSummary>
        <AccordionDetails>
          {myMasterPlans.map((plan) => (
            <Card variant="outlined" key={plan.id} sx={{ mt: 1 }}>
              <CardContent>
                <MasterPlanPreview
                  masterplan={plan}
                  onSemesterClick={handleClick}
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
      <StyledAccordian>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          All master plans ({allMasterPlans.length})
        </AccordionSummary>
        <AccordionDetails>
          {allMasterPlans.map((plan) => (
            <Card variant="outlined" key={plan.id} sx={{ mt: 1 }}>
              <CardContent>
                <MasterPlanPreview
                  masterplan={plan}
                  onSemesterClick={handleClick}
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
  onSemesterClick,
}: {
  masterplan: MasterPlanResponseDTO;
  onSemesterClick?: (event: React.MouseEvent<any>, plan: SemesterPlan) => void;
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
            onSemesterClick={onSemesterClick}
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
