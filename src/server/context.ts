import { unstable_getServerSession } from "next-auth";
import SpotifyWebApi from "spotify-web-api-node";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export const SpotifyApi = new SpotifyWebApi( {
	clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
	clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
} );

export async function createContext( { req, res } ) {

	const session = await unstable_getServerSession( req, res, authOptions );
	console.log( "🚀 ~ file: context.ts:13 ~ createContext ~ session", session );

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

}
