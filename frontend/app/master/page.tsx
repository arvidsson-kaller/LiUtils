import { Container, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import React from "react";
import { getUserSession, getUserSessionBackendService } from "@/lib/session";
import MasterPlanFirstPage from "@/components/MasterPlanFirstPage";
import { BackendService } from "@/lib/backend";
export const revalidate = 0;

export default async function Master() {
  const user = await getUserSession();
  let myMasterPlans = undefined;
  if (user) {
    const backend = await getUserSessionBackendService();
    myMasterPlans = await backend.getMyMasterPlans();
  }

  const allMasterPlans = await BackendService.getAllMasterPlans();
  const allPrograms = await BackendService.getAllPrograms();

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Link href="master/plan">
        <Fab
          sx={{ position: "fixed", top: 80, right: 24 }}
          variant="extended"
          color="success"
        >
          <AddIcon />
          Make Plan
        </Fab>
      </Link>
      <MasterPlanFirstPage
        user={user}
        myMasterPlans={myMasterPlans}
        allMasterPlans={allMasterPlans}
        allPrograms={allPrograms}
      />
    </Container>
  );
}
