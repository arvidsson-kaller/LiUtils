import { MazeMapRoomData, getMazeMapRoomData } from "@/lib/mazemapdata";
import { Box } from "@mui/material";

export const MazeMapComponent = async ({ roomName }: { roomName: string }) => {
  const roomData: MazeMapRoomData | undefined =
    await getMazeMapRoomData(roomName);
  return roomData ? (
    <>
      <h3>
        {roomData.campusName} - {roomData.buildingName}
      </h3>
      <p>{roomData.typeName}</p>
      <Box sx={{ height: "65vh", width: "100%" }}>
        <iframe
          width="100%"
          height="100%"
          src={`https://use.mazemap.com/embed.html#v=1&campusid=${roomData.campusId}&sharepoitype=poi&zoom=16&sharepoi=${roomData.poiId}&utm_medium=iframe`}
          allow="geolocation"
        ></iframe>
        <span>
          <a href="https://www.mazemap.com/">Map by MazeMap</a>
        </span>
      </Box>
    </>
  ) : (
    <span>No MazeMap data found for room</span>
  );
};
