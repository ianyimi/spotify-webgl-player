import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.JWT_SECRET;

export async function middleware( req ) {

	const token = await getToken( { req, secret } );

	if ( ( Boolean( req.nextUrl.pathname.includes( "/api/auth" ) ) ) || token ) {

		return NextResponse.next();

	}

	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	if ( ! token && req.nextUrl.href.includes( "localhost:3000" ) && req.nextUrl.pathname === "/" ) {

		return NextResponse.redirect( "http://localhost:3000/login" );

	}

}
