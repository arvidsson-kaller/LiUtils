"use client";
import { ProxyBackendService } from "@/lib/backend";
import { UserDTO } from "@/lib/backend-client";
import {
  Box,
  Container,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import React from "react";

export default function Users() {
  const [users, setUsers] = React.useState<UserDTO[]>([]);

  const fetchUser = async () => {
    const res = await ProxyBackendService.getUsers();
    setUsers(res.users);
  };
  return (
    <Container>
      <Box
        sx={{
          height: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Fetch users test</h1>
        <Button onClick={fetchUser}>Fetch users</Button>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">name</TableCell>
                <TableCell align="right">email</TableCell>
                <TableCell align="right">createdAt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="user">
                    {user.id}
                  </TableCell>
                  <TableCell align="right">{user.name}</TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                  <TableCell align="right">{user.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
