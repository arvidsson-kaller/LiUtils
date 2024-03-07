import { Box, Container } from "@mui/material";
import { GetStaticPaths } from "next";
import { Metadata } from "next";

export const generateMetadata = ({
  params,
}: {
  params: RoomParam;
}): Metadata => {
  return {
    title: params.room,
    description: `All relevant information about Linköping University LiU room ${params.room}. 
This includes a map and its schedule`,
  };
};
interface RoomParam {
  room: string;
}

export default function Room({ params }: { params: RoomParam }) {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>{params.room}</h1>
    </Container>
  );
}

export const getStaticPaths = (async () => {
  const res = await fetch(process.env.URL + "/api/allrooms");
  const rooms: string[] = await res.json();
  const paths = rooms.map((room) => ({
    params: { room: room },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}) satisfies GetStaticPaths;
