import { Box, Button } from "@mui/material";
import Link from "next/link";

export default function SignIn() {
  return (
    <Box>
      <Link href={"/api/auth/signin"}>
        <Button variant="contained">Sign In</Button>
      </Link>
    </Box>
  );
}
