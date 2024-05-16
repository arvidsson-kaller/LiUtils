import { ProxyBackendService } from "@/lib/backend";
import { MasterPlan } from "@/lib/backend-client";
import { Fab } from "@mui/material";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React from "react";
import SaveIcon from "@mui/icons-material/Save";

export function SaveButton({
  id,
  planTitle,
  currentPlan,
  isOwnPlan,
}: {
  id: string | null | undefined;
  planTitle: string;
  currentPlan: MasterPlan;
  isOwnPlan: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const [buttonText, setButtonText] = React.useState("Save");
  const [successState, setSuccessState] = React.useState<
    "success" | "error" | "info" | "warning" | undefined
  >("info");

  const waitAndReset = (time: number = 3000) => {
    setTimeout(() => {
      setButtonText("Save");
      setSuccessState("info");
    }, time);
  };

  return (
    <Fab
      sx={{ position: "fixed", bottom: 140, right: 24 }}
      variant="extended"
      color={successState}
      onClick={() => {
        setButtonText("Saving...");
        if (id && isOwnPlan) {
          ProxyBackendService.updateMasterPlan({
            id: Number(id),
            requestBody: { title: planTitle, plan: currentPlan },
          })
            .then(() => {
              setButtonText("Saved changes successfully");
              setSuccessState("success");
              waitAndReset();
            })
            .catch(() => {
              setButtonText("Failed to save");
              setSuccessState("error");
              waitAndReset();
            });
        } else {
          ProxyBackendService.createMasterPlan({
            requestBody: {
              title: !isOwnPlan ? "Copy of " + planTitle : planTitle,
              plan: currentPlan,
            },
          })
            .then((response) => {
              router.push(
                pathname +
                  "?" +
                  createQueryString("id", response.id.toString()),
              );
              setButtonText("Saved to new plan successfully");
              setSuccessState("success");
              waitAndReset();
            })
            .catch(() => {
              setButtonText("Failed to save");
              setSuccessState("error");
              waitAndReset();
            });
        }
      }}
    >
      <SaveIcon />
      {buttonText}
    </Fab>
  );
}
