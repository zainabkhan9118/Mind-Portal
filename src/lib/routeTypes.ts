import { NextRequest, NextResponse } from "next/server";

export interface RouteParams {
  params: {
    id: string;
  };
}

export type RouteHandlerFunction<T = unknown> = (
  request: NextRequest,
  params: RouteParams
) => Promise<NextResponse<T>>;