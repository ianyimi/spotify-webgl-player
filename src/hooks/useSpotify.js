import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import SpotifyApiJS from "spotify-web-api-js";

export const spotifyApi = new SpotifyApiJS();

export const spotifyApiNode = new SpotifyWebApi( {
	clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
	clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
} );

export default function useSpotify() {

	const { data: session, status } = useSession();

	useEffect( () => {

		if ( session ) {

			if ( session.error === "ResfreshAccessTokenError" ) {

				console.log( "error" );
				signIn( "spotify", { callbackUrl: "/" } );

			}

			spotifyApi.setAccessToken( session.user.accessToken );
			spotifyApiNode.setAccessToken( session.user.accessToken );

		}

	}, [ session ] );

	return spotifyApi;

}
