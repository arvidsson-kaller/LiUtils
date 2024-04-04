import studieinfo from "./studieinfo.json";

export async function GET() {
  return Response.json(studieinfo);
}
