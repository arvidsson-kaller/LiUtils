import { getAllRooms } from "@/lib/allrooms";
import { Container, Box } from "@mui/material";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LiUtils - Room Index",
  description:
    "List of all Linköping University (LiU) Rooms with links to their information pages.",
};

export default function Rooms() {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.2,
        paddingBottom: 10,
      }}
    >
      <h1>Room Index</h1>
      {getAllRooms().map((room) => (
        <Box key={room}>
          <Link href={`/room/${room.replace("/", "%2F")}`}>{room}</Link>
        </Box>
      ))}
    </Container>
  );
}
