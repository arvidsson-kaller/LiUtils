import { Box } from "@mui/material";

interface MazeMapGeometry {
  type: string;
  coordinates: [number, number];
}

interface MazeMapPoint {
  type: string;
  coordinates: [number, number];
}

interface MazeMapResult {
  poiId: number;
  kind: string;
  nodeId: null;
  geometry: MazeMapGeometry;
  point: MazeMapPoint;
  campusId: number;
  floorId: number;
  floorName: null;
  buildingId: number;
  buildingName: null;
  identifierId: null;
  identifier: string;
  title: string;
  deleted: boolean;
  infos: string[];
  types: string[];
  z: null;
  infoUrl: null;
  infoUrlText: null;
  description: null;
  images: string[];
  peopleCapacity: null;
  solrId: string;
  score: number;
  zValue: number;
  zName: string;
  dispTypeNames: string[];
  campusName: string;
  dispBldNames: string[];
  dispPoiNames: string[];
  poiNames: string[];
  bldId: number;
  typeIds: number[];
  typeNames: string[];
  priorityTypeIds: number[];
  priorityTypeNames: string[];
}

interface MazeMapSearchApiResponse {
  result: MazeMapResult[];
}

export const MazeMapComponent = async ({ roomName }: { roomName: string }) => {
  const liuCampusIDS = {
    Valla: 742,
    Norrköping: 754,
    US: 781,
    Lidingö: 753,
  };
  let seletedCampus: number | undefined;
  let roomData: MazeMapResult | undefined;
  for (const campusId of Object.values(liuCampusIDS)) {
    const staticData = await fetch(
      `https://search.mazemap.com/search/equery/?q=${roomName}&rows=10&start=0&withpois=true&withcampus=true&campusid=${campusId}`,
    );
    const mazeMapSearch: MazeMapSearchApiResponse = await staticData.json();
    roomData = mazeMapSearch.result
      .filter((room) => room?.poiNames?.includes(roomName))
      .at(0);
    if (roomData) {
      seletedCampus = campusId;
      break;
    }
  }
  return roomData ? (
    <>
      <h3>
        {roomData.campusName} - {roomData.dispBldNames.at(0)}
      </h3>
      <p>{roomData.dispTypeNames.at(0)}</p>
      <Box sx={{ height: "65vh", width: "100%" }}>
        <iframe
          width="100%"
          height="100%"
          src={`https://use.mazemap.com/embed.html#v=1&campusid=${seletedCampus}&sharepoitype=poi&zoom=16&sharepoi=${roomData.poiId}&utm_medium=iframe`}
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
