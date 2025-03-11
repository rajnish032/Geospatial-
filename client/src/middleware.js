import { NextResponse } from 'next/server';

// Paths that should only be accessible when NOT logged in
const authPaths = ['/account/login', '/account/register'];

export async function middleware(request) {
  try {
    const isAuthenticated = request.cookies.get('accessToken')?.value; // ✅ Check for JWT token
    const path = request.nextUrl.pathname;

    // ✅ Redirect authenticated users away from login/register pages
    if (isAuthenticated && authPaths.includes(path)) {
      return NextResponse.redirect(new URL('/user/profile', request.url));
    }

    // ✅ Redirect unauthenticated users away from protected pages
    if (!isAuthenticated && path.startsWith('/user')) {
      return NextResponse.redirect(new URL('/account/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error occurred while checking authentication:', error);
    return NextResponse.redirect(new URL('/account/login', request.url)); // ✅ Handle errors gracefully
  }
}

export const config = {
  matcher: ['/user/:path*', '/account/login', '/account/register'],
};
