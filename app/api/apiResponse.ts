import { NextResponse } from "next/server";

export function apiResponse(
  message: string,
  status: number,
  data: unknown = null,
  errors: unknown = null) {
  return NextResponse.json(
    {
      success: status >= 200 && status < 300,
      message,
      data,
      errors
    },
    { status }
  );
}
