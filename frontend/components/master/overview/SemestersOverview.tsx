import { MasterPlanResponseDTO, SemesterPlan } from "@/lib/backend-client";
import { getNumericCourseCredit } from "@/lib/utils";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import React from "react";

export interface SemesterPlanWithSpec {
  plan: SemesterPlan;
  spec: string;
}

export default function SemestersOverview({
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
            <ListItemText primary={semester} secondary={credits + " credits"} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
