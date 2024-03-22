import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: 64,
        backgroundColor: "#1565c0",
      }}
    >
      <Link href="/">
        <Image alt="Home Button" src="/favicon.ico" width={64} height={64} />
      </Link>
      <NavBarLink link="/rooms" label="Rooms" />
    </Box>
  );
}

const NavBarLink = ({ link, label }: { link: string; label: string }) => {
  return (
    <Link href={link} style={{ textDecoration: "none", color: "inherit" }}>
      <Box
        sx={{
          height: 64,
          paddingX: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": {
            backgroundColor: "#2575d0"
          }
        }}
      >
        {label}
      </Box>
    </Link>
  );
};
