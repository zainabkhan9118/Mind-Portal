// Custom type declarations to fix Next.js route handler type issues
import { NextRequest, NextResponse } from 'next/server';

declare module 'next/dist/server/web/types' {
  interface NextRequestWithParams extends NextRequest {
    params: Record<string, string>;
  }
}

// Fix for route handlers
declare module 'next' {
  interface RequestHandler {
    (req: NextRequest, context: { params: Record<string, string> }): Promise<NextResponse> | NextResponse;
  }
}