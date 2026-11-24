import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection';
import { getServerSession } from '@/lib/auth-server';

type Session = NonNullable<
  Awaited<ReturnType<typeof getServerSession>>
>;

type AuthUser = NonNullable<Session["user"]>;

type AuthenticatedHandler = (
  req: NextRequest,
  user: AuthUser
) => Promise<Response>;

export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest): Promise<Response> => {
    await dbConnect();

    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return handler(req, session.user);
  };
}