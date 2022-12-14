import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.JWT_SECRET;

export async function _middleware( req ) {

  const token = await getToken( { req, secret } );
  const nextUrl = req.nextUrl;

  if (( Boolean( nextUrl.pathname.includes( "/api/auth" ) ) ) || token) {

    return NextResponse.next();

  }

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (! token && nextUrl.href.includes( "localhost:3000" ) && ( nextUrl.pathname === "/" || nextUrl.pathname.includes( "/playlist" ) )) {

    return NextResponse.redirect( "http://localhost:3000/login" );

  }

}
