import { getUserSession } from "@/lib/session";
import { Box } from "@mui/material";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import UserActionMenu from "./master/UserActionMenu";

const navBoxStyle = {
  height: 64,
  paddingX: 3,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    backgroundColor: "#2575d0",
  },
};

export default async function NavBar() {
  const user = await getUserSession();
  const session = await getServerSession();

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
      <NavBarLink link="/master" label="Master" />
      {/* <NavBarLink link="/users" label="Users" /> */}
      <Box sx={{ marginLeft: "auto" }}>
        <UserActionMenu
          user={user}
          imageUrl={session?.user?.image}
          navBoxStyle={navBoxStyle}
        />
      </Box>
    </Box>
  );
}

const NavBarLink = ({ link, label }: { link: string; label: string }) => {
  return (
    <Link href={link} style={{ textDecoration: "none", color: "inherit" }}>
      <Box sx={navBoxStyle}>{label}</Box>
    </Link>
  );
};
