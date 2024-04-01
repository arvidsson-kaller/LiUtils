import { getUserSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const proxy = async (
  request: NextRequest,
  { params }: { params: { endpoint: string[] } },
) => {
  const user = await getUserSession();
  if (!user?.id) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }
  if (!process.env.BACKEND_URL || !process.env.BACKEND_API_KEY) {
    return new NextResponse("Incorrectly configured backend options", {
      status: 500,
    });
  }
  const backendRequest = new NextRequest(
    `${process.env.BACKEND_URL!}/${params.endpoint.join("/")}`,
    request,
  );
  backendRequest.headers.append(
    "api-key",
    `${process.env.BACKEND_API_KEY!}${user.id}`,
  );
  return await fetch(backendRequest);
};

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
