import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = [
  "https://staging.shalomworship.pages.dev",
  "https://www.shalomworship.com",
  "https://dashboard.shalomworship.com",
  "http://localhost:3000",
  "http://localhost:3001",
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  const response =
    request.method === "OPTIONS"
      ? new NextResponse(null, { status: 204 })
      : NextResponse.next();

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export const config = {
  matcher: "/api/:path*",
};  