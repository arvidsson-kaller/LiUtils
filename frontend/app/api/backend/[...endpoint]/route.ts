import { getUserSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const proxy = async (
  request: NextRequest,
  { params }: { params: { endpoint: string[] } },
) => {
  if (!process.env.BACKEND_URL) {
    return new NextResponse("Incorrectly configured backend options", {
      status: 500,
    });
  }

  const url = `${process.env.BACKEND_URL!}/${params.endpoint.join("/")}`;
  const backendRequest: RequestInit = {
    headers: {},
    method: request.method
  }

  // Try to append json body
  try {
    const body = await request.json();
    backendRequest.body = JSON.stringify(body);
    backendRequest.headers = {
      'Content-Type': 'application/json',
      ...backendRequest.headers
    };
  } catch (error) {

  }

  // Try to append user backend auth
  try {
    const user = await getUserSession();
    const userBackendJwt = user?.backendJwt;
    backendRequest.headers = {
      "authorization": `Bearer ${userBackendJwt}`,
      ...backendRequest.headers
    };
  } catch (error) {

  }

  // send request to backend
  const resp = await fetch(url, backendRequest);
  const status = resp.status;
  try {
    // Try to extract json
    const jsonResp = await resp.json();
    console.log({ jsonResp });
    return Response.json(jsonResp, {
      status,
    });
  } catch (error) {
    return new NextResponse(null, {
      status
    });
  }
};


export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
