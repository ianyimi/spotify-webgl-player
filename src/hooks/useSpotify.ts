import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { SpotifyApi } from "../server/context";

export default function useSpotify() {

	const { data: session, status } = useSession();

	useEffect( () => {

		if ( session ) {

			if ( session.error === "ResfreshAccessTokenError" ) {

				signIn( "spotify", { callbackUrl: "/" } );

			}

			SpotifyApi.setAccessToken( session.user.accessToken );

		}

	}, [ session ] );

	return SpotifyApi;

}


