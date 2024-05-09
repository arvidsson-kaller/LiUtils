import { Box, Button, Container, Fab, Popper } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import React from "react";
import { getUserSession, getUserSessionBackendService } from "@/lib/session";
import MasterPlanFirstPage from "@/components/MasterPlanFirstPage";

export default async function Master() {
  const user = await getUserSession();
  const backend = await getUserSessionBackendService();
  const myMasterPlans = await backend.getMyMasterPlans();
  const allMasterPlans = await backend.getAllMasterPlans();

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
      />
    </Container>
  );
}

const InfoPopper = ({ info }: { info: string }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const infoRef = React.useRef(null);

  return info ? (
    <>
      <Button ref={infoRef} onClick={() => setOpen(!open)}>
        <InfoIcon />
      </Button>
      <Popper open={open} anchorEl={infoRef.current} placement="right">
        <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>{info}</Box>
      </Popper>
    </>
  ) : (
    <></>
  );
};
