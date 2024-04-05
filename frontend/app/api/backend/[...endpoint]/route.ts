import { getUserSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const proxy = async (
  request: NextRequest,
  { params }: { params: { endpoint: string[] } },
) => {
  const user = await getUserSession();
  if (!process.env.BACKEND_URL) {
    return new NextResponse("Incorrectly configured backend options", {
      status: 500,
    });
  }
  const backendRequest = new NextRequest(
    `${process.env.BACKEND_URL!}/${params.endpoint.join("/")}`,
    request,
  );
  if (user?.backendJwt) {
    // If user is logged in, add authentication in request.
    backendRequest.headers.append("authorization", `Bearer ${user.backendJwt}`);
  }
  return await fetch(backendRequest);
};

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
