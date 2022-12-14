import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

export const spotifyApi = new SpotifyWebApi( {
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
} );

export default function useSpotify() {

  const { data: session, status } = useSession();

  useEffect( () => {

    if (session) {

      if (session.error === "ResfreshAccessTokenError") {

        console.log( "error" );
        signIn( "spotify", { callbackUrl: "/" } );

      }

      spotifyApi.setAccessToken( session.user.accessToken );


    }

  }, [ session ] );

  return spotifyApi;

}


