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

// export function formatZodErrors(error: z.ZodError) {
//   const flattened = z.flattenError(error);

//   console.error('Validation errors:', flattened);

//   // return Object.fromEntries(
//   //   Object.entries(flattened.fieldErrors).map(([key, value]) => [
//   //     key,
//   //     value
//   //   ])
//   // );
//   return flattened
// }