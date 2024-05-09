import { ProxyBackendService } from "@/lib/backend";
import { Fab } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

export function DeleteButton({ id }: { id: string | null | undefined }) {
  const router = useRouter();

  const confirmMessage = "Are you sure?";

  const [buttonText, setButtonText] = React.useState("Delete");
  const [successState, setSuccessState] = React.useState<
    "success" | "error" | "info" | "warning" | undefined
  >("error");

  const waitAndReset = (time: number = 3000) => {
    setTimeout(() => {
      setButtonText("Delete");
      setSuccessState("error");
    }, time);
  };
  if (!id) {
    return <></>;
  }

  return (
    <Fab
      sx={{ position: "fixed", bottom: 20, right: 24 }}
      variant="extended"
      color={successState}
      onClick={() => {
        if (buttonText === "Delete") {
          setButtonText(confirmMessage);
          waitAndReset(5000);
        } else if (buttonText === confirmMessage) {
          setButtonText("Deleting...");
          ProxyBackendService.deleteMasterPlanById({
            id: Number(id),
          })
            .then(() => {
              setButtonText("Plan deleted successfully");
              setSuccessState("success");
              waitAndReset();
              localStorage.removeItem("savedPlan");
              router.push("/master");
            })
            .catch(() => {
              setButtonText("Failed to delete");
              setSuccessState("error");
              waitAndReset();
            });
        }
      }}
    >
      <DeleteIcon />
      {buttonText}
    </Fab>
  );
}
