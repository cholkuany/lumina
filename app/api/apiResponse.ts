export function apiResponse(
  message: string,
  status: number,
  data: unknown = null,
  errors: unknown = null) {
  return Response.json(
    {
      success: status >= 200 && status < 300,
      message,
      data,
      errors
    },
    { status }
  );
}
