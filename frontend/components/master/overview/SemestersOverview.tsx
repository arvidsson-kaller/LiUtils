import { MasterPlanResponseDTO, SemesterPlan } from "@/lib/backend-client";
import { getNumericCourseCredit } from "@/lib/utils";
import {
  Fade,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
} from "@mui/material";
import React from "react";
import { SemesterPlanOverview } from "./SemesterPlanOverview";

export interface SemesterPlanWithSpec {
  plan: SemesterPlan;
  spec: string;
}

export default function SemestersOverview({
  masterplan,
}: {
  masterplan: MasterPlanResponseDTO;
}) {
  const plan = masterplan.plan;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [open, setOpen] = React.useState(false);
  const [popperSemester, setPopperPlan] =
    React.useState<SemesterPlanWithSpec>();
  const handleSemesterHover = React.useCallback(
    (
      event: React.MouseEvent<any> | null,
      plan: SemesterPlanWithSpec,
      open: boolean,
    ) => {
      if (event) {
        setAnchorEl(event.currentTarget);
      }
      setOpen(open);
      setPopperPlan(plan);
    },
    [],
  );

  const creditsPerSemester = React.useMemo(() => {
    const plan = masterplan.plan;
    const creditsPerSemester: any = {};
    const uniqueCourses = new Set();
    plan.semesters.forEach((s) =>
      s.periods.forEach((p) =>
        p.courses.forEach((c) => {
          if (!uniqueCourses.has(c.courseName)) {
            uniqueCourses.add(c.courseName);
            if (!creditsPerSemester[s.name]) {
              creditsPerSemester[s.name] = 0;
            }
            creditsPerSemester[s.name] += getNumericCourseCredit(c);
          }
        }),
      ),
    );
    return Object.entries(creditsPerSemester);
  }, [masterplan]);

  return (
    <>
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
      <List>
        {creditsPerSemester.map(([semester, credits]) => (
          <ListItem disablePadding key={semester}>
            <ListItemButton
              onMouseOver={(e) =>
                handleSemesterHover &&
                handleSemesterHover(
                  e,
                  {
                    plan: plan.semesters.find((s) => s.name == semester)!,
                    spec: plan.specialization,
                  },
                  true,
                )
              }
              onMouseLeave={(e) =>
                handleSemesterHover &&
                handleSemesterHover(
                  e,
                  {
                    plan: plan.semesters.find((s) => s.name == semester)!,
                    spec: plan.specialization,
                  },
                  false,
                )
              }
            >
              <ListItemText
                primary={semester}
                secondary={credits + " credits"}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
