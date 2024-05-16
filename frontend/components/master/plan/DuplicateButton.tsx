import { ProxyBackendService } from "@/lib/backend";
import { MasterPlan } from "@/lib/backend-client";
import { Fab } from "@mui/material";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React from "react";
import FileCopyIcon from '@mui/icons-material/FileCopy';

export function DuplicateButton({
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

  const [buttonText, setButtonText] = React.useState("Duplicate");
  const [successState, setSuccessState] = React.useState<
    "success" | "error" | "info" | "warning" | undefined
  >("info");

  const waitAndReset = (time: number = 3000) => {
    setTimeout(() => {
      setButtonText("Duplicate");
      setSuccessState("info");
    }, time);
  };

  return (
    <Fab
      sx={{ position: "fixed", bottom: 20, right: 24 }}
      variant="extended"
      color={successState}
      onClick={() => {
        setButtonText("Duplicating...");
        if (id) {
          ProxyBackendService.createMasterPlan({
            requestBody: { title: "Copy of " + planTitle, plan: currentPlan },
          })
            .then((response) => {
              router.push(
                pathname +
                  "?" +
                  createQueryString("id", response.id.toString()),
              );
              setButtonText("Duplicated plan successfully");
              setSuccessState("success");
              waitAndReset();
            })
            .catch(() => {
              setButtonText("Failed to duplicate");
              setSuccessState("error");
              waitAndReset();
            });
        }
      }}
    >
      <FileCopyIcon />
      {buttonText}
    </Fab>
  );
}
