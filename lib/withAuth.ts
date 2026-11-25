import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection';
import { getServerSession } from '@/lib/auth-server';

type Session = NonNullable<
  Awaited<ReturnType<typeof getServerSession>>
>;

type AuthUser = NonNullable<Session["user"]>;
type ParamObj = Record<string, string>
type RouteContext<P = ParamObj> = { params: Promise<P> }

type AuthenticatedHandler<P> = (
  req: NextRequest,
  user: AuthUser,
  ctx: RouteContext<P>
) => Promise<Response>;

export function withAuth<P = ParamObj>(handler: AuthenticatedHandler<P>) {
  return async (req: NextRequest, ctx: RouteContext<P>): Promise<Response> => {
    await dbConnect();

    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return handler(req, session.user, ctx);
  };
}

type Role = AuthUser["role"];

export function withRole(allowed: Role | Role[], handler: AuthenticatedHandler<ParamObj>) {
  const roles = Array.isArray(allowed) ? allowed : [allowed];

  return withAuth(async (req, user, ctx) => {
    if (!roles.includes(user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return handler(req, user, ctx);
  });
}

export const withAdmin = (handler: AuthenticatedHandler<ParamObj>) =>
  withRole("admin", handler);