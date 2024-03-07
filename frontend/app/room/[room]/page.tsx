import { rooms } from "@/allrooms";
import { MazeMapComponent } from "@/components/MazeMapComponent";
import { Container } from "@mui/material";
import { Metadata } from "next";

// export const dynamicParams = false;

export const generateStaticParams = async () => {
  // const res = await fetch(process.env.URL + "/api/allrooms", { next: { revalidate: 3600 } });
  // if (!res.ok) {
  //   return [];
  // }
  // const rooms: string[] = await res.json();
  const paths = rooms.map((room) => ({
    params: { room: encodeURIComponent(room) },
  }));
  return paths;
};

export const generateMetadata = ({
  params,
}: {
  params: RoomParam;
}): Metadata => {
  const roomName = decodeURIComponent(params.room);
  return {
    title: roomName,
    description: `All relevant information about Linköping University LiU room ${roomName}. 
This includes a map and its schedule`,
  };
};
interface RoomParam {
  room: string;
}

export default async function Room({ params }: { params: RoomParam }) {
  const roomName = decodeURIComponent(params.room);
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        minHeight: "100vh",
        overflowY: "hidden",
      }}
    >
      <h1>{roomName}</h1>
      <MazeMapComponent roomName={roomName} />
    </Container>
  );
}
