import { unstable_getServerSession } from "next-auth";
import SpotifyWebApi from "spotify-web-api-node";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

export const SpotifyApi = new SpotifyWebApi( {
	clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
	clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
} );

export async function createContext( { req, res }: CreateNextContextOptions ) {

	const session = await unstable_getServerSession( req, res, authOptions );

	if ( ! session ) return {
		redirect: {
			destination: "login",
			permanent: false
		},
	};

	res.setHeader(
		'Cache-Control',
		'public, s-maxage=10, stale-while-revalidate=59'
	);

	SpotifyApi.setAccessToken( session.user.accessToken );

	return {
		session
	};

}

export type SessionContext = inferAsyncReturnType<typeof createContext>
