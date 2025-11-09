import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function will be called for every request that matches the `config`
export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next()

  // Get the origin of the request
  const origin = request.headers.get('Origin')

  // Set CORS headers based on the incoming request's origin
  if (origin === 'http://localhost:3001') {
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3001')
  } else if (origin === 'http://localhost:3002') {
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3002')
  }

  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS')
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  return response
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
}
