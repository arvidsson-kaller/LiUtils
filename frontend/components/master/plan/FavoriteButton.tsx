import { ProxyBackendService } from "@/lib/backend";
import { Fab } from "@mui/material";
import React from "react";
import { StarOutline } from "@mui/icons-material";

export function FavoriteButton({
  id,
  isOwnPlan,
}: {
  id: string | null | undefined;
  isOwnPlan: boolean;
}) {
  const confirmMessage = "Are you sure?";

  const [buttonText, setButtonText] = React.useState("Favorite");
  const [successState, setSuccessState] = React.useState<
    "success" | "error" | "info" | "warning" | undefined
  >("warning");

  const waitAndReset = (time: number = 3000) => {
    setTimeout(() => {
      setButtonText("Favorite");
      setSuccessState("warning");
    }, time);
  };
  if (!id || !isOwnPlan) {
    return <></>;
  }

  return (
    <Fab
      sx={{ position: "fixed", bottom: 80 + 60 + 60, right: 24 }}
      variant="extended"
      color={successState}
      onClick={() => {
        if (buttonText === "Favorite") {
          setButtonText(confirmMessage);
          waitAndReset(5000);
        } else if (buttonText === confirmMessage) {
          setButtonText("Setting as favorite...");
          ProxyBackendService.setChoosenMasterPlan({
            id: Number(id),
          })
            .then(() => {
              setButtonText("Plan set as favorite successfully");
              setSuccessState("success");
              waitAndReset();
            })
            .catch(() => {
              setButtonText("Failed to favorite");
              setSuccessState("error");
              waitAndReset();
            });
        }
      }}
    >
      <StarOutline></StarOutline>
      {buttonText}
    </Fab>
  );
}
