// For faster development reasons, I have only used middleware which is just a proxy but not really bulletproof
// In real usecases, I could have used trpc, better-auth, or some similar logic to always ensure who is visting the route and whether they are eligible to call specific endspoints or not on root server components. 
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { UserType } from "./generated/prisma/enums";

const JWT_SECRET = new TextEncoder().encode("james");

const PUBLIC_PATHS = ["/signin", "/signup", "/api"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allowing nextjs paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // To allow auth paths to be used by anyone
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  if (!token) {
    console.log('token not exist');
    return redirect(req, '/signin');
  }

  try {
    const data = await jwtVerify(token, JWT_SECRET);
    console.log('payload ', data.payload);
    if(data.payload?.role) {
      const userRole = data.payload.role as UserType;
      if(userRole === 'NORMAL') {
        if(pathname.startsWith('/admin')) {
          return redirect(req, '/');
        }
        return NextResponse.next();
      }
      else {
        return NextResponse.next();
      }
    }
    else {
      return redirect(req, '/signin');
    }
  } catch {
    console.log('failed');
    return redirect(req, '/signin');
  }
}



function redirect(req: NextRequest, to: string) {
  const url = new URL(to, req.url);
  return NextResponse.redirect(url);
}
