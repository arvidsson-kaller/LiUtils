"use client";

import { UserDTO } from "@/lib/backend-client";
import { Avatar, Box, Menu, MenuItem, SxProps, styled } from "@mui/material";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import React from "react";

const UserActionMenu = ({
  user,
  imageUrl,
  navBoxStyle,
}: {
  user: UserDTO | undefined;
  imageUrl: string | undefined | null;
  navBoxStyle: SxProps;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {user ? (
        <Box
          sx={{ ...navBoxStyle, gap: 2, cursor: "pointer" }}
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
        >
          {user.name}
          {imageUrl && (
            <Avatar>
              <Image src={imageUrl} alt={user.name} fill sizes="40px" />
            </Avatar>
          )}
        </Box>
      ) : (
        <Box
          sx={{ ...navBoxStyle, gap: 2, cursor: "pointer" }}
          onClick={() => {
            signIn();
          }}
        >
          Sign In
        </Box>
      )}

      <Menu
        sx={{ width: 300 }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          sx={{ width: anchorEl?.clientWidth }}
          onClick={() => {
            handleClose();
            signOut();
          }}
        >
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserActionMenu;
