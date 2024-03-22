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

export interface MazeMapRoomData {
  campusName: String;
  buildingName: String;
  typeName: String;
  campusId: Number;
  poiId: Number;
}

export const getMazeMapRoomData = async (
  roomName: string,
): Promise<MazeMapRoomData | undefined> => {
  // TODO: Request backend first, then try mazemap
  const liuCampusIDS = {
    Valla: 742,
    Norrköping: 754,
    US: 781,
    Lidingö: 753,
  };
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
      break;
    }
  }
  if (!roomData) {
    return undefined;
  }

  return {
    campusName: roomData.campusName,
    buildingName: roomData.dispBldNames[0],
    typeName: roomData.dispTypeNames[0],
    campusId: roomData.campusId,
    poiId: roomData.poiId,
  };
};
